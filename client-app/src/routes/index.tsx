import HomePage from '../pages/HomePage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

// Routes rendered inside MainLayout (with Navbar)
export const layoutRoutes = [
  { path: '/', index: true, element: <HomePage /> },
];

// Standalone routes (no Navbar), e.g. auth pages
export const standaloneRoutes = [
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
];
