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

      // 1. Validation errors (ProblemDetails.errors)
      if (data?.errors) {
        const messages = Object.values(data.errors).flat().join(' ');
        this.error = { message: messages || fallback };
        return;
      }

      // 2. Direct message field
      if (typeof data?.message === 'string' && data.message) {
        this.error = { message: data.message };
        return;
      }

      // 3. ProblemDetails.title
      if (typeof data?.title === 'string' && data.title) {
        this.error = { message: data.title };
        return;
      }
    }

    // 4. Empty body (e.g. 401 from Identity) -> use fallback, not statusText
    this.error = { message: fallback };
  }

  async login(credentials: LoginRequest) {
    this.isLoading = true;
    this.error = null;
    try {
      await agent.Account.login(credentials);
      // login returns no body; the cookie is set by the server.
      // Load the user so isLoggedIn flips and the UI reacts.
      await this.loadCurrentUser();
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (error: unknown) {
      runInAction(() => {
        // 401 from Identity has an empty body, so the fallback is what the user sees.
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
      // register returns no body and does not sign in, so log in to establish the cookie session
      await this.login({ email: credentials.email, password: credentials.password });
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
      const data = await agent.Account.current();
      runInAction(() => {
        this.user = data ? (data as User) : null;
      });
    } catch (error: unknown) {
      runInAction(() => {
        this.handleError(error, 'Failed to load current user');
        this.user = null;
      });
    }
  }

  async logout() {
    try {
      await agent.Account.logout();
    } finally {
      runInAction(() => {
        this.user = null;
      });
    }
  }

  get isLoggedIn() {
    return !!this.user;
  }
}
