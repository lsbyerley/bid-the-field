// test-utils.js
import { render } from '@testing-library/react';

// Add in any providers here if necessary:
// (ReduxProvider, ThemeProvider, etc)
const Providers = ({ children }) => {
  return children;
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';
export {
  default as userEvent,
  specialChars,
} from '@testing-library/user-event';
// export * from 'next-page-tester';

// override render method
export { customRender as render };
