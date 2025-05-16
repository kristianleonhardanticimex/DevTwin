<!-- 1.1.1 JSX Support -->
<!-- Category: Frontend -->
<!-- Subcategory: React -->
<!-- Feature: JSX Support -->

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
