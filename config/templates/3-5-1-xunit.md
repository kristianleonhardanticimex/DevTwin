# xUnit

- Use [xUnit](https://xunit.net/) for unit testing (Microsoft's recommended framework).
- Write tests for business logic, controllers, and services.
- Use `[Fact]` and `[Theory]` attributes for test methods.

**Example:**
```csharp
public class OrderServiceTests {
    [Fact]
    public void CreateOrder_ShouldReturnOrder() {
        // Arrange
        // ...
        // Act
        // ...
        // Assert
        // ...
    }
}
```

**Reference:**
- [xUnit Docs](https://xunit.net/)
- [Microsoft Docs: Unit testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)
