import HomePage from '../pages/HomePage';
import EventDetailPage from '../pages/EventDetailPage';
import ProfilePage from '../pages/ProfilePage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import CreateEventPage from '../pages/CreateEventPage';

export const layoutRoutes = [
  { path: '/',                  index: true,  element: <HomePage /> },
  { path: '/events/:id',        index: false, element: <EventDetailPage /> },
  { path: '/events/create',     index: false, element: <CreateEventPage /> },
  { path: '/profile/:id', index: false, element: <ProfilePage /> },
];

export const standaloneRoutes = [
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
];