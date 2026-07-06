import HomePage from '../pages/HomePage';
import EventDetailPage from '../pages/EventDetailPage';
import ProfilePage from '../pages/ProfilePage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import CreateEventPage from '../pages/CreateEventPage';
import EditEventPage from '../pages/EditEventPage';
import AboutUsPage from '../pages/AboutUsPage';

export const layoutRoutes = [
  { path: '/',                  index: true,  element: <HomePage /> },
  { path: '/events/:id',        index: false, element: <EventDetailPage /> },
  { path: '/events/create',     index: false, element: <CreateEventPage /> },
  { path: '/events/:id/edit',   index: false, element: <EditEventPage /> },
  { path: '/profile/:id', index: false, element: <ProfilePage /> },
  { path: '/about',       index: false, element: <AboutUsPage /> },
];

export const standaloneRoutes = [
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
];