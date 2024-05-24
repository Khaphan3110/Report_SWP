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

CREATE OR ALTER FUNCTION generate_member_id()
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @month CHAR(2) = '01'; -- Tháng tạo
    DECLARE @year CHAR(2) = '24'; -- Năm tạo
    DECLARE @auto_increment INT;

    -- Tìm giá trị tự động tăng lớn nhất hiện có trong bảng Member
    SELECT @auto_increment = MAX(CAST(SUBSTRING(member_ID, 7, 3) AS INT))
    FROM Member
    WHERE SUBSTRING(member_ID, 3, 2) = @month
    AND SUBSTRING(member_ID, 5, 2) = @year;

    -- Nếu không tìm thấy giá trị tự động tăng, gán giá trị ban đầu là 0
    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    -- Tăng giá trị tự động lên 1
    SET @auto_increment = @auto_increment + 1;

    -- Format lại giá trị tự động tăng thành 3 ký tự, bắt đầu từ 000
    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);

    -- Kết hợp các phần để tạo mã số thành viên
    DECLARE @generated_member_id VARCHAR(10) = CONCAT('MB', @month, @year, @formatted_auto_increment);

    RETURN @generated_member_id;
END;
GO

-- Tạo trigger để thiết lập giá trị cho member_ID trước khi chèn
CREATE TRIGGER trg_generate_member_id
ON Member
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Member (member_ID, FirstName, LastName, Email, PhoneNumber, LoyaltyPoints, RegistrationDate, UserName, PassWord)
    SELECT 
        ISNULL(member_ID, dbo.generate_member_id()),
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
GO

--  ràng buộc check đảm bảo rằng Email chứa ký tự @
ALTER TABLE Member
ADD CONSTRAINT email_format CHECK (CHARINDEX('@', Email) > 0);
GO

INSERT INTO Member (
    FirstName, 
    LastName, 
    Email, 
    PhoneNumber, 
    LoyaltyPoints, 
    RegistrationDate, 
    UserName, 
    PassWord
) 
VALUES (
    'Phan',              -- FirstName
    'Kha',               -- LastName
    'Khaphan@gmail.com', -- Email
    '0915123584',      -- PhoneNumber
    20,              -- LoyaltyPoints
    '2024-05-21',        -- RegistrationDate
    'Khaphan2003',           -- UserName
    'kp123'        -- PassWord
);
GO
 
INSERT INTO Member (
    FirstName, 
    LastName, 
    Email, 
    PhoneNumber, 
    LoyaltyPoints, 
    RegistrationDate, 
    UserName, 
    PassWord
) 
VALUES (
    'John',              -- FirstName
    'Doe',               -- LastName
    'john.doe@example.com', -- Email
    '0913013787',      -- PhoneNumber
    30,              -- LoyaltyPoints
    '2024-05-21',        -- RegistrationDate
    'johndoe',           -- UserName
    'password123'        -- PassWord
);
GO
select * from Member;

CREATE SEQUENCE address_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO
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


