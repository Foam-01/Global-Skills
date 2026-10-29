// ASP.NET Core + SQL Server. "Sometimes the whole shop freezes for ~30s during sales, and some orders are paid twice."
public async Task<IActionResult> Checkout(int orderId)
{
    using var tx = await _db.Database.BeginTransactionAsync();

    var order = await _db.Orders.FirstAsync(o => o.Id == orderId);      // no owner check
    foreach (var line in order.Lines)
    {
        var stock = await _db.Stock.FirstAsync(s => s.ProductId == line.ProductId);
        stock.Qty -= line.Qty;                                            // no check for negative
    }
    await _db.SaveChangesAsync();

    // payment gateway, can take up to 30s
    var resp = await _http.PostAsJsonAsync("https://pay.example/charge",
                   new { amount = order.Total, orderId });

    await System.IO.File.AppendAllTextAsync("receipts.log", $"{orderId} paid\n");
    order.Status = "PAID";
    await _db.SaveChangesAsync();
    await tx.CommitAsync();
    return Ok();
}

// Monthly sales report (runs on the same database during business hours)
const string ReportSql = @"
SELECT o.Id, o.CustomerId, o.Total FROM Orders_2025 o WHERE o.Status = 'PAID'
UNION
SELECT o.Id, o.CustomerId, o.Total FROM Orders_2026 o WHERE o.Status = 'PAID'";
