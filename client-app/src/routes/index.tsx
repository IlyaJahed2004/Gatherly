import HomePage from '../pages/HomePage';
import EventDetailPage from '../pages/EventDetailPage';
import ProfilePage from '../pages/ProfilePage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

export const layoutRoutes = [
  { path: '/',                  index: true,  element: <HomePage /> },
  { path: '/events/:id',        index: false, element: <EventDetailPage /> },
  { path: '/profile/:username', index: false, element: <ProfilePage /> },
];

export const standaloneRoutes = [
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
];