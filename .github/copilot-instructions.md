<!-- START: 1-frontend (Category) -->
# Copilot Instructions: Frontend Best Practices

- Use modern frontend frameworks and libraries (e.g., React, Vue, Angular) for building user interfaces.
- Organize code by feature or domain for maintainability (e.g., `src/components/`, `src/features/`).
- Prefer functional components and hooks (if using React) for new code.
- Use TypeScript for type safety and improved Copilot suggestions.
- Follow accessibility (a11y) best practices: use semantic HTML, ARIA attributes, and test with screen readers.
- Use CSS-in-JS, CSS Modules, or utility-first CSS frameworks (e.g., Tailwind) for styling.
- Write unit and integration tests for all UI components.
- Use Copilot to scaffold components, but always review and refactor for clarity, accessibility, and performance.
- Document public components and props with JSDoc or TypeScript comments for better Copilot context.
- Keep dependencies up to date and remove unused packages regularly.

> Example folder structure:
```
src/
  components/
  features/
  hooks/
  styles/
```

<!-- END: 1-frontend -->
<!-- START: 1-1-react (Subcategory: React) -->
# Copilot Instructions: React Best Practices

- Use React functional components and hooks for all new code.
- Organize React components by feature or domain, not by type.
- Use TypeScript for all React components and props for better Copilot suggestions and type safety.
- Prefer [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality and formatting.
- Use [React Context](https://react.dev/reference/react/createContext) or state management libraries (e.g., Redux, Zustand) for shared state.
- Write PropTypes or TypeScript interfaces for all component props.
- Use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Vitest](https://vitest.dev/) for testing components.
- Use [React.memo](https://react.dev/reference/react/memo) and hooks like `useMemo`/`useCallback` to optimize performance where needed.
- Prefer CSS Modules, styled-components, or Tailwind CSS for styling.
- Use Copilot to scaffold components, hooks, and tests, but always review and refactor for clarity, performance, and maintainability.
- Document all public components and hooks with JSDoc or TypeScript comments.

> Example functional component:
```tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);
```

<!-- END: 1-1-react -->
<!-- START: 1-1-1-jsx_support (Feature: JSX Support) -->
# Copilot Instructions: Enable JSX Support

- Use `.jsx` or `.tsx` file extensions for files containing JSX syntax.
- Ensure your project is configured to support JSX (e.g., `"jsx": "react-jsx"` in `tsconfig.json` for TypeScript projects).
- Use self-closing tags for elements without children (e.g., `<img />`).
- Prefer explicit and descriptive prop names in JSX for better Copilot suggestions.
- Use fragments (`<>...</>`) to group multiple elements without adding extra nodes to the DOM.
- Avoid inline functions and complex logic directly in JSX; extract them to variables or functions for readability.
- Use Copilot to generate JSX snippets, but always review for accessibility and maintainability.
- Document component props and expected children with JSDoc or TypeScript for improved Copilot context.

> Example:
```tsx
// Good JSX usage
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2>{title}</h2>
    <div>{children}</div>
  </section>
);
```

<!-- END: 1-1-1-jsx_support -->
<!-- START: 1-1-2-use_vitest (Feature: Use Vitest) -->
# Copilot Instructions: Use Vitest for React

- Use [Vitest](https://vitest.dev/) as the primary test runner for all React unit and component tests.
- Write tests in the `tests/` or `__tests__/` directory, colocated with the components when possible.
- Prefer using the [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for component tests with Vitest.
- Use the `.test.tsx` or `.test.js` file extension for test files.
- Ensure all new React components have corresponding Vitest tests covering:
  - Rendering (including edge cases)
  - User interactions (using `fireEvent` or `userEvent`)
  - Props and state changes
- Mock external dependencies and APIs using Vitest's mocking utilities.
- Run `vitest run` or `vitest watch` before every commit to ensure all tests pass.
- Use Copilot to suggest test cases, but always review and adapt suggestions for correctness and coverage.
- Prefer descriptive test names and group related tests with `describe()` blocks.

> Example:
```js
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders MyComponent with title', () => {
  render(<MyComponent title="Hello" />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

<!-- END: 1-1-2-use_vitest -->
<!-- START: 2-git (Category) -->

<!-- MISSING TEMPLATE: 2-git.md -->

<!-- END: 2-git -->
<!-- START: 2-1-commit-messages (Subcategory: Commit Message Standards) -->

<!-- MISSING TEMPLATE: 2-1-commit-messages.md -->

<!-- END: 2-1-commit-messages -->
<!-- START: 2-1-1-conventional-commits (Feature: Conventional Commits) -->
# Copilot Instructions: Conventional Commit Messages

- All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.
- Use the following types at the start of your commit message:
  - `feat:` for a new feature
  - `fix:` for a bug fix
  - `docs:` for documentation only changes
  - `style:` for formatting, missing semicolons, etc.
  - `refactor:` for code changes that neither fix a bug nor add a feature
  - `perf:` for a code change that improves performance
  - `test:` for adding or correcting tests
- The format is: `<type>: <short description>`
- Example: `feat: add user authentication`
- Use Copilot to suggest commit messages, but always review for clarity and compliance.

<!-- END: 2-1-1-conventional-commits -->
<!-- START: 2-2-versioning (Subcategory: Versioning & Release Management) -->

<!-- MISSING TEMPLATE: 2-2-versioning.md -->

<!-- END: 2-2-versioning -->
<!-- START: 2-2-1-semver (Feature: Semantic Versioning) -->
# Copilot Instructions: Semantic Versioning

- All projects must use [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH).
- The current version must be stored in a version file appropriate for the language:
  - Node.js: `package.json`
  - Python: `pyproject.toml`, `setup.cfg`, or `VERSION`
  - .NET: `.csproj` or `Directory.Build.props`
  - Java: `pom.xml`
  - Other: `VERSION` or similar
- The version must be automatically bumped for every release or significant change.
- Use Copilot to suggest version bumps, but always review for correctness.

<!-- END: 2-2-1-semver -->
<!-- START: 2-2-2-changelog-workflow (Feature: Changelog & Release Workflow) -->
# Copilot Instructions: Changelog & Release Workflow

- For every version bump, update `docs/changelog.md` with:
  - The new version number
  - The release date (YYYY-MM-DD)
  - A summary of the changes in this release
- Each changelog entry should follow this format:
  ```
  ## [1.2.3] - 2025-05-17
  - Added feature X
  - Fixed bug Y
  - Improved performance of Z
  ```
- This changelog update must be part of the Copilot/AI-assisted workflow for every release or significant change.
- Use Copilot to draft changelog entries, but always review for accuracy and completeness.

<!-- END: 2-2-2-changelog-workflow -->
<!-- START: 3-backend-csharp (Category) -->
# Backend (C#/.NET)

This section covers best practices for .NET backend development, including project structure, dependency injection, configuration, logging, and testing. Follow these guidelines to ensure maintainable, scalable, and secure C# applications.

- Use Clean Architecture for separation of concerns.
- Prefer built-in dependency injection and configuration providers.
- Store secrets securely and never hardcode credentials.
- Implement structured logging and health checks.
- Use xUnit, NUnit, or MSTest for unit testing.

Select subcategories for detailed instructions.

<!-- END: 3-backend-csharp -->
<!-- START: 3-1-project-structure (Subcategory: Project Structure) -->
# Project Structure

Organize your .NET backend using a scalable, maintainable folder and solution structure. Recommended:

- **Domain**: Core business logic, entities, value objects, interfaces.
- **Application**: Use cases, DTOs, application services.
- **Infrastructure**: Data access, external services, implementations.
- **API**: Controllers, endpoints, presentation layer.

Follow Clean Architecture principles for separation of concerns and testability.

<!-- END: 3-1-project-structure -->
<!-- START: 3-1-1-clean-architecture (Feature: Clean Architecture) -->
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

<!-- END: 3-1-1-clean-architecture -->
<!-- START: 3-1-2-feature-folders (Feature: Feature Folders) -->
# Feature Folders

Group related files by feature rather than by type. For example:

```
/Features
  /Orders
    OrderController.cs
    OrderService.cs
    OrderRepository.cs
  /Users
    UserController.cs
    UserService.cs
    UserRepository.cs
```

**Benefits:**
- Improves maintainability and discoverability.
- Reduces merge conflicts.
- Encourages modular design.

**Tip:** Use feature folders in the API and Application layers for large projects.

<!-- END: 3-1-2-feature-folders -->
<!-- START: 3-2-dependency-injection (Subcategory: Dependency Injection) -->
# Dependency Injection

Use the built-in DI container (`Microsoft.Extensions.DependencyInjection`) for registering and resolving services, repositories, and configuration.

- Register services in `Program.cs` or `Startup.cs` using `AddSingleton`, `AddScoped`, or `AddTransient`.
- Prefer constructor injection for dependencies.
- Avoid service locator or static access patterns.

**Example:**
```csharp
services.AddScoped<IOrderService, OrderService>();
services.AddSingleton<ILogger, Logger>();
```

**Reference:**
- [Microsoft Docs: Dependency injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)

<!-- END: 3-2-dependency-injection -->
<!-- START: 3-2-1-use-built-in-di (Feature: Use Built-in DI) -->
# Use Built-in DI

Register and inject dependencies using the built-in DI container:

- Use `IServiceCollection` to register services.
- Use constructor injection for all dependencies.
- Avoid static or global service access.

**Example:**
```csharp
public class MyController : ControllerBase {
    private readonly IMyService _service;
    public MyController(IMyService service) {
        _service = service;
    }
}
```

**Reference:**
- [Microsoft Docs: Dependency injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)

<!-- END: 3-2-1-use-built-in-di -->
<!-- START: 3-2-2-service-lifetimes (Feature: Service Lifetimes) -->
# Service Lifetimes

Choose the correct service lifetime when registering dependencies:

- **Singleton**: One instance for the app lifetime (stateless, thread-safe).
- **Scoped**: One instance per request (web apps, per HTTP request).
- **Transient**: New instance every time (lightweight, stateless).

**Example:**
```csharp
services.AddSingleton<IMySingleton, MySingleton>();
services.AddScoped<IMyScoped, MyScoped>();
services.AddTransient<IMyTransient, MyTransient>();
```

**Tip:** Avoid using Singleton for services with state or dependencies on scoped services.

<!-- END: 3-2-2-service-lifetimes -->
<!-- START: 3-3-configuration (Subcategory: Configuration & Secrets) -->
# Configuration & Secrets

- Store configuration in `appsettings.json` and environment variables.
- Use strongly-typed options classes with `IOptions<T>`.
- Never hardcode secrets; use [User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) for local dev and Azure Key Vault for production.
- Override config with environment variables for cloud-native deployments.

**Reference:**
- [Microsoft Docs: Configuration in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)

<!-- END: 3-3-configuration -->
<!-- START: 3-3-1-appsettings (Feature: appsettings.json) -->
# appsettings.json

- Store non-secret configuration in `appsettings.json`.
- Use hierarchical structure for clarity.
- Bind config to strongly-typed classes using `IOptions<T>`.

**Example:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "..."
  }
}
```

**Reference:**
- [Microsoft Docs: appsettings.json](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)

<!-- END: 3-3-1-appsettings -->
<!-- START: 3-3-2-user-secrets (Feature: User Secrets) -->
# User Secrets

- Use [dotnet user-secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) for local development secrets.
- Never commit secrets to source control.
- Access secrets via configuration providers in .NET.

**Commands:**
```sh
dotnet user-secrets init
dotnet user-secrets set "MySecret" "secret-value"
```

**Reference:**
- [Microsoft Docs: Safe storage of app secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets)

<!-- END: 3-3-2-user-secrets -->
<!-- START: 3-3-3-env-vars (Feature: Environment Variables) -->
# Environment Variables

- Use environment variables to override configuration for different environments (dev, test, prod).
- Prefix variables with the app name for clarity.
- Use `IConfiguration` to access env vars in .NET.

**Example:**
```sh
set MyApp__ConnectionStrings__DefaultConnection="..."
```

**Reference:**
- [Microsoft Docs: Environment variables in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration-providers#environment-variables-configuration-provider)

<!-- END: 3-3-3-env-vars -->
<!-- START: 3-4-logging (Subcategory: Logging & Monitoring) -->
# Logging & Monitoring

- Use Serilog for structured logging and enrich logs with context.
- Implement health checks using `AspNetCore.Diagnostics.HealthChecks`.
- Integrate Application Insights for distributed tracing and monitoring in Azure.

**Reference:**
- [Microsoft Docs: Logging in .NET](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/)

<!-- END: 3-4-logging -->
<!-- START: 3-4-1-serilog (Feature: Serilog) -->
# Serilog

- Use [Serilog](https://serilog.net/) for structured logging.
- Configure sinks for console, files, and Application Insights.
- Enrich logs with contextual information (e.g., request ID, user ID).

**Example:**
```csharp
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log.txt")
    .CreateLogger();
```

**Reference:**
- [Serilog Docs](https://serilog.net/)
- [Microsoft Docs: Logging in .NET](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/)

<!-- END: 3-4-1-serilog -->
<!-- START: 3-4-2-health-checks (Feature: Health Checks) -->
# Health Checks

- Use `AspNetCore.Diagnostics.HealthChecks` to implement readiness and liveness endpoints.
- Expose `/health` endpoint for monitoring.
- Add checks for database, cache, and external dependencies.

**Example:**
```csharp
services.AddHealthChecks()
    .AddSqlServer(Configuration["ConnectionStrings:DefaultConnection"]);
```

**Reference:**
- [Microsoft Docs: Health checks in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks)

<!-- END: 3-4-2-health-checks -->
<!-- START: 3-5-unit-testing (Subcategory: Unit Testing) -->
# Unit Testing

- Use xUnit (recommended), NUnit, or MSTest for unit testing.
- Test business logic, controllers, and services.
- Use mocking frameworks (e.g., Moq) for dependencies.
- Run tests in CI/CD pipelines.

**Reference:**
- [Microsoft Docs: Unit testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)

<!-- END: 3-5-unit-testing -->
<!-- START: 3-5-1-xunit (Feature: xUnit) -->
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

<!-- END: 3-5-1-xunit -->
<!-- START: 3-5-2-nunit (Feature: NUnit) -->
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

<!-- END: 3-5-2-nunit -->
<!-- START: 3-5-3-mstest (Feature: MSTest) -->
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

<!-- END: 3-5-3-mstest -->
