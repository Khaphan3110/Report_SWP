using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SWPSolution.Data.Migrations
{
    /// <inheritdoc />
    public partial class createDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "address_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "blog_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "categories_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "member_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "order_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "payment_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "preorder_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "product_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "promotion_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "review_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateSequence(
                name: "staff_id_seq",
                minValue: 1L,
                maxValue: 999L,
                cyclic: true);

            migrationBuilder.CreateTable(
                name: "AppRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppRoleClaims", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserClaims", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppUserLogins",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserLogins", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "AppUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserRoles", x => new { x.UserId, x.RoleId });
                });

            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserTokens", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    categories_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    brandName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AgeRange = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SubCategories = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    packageType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    source = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Categori__92BFEBD24C3D480D", x => x.categories_ID);
                });

            migrationBuilder.CreateTable(
                name: "Member",
                columns: table => new
                {
                    member_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    LoyaltyPoints = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    RegistrationDate = table.Column<DateTime>(type: "date", nullable: true),
                    UserName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    PassWord = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Member__B29A816CC54BDB96", x => x.member_ID);
                });

            migrationBuilder.CreateTable(
                name: "Promotion",
                columns: table => new
                {
                    promotion_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DiscountType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    DiscountValue = table.Column<int>(type: "int", nullable: true),
                    StartDate = table.Column<DateTime>(type: "date", nullable: true),
                    EndDate = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Promotio__2C45E8433ED651C3", x => x.promotion_ID);
                });

            migrationBuilder.CreateTable(
                name: "staff",
                columns: table => new
                {
                    staff_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    role = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    username = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    password = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    fullName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__staff__196CD194F520350A", x => x.staff_ID);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    product_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    categories_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    ProductName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    Price = table.Column<double>(type: "float", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    statusDescription = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    image = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Product__470175FDED17C147", x => x.product_ID);
                    table.ForeignKey(
                        name: "fk_Product_categories",
                        column: x => x.categories_ID,
                        principalTable: "Categories",
                        principalColumn: "categories_ID");
                });

            migrationBuilder.CreateTable(
                name: "Address",
                columns: table => new
                {
                    address_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    member_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    HouseNumber = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Street = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    district = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    City = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Region = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AppUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Address__CAA543F0AA445DBA", x => x.address_ID);
                    table.ForeignKey(
                        name: "fk_Address",
                        column: x => x.member_ID,
                        principalTable: "Member",
                        principalColumn: "member_ID");
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    order_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    member_id = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    Promotion_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    ShippingAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TotalAmount = table.Column<double>(type: "float", nullable: true),
                    orderStatus = table.Column<bool>(type: "bit", nullable: true),
                    orderDate = table.Column<DateTime>(type: "date", nullable: true),
                    AppUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Order__464665E13F0051AC", x => x.order_ID);
                    
                    table.ForeignKey(
                        name: "fk_order_member",
                        column: x => x.member_id,
                        principalTable: "Member",
                        principalColumn: "member_ID");
                    table.ForeignKey(
                        name: "fk_order_promotion",
                        column: x => x.Promotion_ID,
                        principalTable: "Promotion",
                        principalColumn: "promotion_ID");
                });

            migrationBuilder.CreateTable(
                name: "Blog",
                columns: table => new
                {
                    blog_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    content = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    categories = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    dataCreate = table.Column<DateTime>(type: "date", nullable: true),
                    staff_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Blog__298A9610ECF917C0", x => x.blog_ID);
                    table.ForeignKey(
                        name: "fk_blog_staff",
                        column: x => x.staff_ID,
                        principalTable: "staff",
                        principalColumn: "staff_ID");
                });

            migrationBuilder.CreateTable(
                name: "PreOrder",
                columns: table => new
                {
                    preorder_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    product_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    member_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    preorderDate = table.Column<DateTime>(type: "date", nullable: true),
                    price = table.Column<double>(type: "float", nullable: true),
                    AppUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PreOrder__C55D7EA295C14F89", x => x.preorder_ID);
                    
                    table.ForeignKey(
                        name: "fk_PreOrder_Product",
                        column: x => x.product_ID,
                        principalTable: "Product",
                        principalColumn: "product_ID");
                    table.ForeignKey(
                        name: "fk_PreOrder_member",
                        column: x => x.member_ID,
                        principalTable: "Member",
                        principalColumn: "member_ID");
                });

            migrationBuilder.CreateTable(
                name: "ProductImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<string>(type: "varchar(10)", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Caption = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductImages_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "product_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Review",
                columns: table => new
                {
                    review_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    product_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    member_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    dataReview = table.Column<DateTime>(type: "date", nullable: true),
                    Grade = table.Column<int>(type: "int", nullable: true),
                    comment = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    AppUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Review__608B39D8185D9A34", x => x.review_ID);
                    
                    table.ForeignKey(
                        name: "fk_review_Product",
                        column: x => x.product_ID,
                        principalTable: "Product",
                        principalColumn: "product_ID");
                    table.ForeignKey(
                        name: "fk_review_member",
                        column: x => x.member_ID,
                        principalTable: "Member",
                        principalColumn: "member_ID");
                });

            migrationBuilder.CreateTable(
                name: "Order_detail",
                columns: table => new
                {
                    orderdetail_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    product_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    order_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    quantity = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Order_de__59AD78598BE8175A", x => x.orderdetail_ID);
                    table.ForeignKey(
                        name: "fk_orderdetail_order",
                        column: x => x.order_ID,
                        principalTable: "Order",
                        principalColumn: "order_ID");
                    table.ForeignKey(
                        name: "fk_orderdetail_product",
                        column: x => x.product_ID,
                        principalTable: "Product",
                        principalColumn: "product_ID");
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    payment_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    order_ID = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    amount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    discountValue = table.Column<double>(type: "float", nullable: true),
                    paymentStatus = table.Column<bool>(type: "bit", nullable: true),
                    PaymentMethod = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Payment__ED10C4420D3DCCF4", x => x.payment_ID);
                    table.ForeignKey(
                        name: "fk_Payment_order",
                        column: x => x.order_ID,
                        principalTable: "Order",
                        principalColumn: "order_ID");
                });

            migrationBuilder.InsertData(
                table: "AppRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Description", "Name", "NormalizedName" },
                values: new object[] { new Guid("8d04dce2-969a-435d-bba4-df3f325983dc"), null, "Administrator role", "admin", "admin" });

            migrationBuilder.InsertData(
                table: "AppUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { new Guid("8d04dce2-969a-435d-bba4-df3f325983dc"), new Guid("69bd714f-9576-45ba-b5b7-f00649be00de") });

            migrationBuilder.InsertData(
                table: "AppUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { new Guid("69bd714f-9576-45ba-b5b7-f00649be00de"), 0, "9d3b599b-af06-4e4f-804d-60c57eb6edd7", "tedu.international@gmail.com", true, "Toan", "Bach", false, null, "tedu.international@gmail.com", "admin", "AQAAAAIAAYagAAAAEMRgu/ua9jdDKFcoAncfTrH6iF+oKkeXQ9X5YbojfBQ3xEBRe+QZ/uCbBomlwhLDYA==", null, false, "", false, "admin" });

            migrationBuilder.CreateIndex(
                name: "IX_Address_AppUserId",
                table: "Address",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Address_member_ID",
                table: "Address",
                column: "member_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Blog_staff_ID",
                table: "Blog",
                column: "staff_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_AppUserId",
                table: "Order",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_member_id",
                table: "Order",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Promotion_ID",
                table: "Order",
                column: "Promotion_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_detail_order_ID",
                table: "Order_detail",
                column: "order_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_detail_product_ID",
                table: "Order_detail",
                column: "product_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_order_ID",
                table: "Payment",
                column: "order_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PreOrder_AppUserId",
                table: "PreOrder",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PreOrder_member_ID",
                table: "PreOrder",
                column: "member_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PreOrder_product_ID",
                table: "PreOrder",
                column: "product_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_categories_ID",
                table: "Product",
                column: "categories_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImages_ProductId",
                table: "ProductImages",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Review_AppUserId",
                table: "Review",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Review_member_ID",
                table: "Review",
                column: "member_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Review_product_ID",
                table: "Review",
                column: "product_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Address");

            migrationBuilder.DropTable(
                name: "AppRoleClaims");

            migrationBuilder.DropTable(
                name: "AppRoles");

            migrationBuilder.DropTable(
                name: "AppUserClaims");

            migrationBuilder.DropTable(
                name: "AppUserLogins");

            migrationBuilder.DropTable(
                name: "AppUserRoles");

            migrationBuilder.DropTable(
                name: "AppUserTokens");

            migrationBuilder.DropTable(
                name: "Blog");

            migrationBuilder.DropTable(
                name: "Order_detail");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "PreOrder");

            migrationBuilder.DropTable(
                name: "ProductImages");

            migrationBuilder.DropTable(
                name: "Review");

            migrationBuilder.DropTable(
                name: "staff");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "AppUsers");

            migrationBuilder.DropTable(
                name: "Member");

            migrationBuilder.DropTable(
                name: "Promotion");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropSequence(
                name: "address_id_seq");

            migrationBuilder.DropSequence(
                name: "blog_id_seq");

            migrationBuilder.DropSequence(
                name: "categories_id_seq");

            migrationBuilder.DropSequence(
                name: "member_id_seq");

            migrationBuilder.DropSequence(
                name: "order_id_seq");

            migrationBuilder.DropSequence(
                name: "payment_id_seq");

            migrationBuilder.DropSequence(
                name: "preorder_id_seq");

            migrationBuilder.DropSequence(
                name: "product_id_seq");

            migrationBuilder.DropSequence(
                name: "promotion_id_seq");

            migrationBuilder.DropSequence(
                name: "review_id_seq");

            migrationBuilder.DropSequence(
                name: "staff_id_seq");
        }
    }
}
