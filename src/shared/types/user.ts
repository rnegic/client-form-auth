export interface User {
  id: string | number;
  email: string;
  name: string;
  surName: string;
  fullName: string;
  employment: string;
  userAgreement: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  surName: string;
  fullName: string;
  employment: string;
  userAgreement: boolean;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface UpdateUserPayload {
  name: string;
  surName: string;
  fullName: string;
  employment: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
