Create database SWP_Project;
Go

use SWP_Project;


CREATE SEQUENCE member_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE Member (
    member_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    FirstName NVARCHAR(10),
    LastName NVARCHAR(10),
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20),
    LoyaltyPoints DECIMAL(10, 2),
    RegistrationDate DATE,
    UserName VARCHAR(50),
    PassWord VARCHAR(50)
);
GO

CREATE OR ALTER TRIGGER trg_generate_member_id
ON Member
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
    DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @seq_value INT = NEXT VALUE FOR member_id_seq; -- Lấy giá trị tiếp theo từ sequence

    -- Định dạng giá trị sequence thành số 3 chữ số
    DECLARE @formatted_seq_value VARCHAR(3) = RIGHT('000' + CAST(@seq_value AS VARCHAR(3)), 3);

    -- Kết hợp các phần để tạo member ID
    DECLARE @generated_member_id VARCHAR(10) = CONCAT('MB', @month, @year, @formatted_seq_value);

    INSERT INTO Member (member_ID, FirstName, LastName, Email, PhoneNumber, LoyaltyPoints, RegistrationDate, UserName, PassWord)
    SELECT 
        ISNULL(@generated_member_id, 'MB' + @month + @year + '001'), -- Nếu không có giá trị từ sequence, sử dụng giá trị mặc định
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        LoyaltyPoints,
        RegistrationDate,
        UserName,
        PassWord
    FROM inserted;
END;
--  ràng buộc check đảm bảo rằng Email chứa ký tự @
ALTER TABLE Member
ADD CONSTRAINT email_format CHECK (CHARINDEX('@', Email) > 0);
GO

select * from Member;
ALTER SEQUENCE address_id_seq RESTART WITH 1;

-- Tạo sequence cho address_ID
CREATE SEQUENCE address_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO
ALTER SEQUENCE member_id_seq RESTART WITH 1;


-- Tạo bảng Address
CREATE TABLE Address (
    address_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    member_ID VARCHAR(10),
    HouseNumber VARCHAR(20),
    Street NVARCHAR(50),
    district NVARCHAR(50),
    City NVARCHAR(50),
    Region NVARCHAR(50),
    CONSTRAINT fk_Address FOREIGN KEY (member_ID) REFERENCES Member(member_ID)
);
GO



-- Sửa trigger để sinh address_ID trực tiếp
CREATE OR ALTER TRIGGER trg_generate_address_id
ON Address
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
    DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @seq_value INT = NEXT VALUE FOR address_id_seq; -- Lấy giá trị tiếp theo từ sequence

    -- Định dạng giá trị sequence thành số 3 chữ số
    DECLARE @formatted_seq_value VARCHAR(3) = RIGHT('000' + CAST(@seq_value AS VARCHAR(3)), 3);

    -- Kết hợp các phần để tạo address ID
    DECLARE @generated_address_id VARCHAR(10) = CONCAT('AMM', @month, @year, @formatted_seq_value);

    INSERT INTO Address (address_ID, member_ID, HouseNumber, Street, district, City, Region)
    SELECT 
        ISNULL(@generated_address_id, 'AMM' + @month + @year + '001'), -- Nếu không có giá trị từ sequence, sử dụng giá trị mặc định
        member_ID,
        HouseNumber,
        Street,
        district,
        City,
        Region
    FROM inserted;
END;
GO


SELECT * 
FROM Address a
JOIN Member m ON a.member_ID = m.member_ID;
Go
select * from Member;
select * from Address;

ALTER SEQUENCE address_id_seq RESTART WITH 1;



