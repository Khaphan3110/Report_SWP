using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SWPSolution.Data.Migrations
{
    /// <inheritdoc />
    public partial class fixAppUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TemporaryPassword",
                table: "AppUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AppUsers",
                keyColumn: "Id",
                keyValue: new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "TemporaryPassword" },
                values: new object[] { "5b1ba429-121e-494f-afc0-7b7f0f9c557e", "AQAAAAIAAYagAAAAEAU489HC5zCpLuu3qIQWCOQ6CB/K5dCkXeqnwrn0UYgRPk2BWVDmcOE+ZpFM8cuNvg==", "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TemporaryPassword",
                table: "AppUsers");

            migrationBuilder.UpdateData(
                table: "AppUsers",
                keyColumn: "Id",
                keyValue: new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "ce70be9a-d6b1-427a-be54-6a5a0d9c3b39", "AQAAAAIAAYagAAAAEJDFXAAe2e7gu3fRtTrTTOFwURBzAnp4JGNwVPTKZnNfk6QeHYwJv9qw1K0gQE4tig==" });
        }
    }
}
