import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export interface RegisterPayload {
  fullName: string;
  email: string;
  role: "student" | "tutor";
  password: string;
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