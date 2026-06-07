export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface User {
  displayName: string;
  token: string;
  image?: string;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}
