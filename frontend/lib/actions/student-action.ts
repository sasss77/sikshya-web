"use server";

import { verifyStudentApi, getStudentProfileApi, getStudentDashboardApi, getStudentByIdApi, VerifyStudentPayload } from "../api/student";
import { getTokenCookie } from "../cookies";

/**
 * SERVER ACTION — Verify Student
 * Reads the auth token from the httpOnly cookie and calls the backend.
 */
export const verifyStudentAction = async (data: VerifyStudentPayload) => {
  try {
    const token = await getTokenCookie();

    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await verifyStudentApi(token, data);

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
        "Verification failed. Please try again.",
    };
  }
};

/**
 * SERVER ACTION — Fetch Student Academic Profile
 */
export const fetchStudentProfileAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await getStudentProfileApi(token);

    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load student profile.",
    };
  }
};

/**
 * SERVER ACTION — Fetch Student Dashboard
 */
export const fetchStudentDashboardAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await getStudentDashboardApi(token);

    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load dashboard data.",
    };
  }
};

/**
 * SERVER ACTION — Fetch Public Student Profile by ID
 */
export const getStudentByIdAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await getStudentByIdApi(token, id);

    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load student profile.",
    };
  }
};

