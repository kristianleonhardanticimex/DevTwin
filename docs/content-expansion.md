# DevTwin Copilot Instruction Builder – Content Expansion Plan

This document collects proposed new categories, subcategories, and features for the Copilot Instruction Builder. All items are organized into three levels: Category, Subcategory, Feature. Cross-cutting or deeper relationships are expressed as dependencies in parentheses. Each item includes a short description.

---

## Programming Languages
- **JavaScript / TypeScript**: Modern JavaScript and TypeScript development.
    - ES Modules: Use ES module syntax for modular, maintainable code.
    - Async/Await: Write asynchronous code using async/await for clarity and error handling.
    - Promises: Use Promises for managing asynchronous operations.
    - Type Safety with TypeScript: Add static typing to JavaScript for safer, more robust code.
    - JSDoc: Document code with JSDoc comments for better tooling and maintainability.
    - React: Build user interfaces with React, a component-based library. (depends on: JavaScript / TypeScript)
    - Angular: Develop applications using Angular, a full-featured framework. (depends on: JavaScript / TypeScript)
    - Vue: Create reactive UIs with Vue, a progressive JavaScript framework. (depends on: JavaScript / TypeScript)
    - Playwright: End-to-end browser testing for modern web apps. (depends on: React, Angular, Vue)
    - Testing Library (React, Angular): Test UI components in React or Angular with user-centric APIs. (depends on: React, Angular)
    - Storybook: Isolated UI component development and documentation. (depends on: React, Angular, Vue)

- **C# / .NET**: Modern .NET and C# backend development.
    - Clean Architecture: Organize code into layers for maintainability and testability.
    - Feature Folders: Group files by feature for modularity and clarity.
    - Use Built-in DI: Register and inject dependencies using .NET's built-in DI container.
    - Service Lifetimes: Choose correct lifetimes (Singleton, Scoped, Transient) for services.
    - appsettings.json: Store non-secret configuration in appsettings.json.
    - User Secrets: Use user-secrets for local development secrets.
    - Environment Variables: Override config with environment variables for different environments.
    - Serilog: Structured logging for .NET applications.
    - Health Checks: Implement readiness and liveness endpoints for monitoring.
    - Application Insights: Distributed tracing and monitoring in Azure.
    - xUnit: Microsoft's recommended unit testing framework for .NET.
    - NUnit: Popular alternative unit testing framework for .NET.
    - MSTest: Built-in unit testing framework for .NET.
    - ASP.NET Web API: Build RESTful APIs with ASP.NET Core.
    - Entity Framework Core: ORM for data access in .NET.
    - LINQ: Query collections and databases with LINQ.
    - Minimal APIs: Lightweight HTTP APIs in ASP.NET Core.
    - MediatR: In-process messaging and CQRS for .NET.
    - Background Services (IHostedService): Run background tasks in .NET apps.
    - Nullable Reference Types: Enable null-safety in C# code.

---

> All items are three levels deep. Dependencies are shown in parentheses and only reference subcategories or features. Add, refine, or reorganize as needed before implementation. Align with existing config structure and templates.
