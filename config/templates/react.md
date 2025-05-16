<!-- 1.1 React -->
<!-- Category: Frontend -->
<!-- Subcategory: React -->

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
