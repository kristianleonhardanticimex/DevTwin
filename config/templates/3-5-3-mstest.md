# MSTest

- Use [MSTest](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-mstest) for unit testing.
- Use `[TestClass]` and `[TestMethod]` attributes for test classes and methods.

**Example:**
```csharp
[TestClass]
public class OrderServiceTests {
    [TestMethod]
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
- [MSTest Docs](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-mstest)
- [Microsoft Docs: Unit testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)
