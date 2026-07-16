using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using ControleEstoque.Api.Data;
using ControleEstoque.Api.Models;
using ControleEstoque.Api.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace ControleEstoque.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<Usuario> _passwordHasher;

    public AuthController(AppDbContext context)
    {
        _context = context;
        _passwordHasher = new PasswordHasher<Usuario>();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var emailJaExiste = await _context.Usuarios
            .AnyAsync(u => u.Email == request.Email);

        if (emailJaExiste)
        {
            return Conflict(new { mensagem = "Este email já está cadastrado." });
        }

        var usuario = new Usuario
        {
            Nome = request.Nome,
            Email = request.Email
        };

        usuario.SenhaHash = _passwordHasher.HashPassword(usuario, request.Senha);

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Created($"/auth/usuarios/{usuario.Id}", new
        {
            usuario.Id,
            usuario.Nome,
            usuario.Email
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario == null)
            return Unauthorized(new { mensagem = "Email ou senha inválidos." });

        var resultado = _passwordHasher.VerifyHashedPassword(
            usuario, usuario.SenhaHash, request.Senha);

        if (resultado == PasswordVerificationResult.Failed)
            return Unauthorized(new { mensagem = "Email ou senha inválidos." });

        var token = GerarToken(usuario);

        return Ok(new { token });
    }

    [Authorize]
    [HttpGet("perfil")]
    public IActionResult Perfil()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;

        return Ok(new { userId, email });
    }
    

    private string GerarToken(Usuario usuario)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email)
        };

        var chave = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!));
        var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credenciais
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}