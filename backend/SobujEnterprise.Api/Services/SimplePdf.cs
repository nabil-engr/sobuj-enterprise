using System.Text;
using SobujEnterprise.Domain.Entities;

namespace SobujEnterprise.Api.Services;

public static class SimplePdf
{
    public static byte[] Invoice(Order order)
    {
        var lines = new List<string> { "SOBUJ ENTERPRISE", $"Invoice / Quotation: {order.OrderNumber}", $"Date: {order.CreatedAt:yyyy-MM-dd}", $"Customer: {order.CustomerName}", $"Phone: {order.CustomerPhone}", $"Address: {order.DeliveryAddress}, {order.City}", "", "ITEMS" };
        lines.AddRange(order.Items.Select(i => $"{i.ProductTitle} x {i.Quantity}  BDT {i.TotalPrice:0.00}"));
        lines.AddRange(["", $"Subtotal: BDT {order.SubTotal:0.00}", $"Delivery: BDT {order.DeliveryFee:0.00}", $"Total: BDT {order.TotalAmount:0.00}", $"Payment: {order.PaymentMethod} / {order.PaymentStatus}", $"Status: {order.OrderStatus}"]);
        var content = "BT /F1 11 Tf 50 790 Td 15 TL " + string.Join(" T* ", lines.Select(l => $"({Escape(l)}) Tj")) + " ET";
        var objects = new[] { "<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>", $"<< /Length {Encoding.ASCII.GetByteCount(content)} >>\nstream\n{content}\nendstream", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>" };
        var output = new StringBuilder("%PDF-1.4\n"); var offsets = new List<int> { 0 };
        for (var i = 0; i < objects.Length; i++) { offsets.Add(Encoding.ASCII.GetByteCount(output.ToString())); output.Append($"{i + 1} 0 obj\n{objects[i]}\nendobj\n"); }
        var xref = Encoding.ASCII.GetByteCount(output.ToString()); output.Append($"xref\n0 {objects.Length + 1}\n0000000000 65535 f \n"); foreach (var o in offsets.Skip(1)) output.Append($"{o:0000000000} 00000 n \n"); output.Append($"trailer << /Size {objects.Length + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF");
        return Encoding.ASCII.GetBytes(output.ToString());
    }
    private static string Escape(string value) => value.Replace("\\", "\\\\").Replace("(", "\\(").Replace(")", "\\)");
}