CREATE SEQUENCE promotion_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO
CREATE TABLE Promotion (
    promotion_ID VARCHAR(10) PRIMARY KEY NOT NULL,
	Name Nvarchar(50),
	DiscountType varchar(50),
	DiscountValue int,
	StartDate date,
	EndDate date,
);
GO
CREATE OR ALTER TRIGGER trg_generate_promotion_id
ON Promotion
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @generated_promotion_id VARCHAR(10);

    IF EXISTS (SELECT * FROM deleted)
    BEGIN
        -- Nếu có dữ liệu bị xóa, đặt lại giá trị của sequence về 1
        ALTER SEQUENCE promotion_id_seq RESTART WITH 1;
    END
    ELSE
    BEGIN
        DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
        DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
        DECLARE @seq_value INT = NEXT VALUE FOR promotion_id_seq; -- Lấy giá trị tiếp theo từ sequence

        -- Định dạng giá trị sequence thành số 3 chữ số
        DECLARE @formatted_seq_value VARCHAR(3) = RIGHT('000' + CAST(@seq_value AS VARCHAR(3)), 3);

        -- Kết hợp các phần để tạo promotion ID
        SET @generated_promotion_id = CONCAT('PR', @month, @year, @formatted_seq_value);
    END

    INSERT INTO Promotion (promotion_ID, Name, DiscountType, DiscountValue, StartDate, EndDate)
    SELECT 
        @generated_promotion_id, 
        Name, 
        DiscountType, 
        DiscountValue, 
        StartDate, 
        EndDate 
    FROM inserted;
END;
ALTER SEQUENCE promotion_id_seq RESTART WITH 1;


CREATE SEQUENCE order_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE [Order] (
    order_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    member_id  VARCHAR(10),
	Promotion_ID  VARCHAR(10),
    ShippingAddress  NVARCHAR(50),
    TotalAmount  float,
    orderStatus  bit,
    orderDate date,
	    CONSTRAINT fk_order_member FOREIGN KEY (member_ID) REFERENCES Member(member_ID),
			    CONSTRAINT fk_order_promotion FOREIGN KEY (promotion_ID) REFERENCES promotion(promotion_ID)

				
);
GO

