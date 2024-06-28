USE [SWP_Project]
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

--================================================================================câu lệnh sql 

select * from Categories
delete Categories
select * from Product
delete Product

select * from ProductImages
select * from staff

select * from Promotion

select * from AppUsers
select * from [Member]
delete [Member] where member_ID = 'MB0624003'
delete AppUsers where id = '48CC3F76-5CCD-41FA-8FD9-F4D769794CFF'

select * from [Address]

select * from [Order]
select * from OrderDetails