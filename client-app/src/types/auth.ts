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
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string;
}

export interface AuthError {
  message: string;
}
