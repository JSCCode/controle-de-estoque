using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ControleEstoque.Api.Data;
using ControleEstoque.Api.Models;
using ControleEstoque.Api.DTOs;

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
}