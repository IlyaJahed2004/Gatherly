import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import agent from '../api/agent';
import type { LoginRequest, RegisterRequest, User, AuthError } from '../types/auth';
import type { RootStore } from './rootStore';

export class AuthStore {
  rootStore: RootStore;
  user: User | null = null;
  token: string | null = null;
  isLoading = false;
  error: AuthError | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.token = token;
    }
  }

  private setSession(user: User) {
    this.user = user;
    this.token = user.token;
    localStorage.setItem('jwt', user.token);
  }

  private handleError(error: unknown, fallback: string) {
    if (axios.isAxiosError(error) && error.response?.data) {
      this.error = error.response.data as AuthError;
    } else {
      this.error = { message: fallback };
    }
  }

  async login(credentials: LoginRequest) {
    this.isLoading = true;
    this.error = null;
    try {
      const user = await agent.Account.login(credentials);
      runInAction(() => {
        this.setSession(user);
        this.isLoading = false;
      });
    } catch (error: unknown) {
      runInAction(() => {
        this.handleError(error, 'Login failed');
        this.isLoading = false;
      });
      throw error;
    }
  }

  async register(credentials: RegisterRequest) {
    this.isLoading = true;
    this.error = null;
    try {
      const user = await agent.Account.register(credentials);
      runInAction(() => {
        this.setSession(user);
        this.isLoading = false;
      });
    } catch (error: unknown) {
      runInAction(() => {
        this.handleError(error, 'Registration failed');
        this.isLoading = false;
      });
      throw error;
    }
  }

  async loadCurrentUser() {
    if (!this.token) {
      return;
    }
    this.isLoading = true;
    try {
      const user = await agent.Account.current();
      runInAction(() => {
        this.user = user;
        this.token = user.token;
        localStorage.setItem('jwt', user.token);
        this.isLoading = false;
      });
    } catch (error: unknown) {
      runInAction(() => {
        this.handleError(error, 'Failed to load current user');
        this.user = null;
        this.token = null;
        localStorage.removeItem('jwt');
        this.isLoading = false;
      });
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('jwt');
  }

  get isLoggedIn() {
    return !!this.token;
  }
}
