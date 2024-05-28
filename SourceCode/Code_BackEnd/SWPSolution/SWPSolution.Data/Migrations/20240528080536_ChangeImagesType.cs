using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SWPSolution.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeImagesType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AppUsers",
                keyColumn: "Id",
                keyValue: new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "774d79ee-9dc7-434c-8147-db8450a380a3", "AQAAAAIAAYagAAAAED++TtEwOD9Pmx0oyUBgL9TjfPFw5v5AuzBvCedl9oodz85HjOTNSs0KiHCRTzSfRw==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AppUsers",
                keyColumn: "Id",
                keyValue: new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "1032a864-e6b2-40a2-9c8f-ef8f3637b5dc", "AQAAAAIAAYagAAAAEJ+4hkniB1p6rRbFiureub44IREBfNrF+MGyIiHoHcg50PH6Zjc0PjqZcB5e+rpfUA==" });
        }
    }
}
