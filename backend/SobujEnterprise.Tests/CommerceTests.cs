using System.ComponentModel.DataAnnotations;
using SobujEnterprise.Api.Services;
using SobujEnterprise.Application.DTOs;
using SobujEnterprise.Domain.Entities;
using Xunit;

namespace SobujEnterprise.Tests;

public class CommerceTests
{
    [Theory]
    [InlineData("COD")]
    [InlineData("bKash")]
    [InlineData("Nagad")]
    [InlineData("Card")]
    [InlineData("Corporate_PO")]
    public void Supported_payment_methods_validate(string method)
    {
        var dto = ValidOrder(); dto.PaymentMethod = method;
        Assert.Empty(Validate(dto));
    }

    [Fact]
    public void Unsupported_payment_method_is_rejected()
    {
        var dto = ValidOrder(); dto.PaymentMethod = "UnsafeProvider";
        Assert.Contains(Validate(dto), x => x.MemberNames.Contains(nameof(dto.PaymentMethod)));
    }

    [Fact]
    public void Invoice_is_a_pdf_and_contains_order_number()
    {
        var order = new Order { OrderNumber = "SE-TEST-1", CustomerName = "Test", CustomerPhone = "01700000000", DeliveryAddress = "Bogura", City = "Bogura" };
        var bytes = SimplePdf.Invoice(order); var text = System.Text.Encoding.ASCII.GetString(bytes);
        Assert.StartsWith("%PDF-1.4", text); Assert.Contains("SE-TEST-1", text);
    }

    private static CreateOrderDto ValidOrder() => new() { CustomerName = "Test User", CustomerPhone = "01700000000", DeliveryAddress = "Bogura city", City = "Bogura", Items = [new() { ProductId = 1, Quantity = 1 }] };
    private static List<ValidationResult> Validate(object value) { var results = new List<ValidationResult>(); Validator.TryValidateObject(value, new ValidationContext(value), results, true); return results; }
}
