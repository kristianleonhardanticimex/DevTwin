# NUnit

- Use [NUnit](https://nunit.org/) for unit testing.
- Use `[TestFixture]` and `[Test]` attributes for test classes and methods.

**Example:**
```csharp
[TestFixture]
public class OrderServiceTests {
    [Test]
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
- [NUnit Docs](https://nunit.org/)
- [Microsoft Docs: Unit testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)