CREATE OR ALTER FUNCTION generate_order_id()
RETURNS VARCHAR(10)
AS
BEGIN
     DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
        DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(order_ID, 7, 3) AS INT))
    FROM [Order]
    WHERE SUBSTRING(order_ID, 3, 2) = @month
    AND SUBSTRING(order_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_order_id VARCHAR(10) = CONCAT('OR', @month, @year, @formatted_auto_increment);

    RETURN @generated_order_id;
END;
GO


CREATE TRIGGER trg_generate_order_id
ON [order]
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO [Order] (order_ID, member_id, Promotion_ID, ShippingAddress, TotalAmount, orderStatus, orderDate)
    SELECT 
        ISNULL(order_ID, dbo.generate_order_id()),
        member_id,
        Promotion_ID,
        ShippingAddress,
        TotalAmount,
        orderStatus,
        orderDate
    FROM inserted;
END;
GO

select * from [Order];
ALTER SEQUENCE order_id_seq RESTART WITH 1;


CREATE SEQUENCE categories_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE Categories (
    categories_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    brandName NVARCHAR(50),
    AgeRange  NVARCHAR(50),
    SubCategories  NVARCHAR(50),
    packageType  NVARCHAR(50),
    source  NVARCHAR(50)
);
GO



CREATE OR ALTER FUNCTION generate_categories_id()
RETURNS VARCHAR(10)
AS
BEGIN
     DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
        DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(categories_ID, 7, 3) AS INT))
    FROM Categories
    WHERE SUBSTRING(categories_ID, 3, 2) = @month
    AND SUBSTRING(categories_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_categories_id VARCHAR(10) = CONCAT('MM', @month, @year, @formatted_auto_increment);

    RETURN @generated_categories_id;
END;
GO



CREATE TRIGGER trg_generate_categories_id
ON Categories
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Categories (categories_ID, brandName, AgeRange, SubCategories, packageType, source)
    SELECT 
        ISNULL(categories_ID, dbo.generate_categories_id()),
        brandName,
        AgeRange,
        SubCategories,
        packageType,
        source
    FROM inserted;
END;
GO
select * from Categories;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;


CREATE SEQUENCE product_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE Product (
    product_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    categories_ID VARCHAR(10),
    ProductName NVARCHAR(50),
	Quantity int,
	Price float,
	Description Nvarchar(255),
	statusDescription varchar(50),
	image text,
	CONSTRAINT fk_Product_categories FOREIGN KEY (categories_ID) REFERENCES Categories(categories_ID),
);
GO

CREATE OR ALTER FUNCTION generate_product_id()
RETURNS VARCHAR(10)
AS
BEGIN
     DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
        DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(product_ID, 7, 3) AS INT))
    FROM Product
    WHERE SUBSTRING(product_ID, 3, 2) = @month
    AND SUBSTRING(product_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_product_id VARCHAR(10) = CONCAT('MM', @month, @year, @formatted_auto_increment);

    RETURN @generated_product_id;
END;
GO


CREATE TRIGGER trg_generate_product_id
ON Product
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Product (product_ID, categories_ID, ProductName, Quantity, Price, Description, statusDescription, image)
    SELECT 
        ISNULL(product_ID, dbo.generate_product_id()),
        categories_ID,
        ProductName,
        Quantity,
        Price,
        Description,
        statusDescription,
        image
    FROM inserted;
END;
GO

select * from Product;
SELECT * 
FROM Product pr
JOIN Categories c ON pr.categories_ID = c.categories_ID;
Go
ALTER SEQUENCE product_id_seq RESTART WITH 1;

CREATE SEQUENCE preorder_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE PreOrder (
    preorder_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    product_ID VARCHAR(10),
	member_ID VARCHAR(10),
	Quantity int,
	preorderDate date,
	price float,
	CONSTRAINT fk_PreOrder_Product FOREIGN KEY (product_ID) REFERENCES Product(product_ID),
		CONSTRAINT fk_PreOrder_member FOREIGN KEY (member_ID) REFERENCES Member(member_ID)
);
GO

CREATE OR ALTER FUNCTION generate_preorder_id()
RETURNS VARCHAR(10)
AS
BEGIN
     DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
        DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(preorder_ID, 7, 3) AS INT))
    FROM PreOrder
    WHERE SUBSTRING(preorder_ID, 3, 2) = @month
    AND SUBSTRING(preorder_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_preorder_id VARCHAR(10) = CONCAT('MM', @month, @year, @formatted_auto_increment);

    RETURN @generated_preorder_id;
END;
GO


CREATE TRIGGER trg_generate_preorder_ID
ON Preorder
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO PreOrder(preorder_ID, product_ID, member_ID, Quantity, preorderDate, price)
    SELECT 
        ISNULL(preorder_ID, dbo.generate_preorder_id()),
        product_ID,
        member_ID,
        Quantity,
        preorderDate,
        price
    FROM inserted;
END;
GO



select * from Product;
select * from Member;
select * from PreOrder;


SELECT * 
FROM PreOrder po
JOIN Product q ON po.product_ID = q.product_ID;
Go

SELECT * 
FROM PreOrder pa
JOIN Member r ON pa.member_ID = r.member_ID;
Go
ALTER SEQUENCE preorder_id_seq RESTART WITH 1;


CREATE SEQUENCE review_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE Review (
    review_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    product_ID VARCHAR(10),
	member_ID VARCHAR(10),
	dataReview date,
	Grade int,
	comment Nvarchar(255),
	CONSTRAINT fk_review_Product FOREIGN KEY (product_ID) REFERENCES Product(product_ID),
		CONSTRAINT fk_review_member FOREIGN KEY (member_ID) REFERENCES Member(member_ID)
);
GO

CREATE OR ALTER FUNCTION generate_review_id()
RETURNS VARCHAR(10)
AS
BEGIN
     DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
        DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(review_ID, 7, 3) AS INT))
    FROM Review
    WHERE SUBSTRING(review_ID, 3, 2) = @month
    AND SUBSTRING(review_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_review_id VARCHAR(10) = CONCAT('MM', @month, @year, @formatted_auto_increment);

    RETURN @generated_review_id;
END;
GO

CREATE TRIGGER trg_generate_review_ID
ON Review
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Review(review_ID, product_ID, member_ID, dataReview, Grade, comment)
    SELECT 
        ISNULL(review_ID, dbo.generate_review_id()),
        product_ID,
        member_ID,
        dataReview,
        Grade,
        comment
    FROM inserted;
END;
GO

select * from Member;
select * from Product;
select * from Review;

SELECT * 
FROM Review rw
JOIN Product pro ON rw.product_ID = pro.product_ID;
Go

SELECT * 
FROM Review ri
JOIN Member qw ON ri.member_ID = qw.member_ID;
Go



CREATE TABLE [Order_detail] (
    orderdetail_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    product_ID VARCHAR(10),
	order_ID VARCHAR(10),
	quantity int,
	CONSTRAINT fk_orderdetail_product FOREIGN KEY (product_ID) REFERENCES Product(product_ID),
		CONSTRAINT fk_orderdetail_order FOREIGN KEY (order_ID) REFERENCES [Order](order_ID)
);
GO
ALTER SEQUENCE review_id_seq RESTART WITH 1;



CREATE SEQUENCE payment_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE Payment (
    payment_ID VARCHAR(10) PRIMARY KEY NOT NULL,
	order_ID VARCHAR(10),
	amount decimal(10,2),
	discountValue float,
	paymentStatus bit,
	PaymentMethod varchar(50),
	PaymentDate date,
		CONSTRAINT fk_Payment_order FOREIGN KEY (order_ID) REFERENCES [Order](order_ID)
);
GO


CREATE OR ALTER FUNCTION generate_payment_id()
RETURNS VARCHAR(10)
AS
BEGIN
     DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
        DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(payment_ID, 7, 3) AS INT))
    FROM Payment
    WHERE SUBSTRING(payment_ID, 3, 2) = @month
    AND SUBSTRING(payment_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_payment_id VARCHAR(10) = CONCAT('PM', @month, @year, @formatted_auto_increment);

    RETURN @generated_payment_id;
END;
GO
CREATE TRIGGER trg_generate_payment_ID
ON payment
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Payment(payment_ID, order_ID, amount, discountValue, paymentStatus, PaymentMethod,PaymentDate)
    SELECT 
        ISNULL(payment_ID, dbo.generate_payment_id()),
        order_ID,
        amount,
        discountValue,
        paymentStatus,
        PaymentMethod,
		PaymentDate
    FROM inserted;
END;
GO


ALTER SEQUENCE payment_id_seq RESTART WITH 1;

SELECT * 
FROM Payment p
JOIN [Order] o ON p.order_ID = o.order_ID;

select * from [Order];
select * from payment;

CREATE SEQUENCE staff_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE staff (
    staff_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    role VARCHAR(20) NOT NULL,
    username VARCHAR(50),
    password VARCHAR(50),
    fullName NVARCHAR(50),
    Email VARCHAR(255),
    phone TEXT
);
GO

ALTER TABLE Staff 
ADD CONSTRAINT email_format CHECK (CHARINDEX('@', Email) > 0);
GO

CREATE OR ALTER FUNCTION generate_staff_id(@role VARCHAR(20))
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
    DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(staff_ID, 7, 3) AS INT))
    FROM staff
    WHERE SUBSTRING(staff_ID, 3, 2) = @month
    AND SUBSTRING(staff_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);

    DECLARE @generated_staff_id VARCHAR(10) = CONCAT(CASE WHEN @role = 'SM' THEN 'SM' ELSE 'SA' END, @month, @year, @formatted_auto_increment);

    RETURN @generated_staff_id;
