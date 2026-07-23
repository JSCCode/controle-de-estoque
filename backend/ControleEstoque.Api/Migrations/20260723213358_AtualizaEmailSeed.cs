using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleEstoque.Api.Migrations
{
    /// <inheritdoc />
    public partial class AtualizaEmailSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "Email",
                value: "usuarioteste@gmail.com");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "Email",
                value: "teste@keener.com");
        }
    }
}
