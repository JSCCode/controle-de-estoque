namespace ControleEstoque.Api.Models;

public enum TipoMovimentacao
{
    Entrada,
    Saida
}

public class MovimentacaoEstoque
{
    public int Id { get; set; }

    public int ProdutoId { get; set; }
    public Produto Produto { get; set; } = null!;

    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public TipoMovimentacao Tipo { get; set; }
    public int Quantidade { get; set; }
    public DateTime Data { get; set; } = DateTime.UtcNow;
}