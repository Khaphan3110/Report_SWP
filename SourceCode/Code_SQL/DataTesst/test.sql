USE [SWP_Project]
GO


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

--=============================================================================adress
CREATE SEQUENCE member_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
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
--========================================================================================
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

CREATE SEQUENCE blog_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO

ALTER SEQUENCE blog_id_seq RESTART WITH 1;


--===================================================== review
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

CREATE SEQUENCE review_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
GO



--================================================================================triger admin
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


--================================================================================câu lệnh sql 

select * from Categories
delete Categories
select * from Product
delete Product

select * from ProductImages
select * from staff
delete staff 
select * from Promotion

select * from AppUsers
select * from [Member]
select * from [Address]
select * from AppRoles
delete AppRoles
delete [Member] where member_ID = 'MB0624004'
--==================================================
ALTER TABLE dbo.Address NOCHECK CONSTRAINT fk_Address;
DELETE FROM [Member] WHERE member_ID = 'MB0624004';
ALTER TABLE dbo.Address CHECK CONSTRAINT fk_Address;
--==================================================
delete AppUsers where id = 'B11AEEE8-6BAC-47F9-9058-55B5405ED722'
delete [Address] where address_ID = 'AMM0624004'

select * from [Address] where address_ID = 'AMM0724011'
delete [Address] where address_ID = 'AMM0724011'

select * from [Order]
select * from OrderDetails

select * from Payment
select * from PreOrder

select * from Review
delete Review