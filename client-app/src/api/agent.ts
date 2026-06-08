import axios, { type AxiosResponse, type AxiosError } from 'axios';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';

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
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Account = {
  // Identity cookie endpoint; useCookies=true makes the server set the auth cookie
  login: (creds: LoginRequest) => requests.post<void>('/login?useCookies=true', creds),
  register: (creds: RegisterRequest) => requests.post<void>('/account/register', creds),
  // Returns 204 (empty) when not authenticated, otherwise the user-info payload
  current: () => requests.get<User | ''>('/account/user-info'),
  logout: () => requests.post<void>('/account/logout', {}),
};

const agent = {
  Account,
};

export default agent;
