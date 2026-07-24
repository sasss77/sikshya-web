import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export interface RegisterPayload {
  fullName: string;
  email: string;
  role: "student" | "tutor" | "admin";
  password: string;
  phoneNumber?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerApi = async (payload: RegisterPayload) => {
  const response = await axiosInstance.post(
    ENDPOINTS.REGISTER,
    payload
  );

  return response.data;
};

export const loginApi = async (payload: LoginPayload) => {
  const response = await axiosInstance.post(
    ENDPOINTS.LOGIN,
    payload
  );

  return response.data;
};

export const googleLoginApi = async (idToken: string) => {
  const response = await axiosInstance.post(
    ENDPOINTS.GOOGLE_LOGIN,
    { idToken }
  );

  return response.data;
};

export const setRoleApi = async (token: string, role: string) => {
  const response = await axiosInstance.post(
    ENDPOINTS.SET_ROLE,
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};