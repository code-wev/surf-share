import { apiClient } from "../client";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterBasePayload = {
  name: string;
  email: string;
  password: string;
  promotionEmail?: boolean;
};

type RegisterPhotographerPayload = RegisterBasePayload & {
  paypalEmail: string;
};

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },
  googleLogin: async (payload: { code: string; role?: string; shouldCreate?: boolean }) => {
    const response = await apiClient.post("/auth/google-login", payload);
    return response.data;
  },
  registerSurfer: async (payload: RegisterBasePayload) => {
    const response = await apiClient.post("/auth/register/surfer", payload);
    return response.data;
  },
  registerPhotographer: async (payload: RegisterPhotographerPayload) => {
    const response = await apiClient.post("/auth/register/photographer", payload);
    return response.data;
  },
  registerModerator: async (payload: {
    name: string;
    email: string;
    password?: string;
    permissions: string[];
  }) => {
    const response = await apiClient.post("/auth/register/moderator", payload);
    return response.data;
  },
};
