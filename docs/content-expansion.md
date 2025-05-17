# DevTwin Copilot Instruction Builder – Content Expansion Plan

This document collects proposed new categories, subcategories, and features for the Copilot Instruction Builder. All items are organized into three levels: Category, Subcategory, Feature. Cross-cutting or deeper relationships are expressed as dependencies in parentheses. Each item includes a short description.

---

## Programming Languages
- **JavaScript / TypeScript**
  - Core Language Features
    - ES Modules: Use ES module syntax for modular, maintainable code.
    - Async/Await: Write asynchronous code using async/await for clarity and error handling.
    - Promises: Use Promises for managing asynchronous operations.
    - Type Safety with TypeScript: Add static typing to JavaScript for safer, more robust code.
    - JSDoc: Document code with JSDoc comments for better tooling and maintainability.
  - Frontend Frameworks (depends on: React, Angular, Vue)
    - React: Build user interfaces with React, a component-based library. (depends on: Core Language Features)
    - Angular: Develop applications using Angular, a full-featured framework. (depends on: Core Language Features)
    - Vue: Create reactive UIs with Vue, a progressive JavaScript framework. (depends on: Core Language Features)
  - UI Testing (depends on: Frontend Frameworks)
    - Playwright: End-to-end browser testing for modern web apps.
    - Testing Library (React, Angular): Test UI components in React or Angular with user-centric APIs. (depends on: React, Angular)
    - Storybook: Isolated UI component development and documentation.

- **C# / .NET**
  - Project Structure
    - Clean Architecture: Organize code into layers for maintainability and testability.
    - Feature Folders: Group files by feature for modularity and clarity.
  - Dependency Injection
    - Use Built-in DI: Register and inject dependencies using .NET's built-in DI container.
    - Service Lifetimes: Choose correct lifetimes (Singleton, Scoped, Transient) for services.
  - Configuration & Secrets
    - appsettings.json: Store non-secret configuration in appsettings.json.
    - User Secrets: Use user-secrets for local development secrets.
    - Environment Variables: Override config with environment variables for different environments.
  - Logging & Monitoring
    - Serilog: Structured logging for .NET applications.
    - Health Checks: Implement readiness and liveness endpoints for monitoring.
    - Application Insights: Distributed tracing and monitoring in Azure.
  - Unit Testing
    - xUnit: Microsoft's recommended unit testing framework for .NET.
    - NUnit: Popular alternative unit testing framework for .NET.
    - MSTest: Built-in unit testing framework for .NET.
  - Other C#/.NET Features
    - ASP.NET Web API: Build RESTful APIs with ASP.NET Core.
    - Entity Framework Core: ORM for data access in .NET.
    - LINQ: Query collections and databases with LINQ.
    - Minimal APIs: Lightweight HTTP APIs in ASP.NET Core.
    - MediatR: In-process messaging and CQRS for .NET.
    - Background Services (IHostedService): Run background tasks in .NET apps.
    - Nullable Reference Types: Enable null-safety in C# code.

## Frontend
- **React**
  - Component Patterns
    - Functional Components: Use function-based components for simplicity and performance.
    - Component Composition: Build complex UIs by composing smaller components.
  - State & Data
    - Hooks: Manage state and side effects in React components.
    - Context API: Share state across the component tree.
    - React Query: Data fetching and caching for React apps.
    - Zustand / Redux Toolkit: State management libraries for React.
- **Angular**
  - Structure
    - NgModules: Organize Angular apps into cohesive blocks of functionality.
    - Angular CLI: Command-line tooling for Angular projects.
  - Patterns
    - Dependency Injection: Use Angular's DI system for modularity and testability.
    - RxJS Patterns: Reactive programming with RxJS in Angular.
- **Vue**
  - Structure
    - Composition API: Modern API for organizing Vue component logic.
    - Vuex: State management for Vue applications.
    - Vue Router: Routing for single-page Vue apps.

## UI Testing
- **General**
  - Playwright: End-to-end browser testing for any frontend.
  - Storybook: Develop and document UI components in isolation.
- **Framework-Specific**
  - Testing Library (React, Angular): User-centric component testing for React and Angular. (depends on: React, Angular)

## Git & Version Control
- **Commit Message Standards**
  - Conventional Commits: Use a standard format for commit messages to enable automation and clarity.
- **Versioning & Release Management**
  - Semantic Versioning: Use MAJOR.MINOR.PATCH versioning for all projects.
  - Changelog & Release Workflow: Maintain a changelog and update it for every release.

---

> All items are three levels deep. Dependencies are shown in parentheses and only reference subcategories or features. Add, refine, or reorganize as needed before implementation. Align with existing config structure and templates.
