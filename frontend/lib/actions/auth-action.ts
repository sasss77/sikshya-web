"use server";

import { loginApi, registerApi } from "../api/auth";
import { setTokenCookie } from "../cookies";

export const registerAction = async (data: {
  fullName: string;
  email: string;
  role: "student" | "tutor";
  password: string;
}) => {
  try {
    const response = await registerApi(data);

    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Registration failed",
    };
  }
};

export const loginAction = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await loginApi(data);

    await setTokenCookie(response.data.token);

    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Login failed",
    };
  }
};