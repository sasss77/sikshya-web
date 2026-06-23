"use server";

import { whoamiApi } from "../api/user";
import { getTokenCookie } from "../cookies";

export const getUserAction = async () => {
  try {
    const token = await getTokenCookie();

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await whoamiApi(token);

    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch user profile",
    };
  }
};

export const getTokenAction = async () => {
  const token = await getTokenCookie();
  return token || null;
};