END;
GO

CREATE TRIGGER trg_generate_staff_id
ON staff
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @new_staff_ID VARCHAR(10);

    -- Tạo ID cho từng bản ghi được chèn vào
    INSERT INTO staff (staff_ID, role, username, password, fullName, Email, phone)
    SELECT 
        CASE 
            WHEN role = 'staffmember' THEN dbo.generate_staff_id('staffmember') 
            ELSE dbo.generate_staff_id('staffadmin') 
        END,
        role,
        username,
        password,
        fullName,
        Email,
        phone
    FROM inserted;
END;
GO

-- Chèn dữ liệu cho staffmember

ALTER SEQUENCE staff_id_seq RESTART WITH 1;

select * from staff;



CREATE SEQUENCE blog_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

CREATE TABLE Blog (
    blog_ID VARCHAR(10) PRIMARY KEY NOT NULL,
	title NVARCHAR(255),
	content NVARCHAR(255),
	categories NVARCHAR(255),
	dataCreate date,
	staff_ID varchar(10),
		CONSTRAINT fk_blog_staff FOREIGN KEY (staff_ID) REFERENCES staff(staff_ID)
);
GO

CREATE OR ALTER FUNCTION generate_blog_id()
RETURNS VARCHAR(10)
AS
BEGIN
     DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
        DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(blog_ID, 7, 3) AS INT))
    FROM Blog
    WHERE SUBSTRING(blog_ID, 3, 2) = @month
    AND SUBSTRING(blog_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_blog_id VARCHAR(10) = CONCAT('BL', @month, @year, @formatted_auto_increment);

    RETURN @generated_blog_id;
END;
GO

CREATE TRIGGER trg_generate_blog_ID
ON blog
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Blog(blog_ID,staff_ID, title, content, categories, dataCreate)
    SELECT 
        ISNULL(blog_ID, dbo.generate_blog_id()),
        staff_ID,
        title,
        content,
        categories,
        dataCreate
    FROM inserted;
END;
GO


ALTER SEQUENCE blog_id_seq RESTART WITH 1;

select * from staff;
select * from Blog;
SELECT * 
FROM Blog bl
JOIN staff st ON bl.staff_ID = st.staff_ID;

CREATE TABLE staff (
    staff_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    role VARCHAR(20) NOT NULL,
    username VARCHAR(50),
    password VARCHAR(50),
    fullName NVARCHAR(50),
    Email VARCHAR(255),
    phone TEXT
);
GO

CREATE OR ALTER PROCEDURE generate_staff_id
    @role VARCHAR(20),
    @generated_staff_id VARCHAR(10) OUTPUT
AS
BEGIN
    DECLARE @month CHAR(2) = FORMAT(GETDATE(), 'MM'); -- Lấy tháng hiện tại
    DECLARE @year CHAR(2) = FORMAT(GETDATE(), 'yy');  -- Lấy năm hiện tại
    DECLARE @auto_increment INT;

    BEGIN TRANSACTION;

    SELECT @auto_increment = ISNULL(MAX(CAST(RIGHT(staff_ID, 3) AS INT)), 0)
    FROM staff
    WHERE role = @role
    AND SUBSTRING(staff_ID, 4, 2) = @month
    AND SUBSTRING(staff_ID, 6, 2) = @year;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);

    SET @generated_staff_id = CONCAT(CASE WHEN @role = 'staffmember' THEN 'SM' ELSE 'SA' END, @month, @year, @formatted_auto_increment);

    COMMIT TRANSACTION;
