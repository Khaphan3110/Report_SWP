using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SWPSolution.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailVerificationCodeAndExpiry : Migration
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
                values: new object[] { "ce70be9a-d6b1-427a-be54-6a5a0d9c3b39", null, null, "AQAAAAIAAYagAAAAEJDFXAAe2e7gu3fRtTrTTOFwURBzAnp4JGNwVPTKZnNfk6QeHYwJv9qw1K0gQE4tig==" });
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
