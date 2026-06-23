import axios, { type AxiosResponse, type AxiosError } from 'axios';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import type { PagedList, EventParams, EventDetails } from '../types/event';
import type { Event } from '../types/event';

axios.defaults.baseURL = 'https://localhost:5001/api';
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
  login:    (creds: LoginRequest)    => requests.post<{accessToken: string}>('/login?useCookies=false&useSessionCookies=false', creds),
  register: (creds: RegisterRequest) => requests.post<void>('/account/register', creds),
  current:  ()                       => requests.get<User>('/account/user-info'),
  logout:   ()                       => { localStorage.removeItem('jwt'); return Promise.resolve(); },
};

const Events = {
  list:    (params: EventParams) => requests.get<PagedList<Event>>('/events', params),
  details: (id: string)          => requests.get<EventDetails>(`/events/${id}`),
  attend:  (id: string)          => requests.post<void>(`/events/${id}/attend`, {}),
};

const agent = { Account, Events };

export default agent;