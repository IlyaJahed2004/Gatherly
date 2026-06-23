import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import agent from '../api/agent';
import type { LoginRequest, RegisterRequest, User, AuthError } from '../types/auth';
import type { RootStore } from './rootStore';

export class AuthStore {
  rootStore: RootStore;
  user: User | null = null;
  isLoading = false;
  error: AuthError | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private handleError(error: unknown, fallback = 'Something went wrong') {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (data?.errors) {
        const messages = Object.values(data.errors).flat().join(' ');
        this.error = { message: messages || fallback };
        return;
      }
      if (typeof data?.message === 'string' && data.message) {
        this.error = { message: data.message };
        return;
      }
      if (typeof data?.title === 'string' && data.title) {
        this.error = { message: data.title };
        return;
      }
    }
    this.error = { message: fallback };
  }

  async login(credentials: LoginRequest) {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await agent.Account.login(credentials);
      localStorage.setItem('jwt', result.accessToken);
      await this.loadCurrentUser();
      runInAction(() => { this.isLoading = false; });
    } catch (error: unknown) {
      runInAction(() => {
        this.handleError(error, 'Invalid email or password');
        this.isLoading = false;
      });
      throw error;
    }
  }

  async register(credentials: RegisterRequest) {
    this.isLoading = true;
    this.error = null;
    try {
      await agent.Account.register(credentials);
      runInAction(() => { this.isLoading = false; });
    } catch (error: unknown) {
      runInAction(() => {
        this.handleError(error, 'Registration failed');
        this.isLoading = false;
      });
      throw error;
    }
  }

  async loadCurrentUser() {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return;
      const data = await agent.Account.current();
      runInAction(() => { this.user = data ?? null; });
    } catch {
      runInAction(() => { this.user = null; });
    }
  }

  async logout() {
    agent.Account.logout();
    runInAction(() => { this.user = null; });
  }

  get isLoggedIn() {
    return !!this.user;
  }
}