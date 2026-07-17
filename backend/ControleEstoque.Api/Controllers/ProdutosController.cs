using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleEstoque.Api.Data;
using ControleEstoque.Api.Models;
using ControleEstoque.Api.DTOs;

namespace ControleEstoque.Api.Controllers;

[ApiController]
[Route("produtos")]
[Authorize]
public class ProdutosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProdutosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var produtos = await _context.Produtos.ToListAsync();
        return Ok(produtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> BuscarPorId(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null)
            return NotFound(new { mensagem = "Produto não encontrado." });

        return Ok(produto);
    }

    [HttpPost]
    public async Task<IActionResult> Criar(ProdutoRequest request)
    {
        if (request.Nome.Length < 2)
            return BadRequest(new { mensagem = "Nome deve ter no mínimo 2 caracteres." });

        if (request.PrecoUnitario <= 0)
            return BadRequest(new { mensagem = "Preço deve ser maior que zero." });

        if (request.QuantidadeEstoque < 0)
            return BadRequest(new { mensagem = "Quantidade não pode ser negativa." });

        var skuJaExiste = await _context.Produtos.AnyAsync(p => p.Sku == request.Sku);
        if (skuJaExiste)
            return Conflict(new { mensagem = "SKU já cadastrado." });

        var produto = new Produto
        {
            Nome = request.Nome,
            Sku = request.Sku,
            Descricao = request.Descricao,
            PrecoUnitario = request.PrecoUnitario,
            QuantidadeEstoque = request.QuantidadeEstoque
        };

        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();

        return Created($"/produtos/{produto.Id}", produto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, ProdutoRequest request)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null)
            return NotFound(new { mensagem = "Produto não encontrado." });

        if (request.Nome.Length < 2)
            return BadRequest(new { mensagem = "Nome deve ter no mínimo 2 caracteres." });

        if (request.PrecoUnitario <= 0)
            return BadRequest(new { mensagem = "Preço deve ser maior que zero." });

        if (request.QuantidadeEstoque < 0)
            return BadRequest(new { mensagem = "Quantidade não pode ser negativa." });

        var skuEmUso = await _context.Produtos
            .AnyAsync(p => p.Sku == request.Sku && p.Id != id);
        if (skuEmUso)
            return Conflict(new { mensagem = "SKU já cadastrado em outro produto." });

        produto.Nome = request.Nome;
        produto.Sku = request.Sku;
        produto.Descricao = request.Descricao;
        produto.PrecoUnitario = request.PrecoUnitario;
        produto.QuantidadeEstoque = request.QuantidadeEstoque;
        produto.DataAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(produto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null)
            return NotFound(new { mensagem = "Produto não encontrado." });

        _context.Produtos.Remove(produto);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}