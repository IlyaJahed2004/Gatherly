import axios, { type AxiosResponse, type AxiosError } from 'axios';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import type { PagedList, EventParams } from '../types/event';
import type { Event } from '../types/event';

axios.defaults.baseURL = 'https://localhost:5001/api';
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 && window.location.pathname !== '/signin') {
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string, params?: object) =>
    axios.get<T>(url, { params }).then(responseBody),
  post: <T>(url: string, body: object) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) =>
    axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) =>
    axios.delete<T>(url).then(responseBody),
};

const Account = {
  login: (creds: LoginRequest) =>
    requests.post<void>('/login?useCookies=true', creds),
  register: (creds: RegisterRequest) =>
    requests.post<void>('/account/register', creds),
  current: () => requests.get<User | ''>('/account/user-info'),
  logout: () => requests.post<void>('/account/logout', {}),
};

const Events = {
  list: (params: EventParams) =>
    requests.get<PagedList<Event>>('/events', params),
  details: (id: string) =>
    requests.get<Event>(`/events/${id}`),
};

const agent = {
  Account,
  Events,
};

export default agent;