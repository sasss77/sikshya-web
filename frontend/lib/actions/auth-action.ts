"use server";

import { loginApi, registerApi, googleLoginApi, setRoleApi } from "../api/auth";
import { setTokenCookie, removeTokenCookie, getTokenCookie } from "../cookies";

export const registerAction = async (data: {
  fullName: string;
  email: string;
  role: "student" | "tutor" | "admin";
  password: string;
  phoneNumber?: string;
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

export const logoutAction = async () => {
  await removeTokenCookie();
  return { success: true };
};

export const googleLoginAction = async (idToken: string) => {
  try {
    const response = await googleLoginApi(idToken);

    if (response.data?.token) {
      await setTokenCookie(response.data.token);
    }

    return {
      success: true,
      message: response.message,
      data: response.data,
      requiresRoleSelection: response.requiresRoleSelection,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Google Login failed",
    };
  }
};

export const setRoleAction = async (role: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "No token found" };

    const response = await setRoleApi(token, role);

    if (response.data?.token) {
      await setTokenCookie(response.data.token);
    }

    return {
      success: true,
      message: response.message,
      data: response.data,
      requiresAdminApproval: response.requiresAdminApproval,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to set role",
    };
  }
};