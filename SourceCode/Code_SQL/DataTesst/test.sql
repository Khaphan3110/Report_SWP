USE [SWP_Project]
GO

INSERT INTO [dbo].[Categories]
           ([brandName]
           ,[AgeRange]
           ,[SubCategories]
           ,[packageType]
           ,[source])
     VALUES
           

           ('BrandE', '56-65', 'SubCategory5', 'Bag', 'Retail');
GO
select * from Categories;


CREATE SEQUENCE categories_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999
    CYCLE;
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

ALTER SEQUENCE categories_id_seq RESTART WITH 1;



