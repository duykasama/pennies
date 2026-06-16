using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pennies.Auth.Migrations.Migrations
{
    /// <inheritdoc />
    public partial class AddPendingEmailFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailUpdateCode",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailUpdateCodeExpiresAt",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PendingEmail",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailUpdateCode",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "EmailUpdateCodeExpiresAt",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PendingEmail",
                table: "AspNetUsers");
        }
    }
}
