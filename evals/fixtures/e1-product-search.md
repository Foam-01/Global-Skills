# Shop product list — SQL Server 2022 + EF Core 8 (.NET)

Users complain the product page and search are slow, especially when they click far pages.

## Schema
```sql
CREATE TABLE Products (
  Id INT IDENTITY PRIMARY KEY,
  CategoryId INT NOT NULL,
  Name VARCHAR(200) NOT NULL,
  Price DECIMAL(19,4) NOT NULL,
  CreatedAt DATETIME2 NOT NULL,
  Description NVARCHAR(MAX) NULL,
  ImageBase64 VARCHAR(MAX) NULL      -- product photo stored as data:image/jpeg;base64,...
);
CREATE INDEX IX_Products_CreatedAt_Category ON Products (CreatedAt, CategoryId);
CREATE INDEX IX_Products_Name ON Products (Name);
-- ~4,000,000 rows
```

## EF Core entity
```csharp
public class Product {
  public int Id { get; set; }
  public int CategoryId { get; set; }
  public string Name { get; set; } = "";   // no column type configured
  public decimal Price { get; set; }
  public DateTime CreatedAt { get; set; }
  public string? Description { get; set; }
  public string? ImageBase64 { get; set; }
}
```

## Endpoints
```csharp
// GET /products?category=5&page=2000  (page size 20, newest first)
var items = await db.Products
    .Where(p => p.CategoryId == category)
    .OrderByDescending(p => p.CreatedAt)
    .Skip((page - 1) * 20).Take(20)
    .ToListAsync();

// GET /products/search?q=Sam
var found = await db.Products
    .Where(p => p.Name.StartsWith(q))
    .ToListAsync();
```

## Numbers from STATISTICS IO (search, q = 'Sam')
Table 'Products'. Scan count 1, logical reads 18,904, lob logical reads 96,331
Plan: Index Scan on IX_Products_Name (estimated 210,000 rows, actual 3,120) + Key Lookup
Generated SQL: `WHERE [p].[Name] LIKE N'Sam%'`
