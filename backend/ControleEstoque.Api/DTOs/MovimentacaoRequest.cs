using ControleEstoque.Api.Models;

namespace ControleEstoque.Api.DTOs;

public class MovimentacaoRequest
{
    public int ProdutoId { get; set; }
    public TipoMovimentacao Tipo { get; set; }
    public int Quantidade { get; set; }
}