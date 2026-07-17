using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ControleEstoque.Api.Data;
using ControleEstoque.Api.Models;
using ControleEstoque.Api.DTOs;

namespace ControleEstoque.Api.Controllers;

[ApiController]
[Route("movimentacoes")]
[Authorize]
public class MovimentacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MovimentacoesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Registrar(MovimentacaoRequest request)
    {
        var produto = await _context.Produtos.FindAsync(request.ProdutoId);
        if (produto == null)
            return NotFound(new { mensagem = "Produto não encontrado." });

        if (request.Quantidade <= 0)
            return BadRequest(new { mensagem = "Quantidade deve ser maior que zero." });

        if (request.Tipo == TipoMovimentacao.Saida && request.Quantidade > produto.QuantidadeEstoque)
            return BadRequest(new { mensagem = "Quantidade de saída maior que o estoque disponível." });

        var usuarioIdTexto = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var usuarioId = int.Parse(usuarioIdTexto!);

        var movimentacao = new MovimentacaoEstoque
        {
            ProdutoId = request.ProdutoId,
            UsuarioId = usuarioId,
            Tipo = request.Tipo,
            Quantidade = request.Quantidade
        };

        if (request.Tipo == TipoMovimentacao.Entrada)
            produto.QuantidadeEstoque += request.Quantidade;
        else
            produto.QuantidadeEstoque -= request.Quantidade;

        produto.DataAtualizacao = DateTime.UtcNow;

        _context.Movimentacoes.Add(movimentacao);
        await _context.SaveChangesAsync();

        return Created($"/movimentacoes/{movimentacao.Id}", movimentacao);
    }

    [HttpGet("produto/{produtoId}")]
    public async Task<IActionResult> HistoricoPorProduto(int produtoId)
    {
        var movimentacoes = await _context.Movimentacoes
            .Where(m => m.ProdutoId == produtoId)
            .OrderByDescending(m => m.Data)
            .ToListAsync();

        return Ok(movimentacoes);
    }
}