END;
GO

CREATE OR ALTER TRIGGER trg_generate_staff_id
ON staff
INSTEAD OF INSERT
AS
BEGIN
    CREATE TABLE #TempStaff (
        staff_ID VARCHAR(10),
        role VARCHAR(20),
        username VARCHAR(50),
        password VARCHAR(50),
        fullName NVARCHAR(50),
        Email VARCHAR(255),
        phone TEXT
    );

    DECLARE @new_staff_ID VARCHAR(10);
    DECLARE @role VARCHAR(20);

    INSERT INTO #TempStaff (staff_ID, role, username, password, fullName, Email, phone)
    SELECT
        CASE 
            WHEN i.role = 'staffmember' THEN 'SM' 
            ELSE 'SA' 
        END + FORMAT(GETDATE(), 'MMyy') + RIGHT('000' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS VARCHAR(3)), 3),
        i.role,
        i.username,
        i.password,
        i.fullName,
        i.Email,
        i.phone
    FROM inserted i;

    INSERT INTO staff (staff_ID, role, username, password, fullName, Email, phone)
    SELECT staff_ID, role, username, password, fullName, Email, phone FROM #TempStaff;

    DROP TABLE #TempStaff;
END;
GO

select * from staff
INSERT INTO staff (role, username, password, fullName, Email, phone) VALUES
('staffmember', 'jdoe', 'password123', 'John Doe', 'jdoe@example.com', '123-456-7890'),
('staffmember', 'bwilliams', 'password789', 'Bob Williams', 'bwilliams@example.com', '345-678-9012'),
('staffmember', 'dlee', 'password202', 'David Lee', 'dlee@example.com', '567-890-1234');

INSERT INTO staff (role, username, password, fullName, Email, phone) VALUES
('staffadmin', 'asmith', 'password456', 'Alice Smith', 'asmith@example.com', '678-901-2345'),
('staffadmin', 'jjones', 'password789', 'Jack Jones', 'jjones@example.com', '890-123-4567');
select * from staff;