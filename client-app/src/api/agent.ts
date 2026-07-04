import axios, { type AxiosResponse, type AxiosError } from 'axios';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import type { GetEventsResult, EventParams, EventDetails } from '../types/event';
import type { Profile, UserEvent, Follower } from '../types/profile';

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const path = window.location.pathname;
    if (status === 401 && path !== '/signin' && path !== '/signup') {
      localStorage.removeItem('jwt');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get:  <T>(url: string, params?: object) => axios.get<T>(url, { params }).then(responseBody),
  post: <T>(url: string, body: object)    => axios.post<T>(url, body).then(responseBody),
  put:  <T>(url: string, body: object)    => axios.put<T>(url, body).then(responseBody),
  del:  <T>(url: string)                  => axios.delete<T>(url).then(responseBody),
};

const Account = {
  login:    (creds: LoginRequest)    => requests.post<{ accessToken: string }>('/login?useCookies=false&useSessionCookies=false', creds),
  register: (creds: RegisterRequest) => requests.post<void>('/account/register', creds),
  current:  ()                       => requests.get<User>('/account/user-info'),
  logout:   ()                       => { localStorage.removeItem('jwt'); return Promise.resolve(); },
};

const Events = {
  list:    (params: EventParams) => requests.get<GetEventsResult>('/events', params),
  details: (id: string)          => requests.get<EventDetails>(`/events/${id}`),
  attend:  (id: string)          => requests.post<void>(`/events/${id}/attend`, {}),
  create:  (event: object)       => requests.post<string>('/events', event),
};

const Profiles = {
  get: (id: string) => requests.get<Profile>(`/profiles/${id}`),
  update: (data: { displayName: string; bio?: string; image?: File; deleteImage?: boolean }) => {
    const form = new FormData();
    form.append('DisplayName', data.displayName);
    if (data.bio) form.append('Bio', data.bio);
    if (data.image) form.append('Image', data.image);
    if (data.deleteImage) form.append('DeleteImage', 'true');
    return axios.patch<void>('/profiles', form).then(responseBody);
  },
  toggleFollow: (id: string) => requests.post<void>(`/profiles/${id}/follow`, {}),
  // NOTE: no backend endpoint exists yet for a user's events (nothing in ProfilesController) — this will 404 until it's added.
  getEvents:     (id: string, predicate: string) => requests.get<UserEvent[]>(`/profiles/${id}/events`, { predicate }),
  getFollowings: (id: string, predicate: string) => requests.get<Follower[]>(`/profiles/${id}/follow-list`, { predicate }),
};

const agent = { Account, Events, Profiles };

export default agent;