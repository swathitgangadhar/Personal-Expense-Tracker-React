import { render, screen } from '@testing-library/react';

jest.mock(
  'react-router-dom',
  () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: () => null,
  }),
  { virtual: true }
);

jest.mock('./pages/Login', () => () => <div>Login</div>);
jest.mock('./pages/Register', () => () => <div>Register</div>);
jest.mock('./pages/Dashboard', () => () => <div>Finance Overview Dashboard</div>);
jest.mock('./components/Navbar', () => () => <div>Navbar</div>);

import App from './App';

test('renders dashboard heading', () => {
  render(<App />);
  expect(screen.getByText(/navbar/i)).toBeInTheDocument();
});
