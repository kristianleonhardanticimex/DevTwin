# Clean Architecture

Organize your codebase into layers:

- **Domain**: Business rules, entities, interfaces (no dependencies on other layers).
- **Application**: Use cases, DTOs, interfaces for infrastructure.
- **Infrastructure**: Data access, external APIs, file storage, etc.
- **API**: Controllers, request/response models.

**Best Practices:**
- Keep dependencies pointing inward (API → Application → Domain).
- Use dependency inversion for infrastructure.
- Write unit tests for domain and application layers.
- Avoid business logic in controllers or infrastructure.

**References:**
- [Microsoft Docs: Clean Architecture](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures#clean-architecture)
