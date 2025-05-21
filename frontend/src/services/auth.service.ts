// frontend/src/services/auth.service.ts
import api from "./api";

export interface SignupData {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  role: "Employee" | "Manager" | "Admin";
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

const AuthService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data.user;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  getUserFromStorage: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  saveUserData: (token: string, user: User): void => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
};

export default AuthService;
