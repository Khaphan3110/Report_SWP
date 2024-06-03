using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SWPSolution.Data.Migrations
{
    /// <inheritdoc />
    public partial class addEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailVerificationCode",
                table: "AppUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailVerificationExpiry",
                table: "AppUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AppUsers",
                keyColumn: "Id",
                keyValue: new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"),
                columns: new[] { "ConcurrencyStamp", "EmailVerificationCode", "EmailVerificationExpiry", "PasswordHash" },
                values: new object[] { "8c34df63-ae35-4082-a861-dc42f1fee546", null, null, "AQAAAAIAAYagAAAAEOJmzAcEbYfA140wE8z6l/TQv0T1fOHgPYm37GfrZ6xb3EG7Zrdhubm+TpjWOzY/fg==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailVerificationCode",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "EmailVerificationExpiry",
                table: "AppUsers");

            migrationBuilder.UpdateData(
                table: "AppUsers",
                keyColumn: "Id",
                keyValue: new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "533ba7f8-8e95-4273-8c65-8abb80a239d7", "AQAAAAIAAYagAAAAEENsnF6LZD2inuJPrRTXtETeWbJoXa/MLEsYKnU8aOQd+ngE/FayMgsteyyiGDpDsg==" });
        }
    }
}
