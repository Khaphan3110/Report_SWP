using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SWPSolution.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFileLengthType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "FileSize",
                table: "ProductImages",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "AppUsers",
                keyColumn: "Id",
                keyValue: new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "8ee02dfe-fda5-4368-bc8f-b3a186a13b6f", "AQAAAAIAAYagAAAAEMWLDnITiMsZMAldmsCcWiPMCiS7Gj4YahMESN8OQ5QvLnAejxt+MNuGC+vln45H8w==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "FileSize",
                table: "ProductImages",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.UpdateData(
                table: "AppUsers",
                keyColumn: "Id",
                keyValue: new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "1dde7740-e0c0-4be8-ba4f-0bc142b0728a", "AQAAAAIAAYagAAAAEDEPBLGTqbgeM6KnKWAajUNbgZXIMEy4O5xQhh1GM+EzSOP4gZ/hhKG7Mg2KQwnI4A==" });
        }
    }
}
