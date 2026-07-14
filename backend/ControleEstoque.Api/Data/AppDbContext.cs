using Microsoft.EntityFrameworkCore;
using ControleEstoque.Api.Models;

namespace ControleEstoque.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<MovimentacaoEstoque> Movimentacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Produto>()
            .HasIndex(p => p.Sku)
            .IsUnique();

        modelBuilder.Entity<Produto>().HasData(
            new Produto
            {
                Id = 1,
                Nome = "Caneta Esferografica Azul",
                Sku = "CAN-AZ-001",
                Descricao = "Caneta esferografica, ponta media, tinta azul",
                PrecoUnitario = 2.50m,
                QuantidadeEstoque = 100,
                DataCriacao = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                DataAtualizacao = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Produto
            {
                Id = 2,
                Nome = "Caderno Universitario 10 Materias",
                Sku = "CAD-UNI-010",
                Descricao = "Caderno espiral, capa dura, 200 folhas",
                PrecoUnitario = 24.90m,
                QuantidadeEstoque = 40,
                DataCriacao = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                DataAtualizacao = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}