﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SWPSolution.Data.Entities;

#nullable disable

namespace SWPSolution.Data.Migrations
{
    [DbContext(typeof(SWPSolutionDBContext))]
    [Migration("20240621182657_paymentDBupdate")]
    partial class paymentDBupdate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.HasSequence("member_id_seq")
                .HasMin(1L)
                .HasMax(999L)
                .IsCyclic();

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("AppRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("AppUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("LoginProvider")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProviderKey")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("AppUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("UserId", "RoleId");

                    b.ToTable("AppUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("LoginProvider")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("AppUserTokens", (string)null);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Address", b =>
                {
                    b.Property<string>("AddressId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("address_ID");

                    b.Property<string>("City")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("District")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnName("district");

                    b.Property<string>("HouseNumber")
                        .HasMaxLength(20)
                        .IsUnicode(false)
                        .HasColumnType("varchar(20)");

                    b.Property<string>("MemberId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("member_ID");

                    b.Property<string>("Region")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Street")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("AddressId")
                        .HasName("PK__Address__CAA543F0AA445DBA");

                    b.HasIndex(new[] { "MemberId" }, "IX_Address_member_ID");

                    b.ToTable("Address", null, t =>
                        {
                            t.HasTrigger("trg_generate_address_id");
                        });

                    b.HasAnnotation("SqlServer:UseSqlOutputClause", false);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.AppRole", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NormalizedName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("AppRoles");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.AppUser", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("EmailVerificationCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("EmailVerificationExpiry")
                        .HasColumnType("datetime2");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TemporaryPassword")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("AppUsers");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Blog", b =>
                {
                    b.Property<string>("BlogId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("blog_ID");

                    b.Property<string>("Categories")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)")
                        .HasColumnName("categories");

                    b.Property<string>("Content")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)")
                        .HasColumnName("content");

                    b.Property<DateTime?>("DataCreate")
                        .HasColumnType("date")
                        .HasColumnName("dataCreate");

                    b.Property<string>("StaffId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("staff_ID");

                    b.Property<string>("Title")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)")
                        .HasColumnName("title");

                    b.HasKey("BlogId")
                        .HasName("PK__Blog__298A9610ECF917C0");

                    b.HasIndex(new[] { "StaffId" }, "IX_Blog_staff_ID");

                    b.ToTable("Blog", (string)null);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Category", b =>
                {
                    b.Property<string>("CategoriesId")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("categories_ID");

                    b.Property<string>("AgeRange")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("BrandName")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnName("brandName");

                    b.Property<string>("PackageType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnName("packageType");

                    b.Property<string>("Source")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnName("source");

                    b.Property<string>("SubCategories")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("CategoriesId")
                        .HasName("PK__Categori__92BFEBD24C3D480D");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Member", b =>
                {
                    b.Property<string>("MemberId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("member_ID");

                    b.Property<string>("Email")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("FirstName")
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<string>("LastName")
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<decimal?>("LoyaltyPoints")
                        .HasColumnType("decimal(10, 2)");

                    b.Property<string>("PassWord")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(20)
                        .IsUnicode(false)
                        .HasColumnType("varchar(20)");

                    b.Property<DateTime?>("RegistrationDate")
                        .HasColumnType("date");

                    b.Property<string>("UserName")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)");

                    b.HasKey("MemberId")
                        .HasName("PK__Member__B29A816CC54BDB96");

                    b.ToTable("Member", null, t =>
                        {
                            t.HasTrigger("trg_generate_member_id");
                        });

                    b.HasAnnotation("SqlServer:UseSqlOutputClause", false);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Order", b =>
                {
                    b.Property<string>("OrderId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("order_ID");

                    b.Property<string>("MemberId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("member_id");

                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("date")
                        .HasColumnName("orderDate");

                    b.Property<int>("OrderStatus")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("int")
                        .HasColumnName("orderStatus");

                    b.Property<string>("PromotionId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("Promotion_ID");

                    b.Property<string>("ShippingAddress")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<double>("TotalAmount")
                        .HasColumnType("float");

                    b.HasKey("OrderId")
                        .HasName("PK__Order__464665E13F0051AC");

                    b.HasIndex(new[] { "PromotionId" }, "IX_Order_Promotion_ID");

                    b.HasIndex(new[] { "MemberId" }, "IX_Order_member_id");

                    b.ToTable("Order", (string)null);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.OrderDetail", b =>
                {
                    b.Property<string>("OrderDetailId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("orderdetail_ID");

                    b.Property<string>("OrderId")
                        .IsRequired()
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("order_ID");

                    b.Property<float>("Price")
                        .HasColumnType("real")
                        .HasColumnName("Price");

                    b.Property<string>("ProductId")
                        .IsRequired()
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("product_ID");

                    b.Property<int>("Quantity")
                        .HasColumnType("int")
                        .HasColumnName("Quantity");

                    b.HasKey("OrderDetailId");

                    b.HasIndex(new[] { "OrderId" }, "IX_OrderDetails_OrderId");

                    b.HasIndex(new[] { "ProductId" }, "IX_OrderDetails_ProductId");

                    b.ToTable("OrderDetails");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Payment", b =>
                {
                    b.Property<string>("PaymentId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("payment_ID");

                    b.Property<decimal>("Amount")
                        .HasColumnType("decimal(10, 2)")
                        .HasColumnName("amount");

                    b.Property<double>("DiscountValue")
                        .HasColumnType("float")
                        .HasColumnName("discountValue");

                    b.Property<string>("OrderId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("order_ID");

                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("date");

                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)");

                    b.Property<bool>("PaymentStatus")
                        .HasColumnType("bit")
                        .HasColumnName("paymentStatus");

                    b.HasKey("PaymentId")
                        .HasName("PK__Payment__ED10C4420D3DCCF4");

                    b.HasIndex(new[] { "OrderId" }, "IX_Payment_order_ID");

                    b.ToTable("Payment", (string)null);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.PreOrder", b =>
                {
                    b.Property<string>("PreorderId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("preorder_ID");

                    b.Property<string>("MemberId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("member_ID");

                    b.Property<DateTime?>("PreorderDate")
                        .HasColumnType("date")
                        .HasColumnName("preorderDate");

                    b.Property<double?>("Price")
                        .HasColumnType("float")
                        .HasColumnName("price");

                    b.Property<string>("ProductId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("product_ID");

                    b.Property<int?>("Quantity")
                        .HasColumnType("int");

                    b.HasKey("PreorderId")
                        .HasName("PK__PreOrder__C55D7EA295C14F89");

                    b.HasIndex(new[] { "MemberId" }, "IX_PreOrder_member_ID");

                    b.HasIndex(new[] { "ProductId" }, "IX_PreOrder_product_ID");

                    b.ToTable("PreOrder", (string)null);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Product", b =>
                {
                    b.Property<string>("ProductId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("product_ID");

                    b.Property<string>("CategoriesId")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("categories_ID");

                    b.Property<string>("Description")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Image")
                        .HasColumnType("text")
                        .HasColumnName("image");

                    b.Property<double?>("Price")
                        .HasColumnType("float");

                    b.Property<string>("ProductName")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int?>("Quantity")
                        .HasColumnType("int");

                    b.Property<string>("StatusDescription")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("statusDescription");

                    b.HasKey("ProductId")
                        .HasName("PK__Product__470175FDED17C147");

                    b.HasIndex(new[] { "CategoriesId" }, "IX_Product_categories_ID");

                    b.ToTable("Product", (string)null);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.ProductImage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Caption")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime2");

                    b.Property<long>("FileSize")
                        .HasColumnType("bigint");

                    b.Property<string>("ImagePath")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("ProductId")
                        .IsRequired()
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)");

                    b.Property<int>("SortOrder")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex(new[] { "ProductId" }, "IX_ProductImages_ProductId");

                    b.ToTable("ProductImages");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Promotion", b =>
                {
                    b.Property<string>("PromotionId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("promotion_ID");

                    b.Property<string>("DiscountType")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)");

                    b.Property<int?>("DiscountValue")
                        .HasColumnType("int");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("date");

                    b.Property<string>("Name")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("date");

                    b.HasKey("PromotionId")
                        .HasName("PK__Promotio__2C45E8433ED651C3");

                    b.ToTable("Promotion", null, t =>
                        {
                            t.HasTrigger("trg_generate_promotion_id");
                        });

                    b.HasAnnotation("SqlServer:UseSqlOutputClause", false);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Review", b =>
                {
                    b.Property<string>("ReviewId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("review_ID");

                    b.Property<string>("Comment")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)")
                        .HasColumnName("comment");

                    b.Property<DateTime?>("DataReview")
                        .HasColumnType("date")
                        .HasColumnName("dataReview");

                    b.Property<int?>("Grade")
                        .HasColumnType("int");

                    b.Property<string>("MemberId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("member_ID");

                    b.Property<string>("ProductId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("product_ID");

                    b.HasKey("ReviewId")
                        .HasName("PK__Review__608B39D8185D9A34");

                    b.HasIndex(new[] { "MemberId" }, "IX_Review_member_ID");

                    b.HasIndex(new[] { "ProductId" }, "IX_Review_product_ID");

                    b.ToTable("Review", (string)null);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Staff", b =>
                {
                    b.Property<string>("StaffId")
                        .HasMaxLength(10)
                        .IsUnicode(false)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("staff_ID");

                    b.Property<string>("Email")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("FullName")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnName("fullName");

                    b.Property<string>("Password")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("password");

                    b.Property<string>("Phone")
                        .HasColumnType("text")
                        .HasColumnName("phone");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasMaxLength(20)
                        .IsUnicode(false)
                        .HasColumnType("varchar(20)")
                        .HasColumnName("role");

                    b.Property<string>("Username")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("username");

                    b.HasKey("StaffId")
                        .HasName("PK__staff__196CD194F520350A");

                    b.ToTable("staff", (string)null);
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Address", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Member", "Member")
                        .WithMany("Addresses")
                        .HasForeignKey("MemberId")
                        .HasConstraintName("fk_Address");

                    b.Navigation("Member");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Blog", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Staff", "Staff")
                        .WithMany("Blogs")
                        .HasForeignKey("StaffId")
                        .HasConstraintName("fk_blog_staff");

                    b.Navigation("Staff");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Order", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Member", "Member")
                        .WithMany("Orders")
                        .HasForeignKey("MemberId")
                        .HasConstraintName("fk_order_member");

                    b.HasOne("SWPSolution.Data.Entities.Promotion", "Promotion")
                        .WithMany("Orders")
                        .HasForeignKey("PromotionId")
                        .HasConstraintName("fk_order_promotion");

                    b.Navigation("Member");

                    b.Navigation("Promotion");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.OrderDetail", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Order", "Order")
                        .WithMany("OrderDetails")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SWPSolution.Data.Entities.Product", "Product")
                        .WithMany("OrderDetails")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Order");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Payment", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Order", "Order")
                        .WithMany("Payments")
                        .HasForeignKey("OrderId")
                        .HasConstraintName("fk_Payment_order");

                    b.Navigation("Order");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.PreOrder", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Member", "Member")
                        .WithMany("PreOrders")
                        .HasForeignKey("MemberId")
                        .HasConstraintName("fk_PreOrder_member");

                    b.HasOne("SWPSolution.Data.Entities.Product", "Product")
                        .WithMany("PreOrders")
                        .HasForeignKey("ProductId")
                        .HasConstraintName("fk_PreOrder_Product");

                    b.Navigation("Member");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Product", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Category", "Categories")
                        .WithMany("Products")
                        .HasForeignKey("CategoriesId")
                        .HasConstraintName("fk_Product_categories");

                    b.Navigation("Categories");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.ProductImage", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Product", "Product")
                        .WithMany("ProductImages")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Review", b =>
                {
                    b.HasOne("SWPSolution.Data.Entities.Member", "Member")
                        .WithMany("Reviews")
                        .HasForeignKey("MemberId")
                        .HasConstraintName("fk_review_member");

                    b.HasOne("SWPSolution.Data.Entities.Product", "Product")
                        .WithMany("Reviews")
                        .HasForeignKey("ProductId")
                        .HasConstraintName("fk_review_Product");

                    b.Navigation("Member");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Category", b =>
                {
                    b.Navigation("Products");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Member", b =>
                {
                    b.Navigation("Addresses");

                    b.Navigation("Orders");

                    b.Navigation("PreOrders");

                    b.Navigation("Reviews");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Order", b =>
                {
                    b.Navigation("OrderDetails");

                    b.Navigation("Payments");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Product", b =>
                {
                    b.Navigation("OrderDetails");

                    b.Navigation("PreOrders");

                    b.Navigation("ProductImages");

                    b.Navigation("Reviews");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Promotion", b =>
                {
                    b.Navigation("Orders");
                });

            modelBuilder.Entity("SWPSolution.Data.Entities.Staff", b =>
                {
                    b.Navigation("Blogs");
                });
#pragma warning restore 612, 618
        }
    }
}
