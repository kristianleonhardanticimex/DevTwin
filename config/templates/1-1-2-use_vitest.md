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