-- Hàm generate_Address_id
CREATE OR ALTER FUNCTION generate_Address_id()
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(address_ID, 7, 3) AS INT))
    FROM Address
    WHERE SUBSTRING(address_ID, 3, 2) = @month
    AND SUBSTRING(address_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_address_id VARCHAR(10) = CONCAT('AMM', @month, @year, @formatted_auto_increment);

    RETURN @generated_address_id;
END;
GO
DROP TABLE Address ;
GO

-- Tạo trigger trg_generate_address_id
CREATE TRIGGER trg_generate_address_id
ON Address
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Address (address_ID, member_ID, HouseNumber, Street, district, City, Region)
    SELECT 
        ISNULL(address_ID, dbo.generate_Address_id()),
        member_ID,
        HouseNumber,
        Street,
        district,
        City,
        Region
    FROM inserted;
END;
GO

-- Thêm dữ liệu vào bảng Address
INSERT INTO Address (
	member_ID,
    HouseNumber,
    Street,
    district,
    City,
    Region
) 
VALUES (
     'MB0124001','123', 'Nguyen Trai', '1', 'HCM', 'South'
);
GO
INSERT INTO Address (
	member_ID,
    HouseNumber,
    Street,
    district,
    City,
    Region
) 
VALUES (
     'MB0124002','124', N'Nguyễn Huệ ', '1', 'HCM', 'South'
);
GO


SELECT * 
FROM Address a
JOIN Member m ON a.member_ID = m.member_ID;
Go
select * from Member;
select * from address;
DELETE FROM Address WHERE address_ID = 'AD0124003';
DELETE FROM Address WHERE address_ID = 'AD0124004';



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
CREATE OR ALTER FUNCTION generate_promotion_id()
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(promotion_ID, 7, 3) AS INT))
    FROM Promotion
    WHERE SUBSTRING(promotion_ID, 3, 2) = @month
    AND SUBSTRING(promotion_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_address_id VARCHAR(10) = CONCAT('RM', @month, @year, @formatted_auto_increment);

    RETURN @generated_address_id;
END;
GO

-- Tạo trigger trg_generate_address_id
CREATE TRIGGER trg_generate_promotion_id
ON Promotion
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Promotion(promotion_ID, Name, DiscountType, DiscountValue, StartDate, EndDate)
    SELECT 
        ISNULL(promotion_ID, dbo.generate_promotion_id()),
        Name,
        DiscountType,
        DiscountValue,
        StartDate,
        EndDate
    FROM inserted;
END;
GO
INSERT INTO Promotion (
    Name, 
    DiscountType, 
    DiscountValue, 
    StartDate, 
    EndDate
) 
VALUES (
    'Summer Sale', 'Percentage', 20, '2024-06-01', '2024-06-30'
);
GO
INSERT INTO Promotion (
    Name, 
    DiscountType, 
    DiscountValue, 
    StartDate, 
    EndDate
) 
VALUES (
    'Spring Sale', 'Percentage', 35, '2024-07-01', '2024-06-15'
);
GO
select * from Promotion;


CREATE SEQUENCE order_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

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

DROP TRIGGER IF EXISTS trg_generate_categories_id;
GO
CREATE OR ALTER FUNCTION generate_categories_id()
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
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
INSERT INTO Categories (categories_ID, brandName, AgeRange, SubCategories, packageType, source)
VALUES ('MM0124001', 'Brand A', 'Adults', 'Clothing', 'Box', 'Local');

INSERT INTO Categories (categories_ID, brandName, AgeRange, SubCategories, packageType, source)
VALUES ('MM0124002', 'Brand B', 'Kids', 'Toys', 'Bag', 'International');



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
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(product_ID, 7, 3) AS INT))
    FROM Product
    WHERE SUBSTRING(product_ID, 3, 2) = @month
    AND SUBSTRING(product_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_product_id VARCHAR(10) = CONCAT('PM', @month, @year, @formatted_auto_increment);

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

INSERT INTO Product ( categories_ID, ProductName, Quantity, Price, Description, statusDescription, image)
VALUES ( 'MM0124001', N'Túi xách thời trang', 50, 120000, N'Túi xách da cao cấp', 'Available', 'image_path_here');

select * from Product;
SELECT * 
FROM Product pr
JOIN Categories c ON pr.categories_ID = c.categories_ID;
Go

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
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(preorder_ID, 7, 3) AS INT))
    FROM PreOrder
    WHERE SUBSTRING(preorder_ID, 3, 2) = @month
    AND SUBSTRING(preorder_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_preorder_ID VARCHAR(10) = CONCAT('PP', @month, @year, @formatted_auto_increment);

    RETURN @generated_preorder_ID;
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

INSERT INTO PreOrder (product_ID, member_ID, Quantity, preorderDate, price)
VALUES ('PM0124001', 'MB0124001', 2, '2024-05-24', 25.99);

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
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(review_ID, 7, 3) AS INT))
    FROM Review
    WHERE SUBSTRING(review_ID, 3, 2) = @month
    AND SUBSTRING(review_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_review_ID VARCHAR(10) = CONCAT('RW', @month, @year, @formatted_auto_increment);

    RETURN @generated_review_ID;
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

INSERT INTO Review ( product_ID, member_ID, dataReview, Grade, comment)
VALUES ( 'PM0124001', 'MB0124001', '2024-05-25', 5, 'This product is amazing!');

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
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(payment_ID, 7, 3) AS INT))
    FROM Payment
    WHERE SUBSTRING(payment_ID, 3, 2) = @month
    AND SUBSTRING(payment_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_payment_ID VARCHAR(10) = CONCAT('PM', @month, @year, @formatted_auto_increment);

    RETURN @generated_payment_ID;
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

INSERT INTO Payment (payment_ID, order_ID, amount, discountValue, paymentStatus, PaymentMethod, PaymentDate)
VALUES ('PM012401', 'OM0124001', '100.00', 10.00, 1, 'Credit Card', '2024-05-24');


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
    staff_ID VARCHAR(10) NOT NULL,
    role VARCHAR(20) NOT NULL,
    username VARCHAR(50),
    password VARCHAR(50),
    fullName NVARCHAR(50),
    Email VARCHAR(255),
    phone TEXT,
    Address NVARCHAR(255),
    PRIMARY KEY (staff_ID)
);
GO

