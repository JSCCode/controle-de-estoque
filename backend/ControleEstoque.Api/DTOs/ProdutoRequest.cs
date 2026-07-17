namespace ControleEstoque.Api.DTOs;

public class ProdutoRequest
{
    public string Nome { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public decimal PrecoUnitario { get; set; }
    public int QuantidadeEstoque { get; set; }
}