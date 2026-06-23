import HomePage from '../pages/HomePage';
import EventDetailPage from '../pages/EventDetailPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

// Routes rendered inside MainLayout (with Navbar)
export const layoutRoutes = [
  { path: '/',           index: true, element: <HomePage /> },
  { path: '/events/:id', index: false, element: <EventDetailPage /> },
];

// Standalone routes (no Navbar)
export const standaloneRoutes = [
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
];