CREATE OR ALTER FUNCTION generate_staff_id(@role VARCHAR(20))
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
    DECLARE @auto_increment INT;


    SELECT @auto_increment = MAX(CAST(SUBSTRING(staff_ID, 7, 3) AS INT))
    FROM staff
    WHERE SUBSTRING(staff_ID, 3, 2) = @month
    AND SUBSTRING(staff_ID, 5, 2) = @year
    AND role = @role;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);

    DECLARE @generated_staff_id VARCHAR(10) = CONCAT(CASE WHEN @role = 'staffmember' THEN 'SM' ELSE 'SA' END, @month, @year, @formatted_auto_increment);

    RETURN @generated_staff_id;
END;
GO

CREATE TRIGGER trg_generate_staff_id
ON staff
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @new_staff_ID VARCHAR(10);

    INSERT INTO staff (staff_ID, role, username, password, fullName, Email, phone, Address)
    SELECT 
        CASE WHEN role = 'staffmember' THEN dbo.generate_staff_id('staffmember') ELSE dbo.generate_staff_id('staffadmin') END,
        role,
        username,
        password,
        fullName,
        Email,
        phone,
        Address
    FROM inserted;

    -- Lấy giá trị mới được sinh ra cho staff_ID
    SELECT @new_staff_ID = staff_ID FROM inserted;

    -- Cập nhật lại staff_ID cho các bản ghi đã chèn
    UPDATE staff
    SET staff_ID = @new_staff_ID
    WHERE staff_ID IS NULL;
END;
GO
ALTER TABLE Staff 
ADD CONSTRAINT email_format CHECK (CHARINDEX('@', Email) > 0);
GO

INSERT INTO staff (role, username, password, fullName, Email, phone, Address)
VALUES ('staffmember', 'jdoe', 'password123', 'John Doe', 'jdoe@example.com', '123-456-7890', '123 Main St');

-- Chèn dữ liệu cho staffadmin
INSERT INTO staff (role, username, password, fullName, Email, phone, Address)
VALUES ('staffadmin', 'asmith', 'password456', 'Alice Smith', 'asmith@example.com', '987-654-3210', '456 Elm St');

INSERT INTO staff (role, username, password, fullName, Email, phone, Address)
VALUES ('staffmember', 'snguyen', 'pass123', 'Sarah Nguyen', 'snguyen@example.com', '111-222-3333', '789 Oak St');

-- Chèn dữ liệu cho staffadmin
INSERT INTO staff (role, username, password, fullName, Email, phone, Address)
VALUES ('staffadmin', 'dsmith', 'admin456', 'David Smith', 'dsmith@example.com', '444-555-6666', '321 Maple St');

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
    DECLARE @month CHAR(2) = '01';
    DECLARE @year CHAR(2) = '24';
    DECLARE @auto_increment INT;

    SELECT @auto_increment = MAX(CAST(SUBSTRING(blog_ID, 7, 3) AS INT))
    FROM Blog
    WHERE SUBSTRING(blog_ID, 3, 2) = @month
    AND SUBSTRING(blog_ID, 5, 2) = @year;

    IF @auto_increment IS NULL
        SET @auto_increment = 0;

    SET @auto_increment = @auto_increment + 1;

    DECLARE @formatted_auto_increment VARCHAR(3) = RIGHT('000' + CAST(@auto_increment AS VARCHAR(3)), 3);
    DECLARE @generated_blog_ID VARCHAR(10) = CONCAT('PM', @month, @year, @formatted_auto_increment);

    RETURN @generated_blog_ID;
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

INSERT INTO Blog (staff_ID, title, content, categories, dataCreate)
VALUES ( 'SA0124001', 'How to Cook Pasta', 'Learn how to cook delicious pasta in just a few easy steps.', 'Cooking, Recipes', '2024-05-24');

INSERT INTO Blog ( staff_ID, title, content, categories, dataCreate)
VALUES ( 'SM0124001', '10 Tips for Healthy Living', 'Discover 10 simple tips to improve your health and well-being.', 'Health, Lifestyle', '2024-05-25');

select * from staff;
select * from Blog;

SELECT * 
FROM Blog bl
JOIN staff st ON bl.staff_ID = st.staff_ID;
