# DevTwin Copilot Instruction Builder – Content Expansion Plan

This document collects proposed new categories, subcategories, and features for the Copilot Instruction Builder. All items are organized into three levels: Category, Subcategory, Feature. Cross-cutting or deeper relationships are expressed as dependencies. Each item includes its intended ID for config/template alignment.

---

## Programming Languages
- **languages-javascript** JavaScript / TypeScript
  - js-core Core Language Features
    - js-es-modules ES Modules
    - js-async-await Async/Await
    - js-promises Promises
    - js-typescript Type Safety with TypeScript
    - js-jsdoc JSDoc
  - js-frontend-frameworks Frontend Frameworks [depends on: frontend]
    - js-react React [depends on: languages-javascript]
    - js-angular Angular [depends on: languages-javascript]
    - js-vue Vue [depends on: languages-javascript]
  - js-ui-testing UI Testing [depends on: js-frontend-frameworks]
    - js-playwright Playwright
    - js-testing-library Testing Library (React, Angular)
    - js-storybook Storybook
- **languages-csharp** C# / .NET
  - csharp-project-structure Project Structure
    - csharp-clean-architecture Clean Architecture
    - csharp-feature-folders Feature Folders
  - csharp-dependency-injection Dependency Injection
    - csharp-use-built-in-di Use Built-in DI
    - csharp-service-lifetimes Service Lifetimes
  - csharp-configuration Configuration & Secrets
    - csharp-appsettings appsettings.json
    - csharp-user-secrets User Secrets
    - csharp-env-vars Environment Variables
  - csharp-logging Logging & Monitoring
    - csharp-serilog Serilog
    - csharp-health-checks Health Checks
    - csharp-app-insights Application Insights
  - csharp-unit-testing Unit Testing
    - csharp-xunit xUnit
    - csharp-nunit NUnit
    - csharp-mstest MSTest
  - csharp-other Other C#/.NET Features
    - csharp-aspnet-webapi ASP.NET Web API
    - csharp-ef-core Entity Framework Core
    - csharp-linq LINQ
    - csharp-minimal-apis Minimal APIs
    - csharp-mediatr MediatR
    - csharp-background-services Background Services (IHostedService)
    - csharp-nullable-ref-types Nullable Reference Types

## Frontend
- **frontend** Frontend
  - 1-1-react React
    - 1-1-1-jsx_support JSX Support
    - 1-1-2-use_vitest Use Vitest

## Git & Version Control
- **2-git** Git & Version Control
  - 2-1-commit-messages Commit Message Standards
    - 2-1-1-conventional-commits Conventional Commits
  - 2-2-versioning Versioning & Release Management
    - 2-2-1-semver Semantic Versioning
    - 2-2-2-changelog-workflow Changelog & Release Workflow

## Backend (C#/.NET) [legacy]
- **3-backend-csharp** Backend (C#/.NET)
  - 3-1-project-structure Project Structure
    - 3-1-1-clean-architecture Clean Architecture
    - 3-1-2-feature-folders Feature Folders
  - 3-2-dependency-injection Dependency Injection
    - 3-2-1-use-built-in-di Use Built-in DI
    - 3-2-2-service-lifetimes Service Lifetimes
  - 3-3-configuration Configuration & Secrets
    - 3-3-1-appsettings appsettings.json
    - 3-3-2-user-secrets User Secrets
    - 3-3-3-env-vars Environment Variables
  - 3-4-logging Logging & Monitoring
    - 3-4-1-serilog Serilog
    - 3-4-2-health-checks Health Checks
    - 3-4-3-app-insights Application Insights
  - 3-5-unit-testing Unit Testing
    - 3-5-1-xunit xUnit
    - 3-5-2-nunit NUnit
    - 3-5-3-mstest MSTest

---

> All items are three levels deep. IDs are shown for each item. Dependencies are shown in brackets. Add, refine, or reorganize as needed before implementation. Align with existing config structure and templates.
