"use server";

import {
  getMyStudentsApi,
  sendNotificationApi,
  getMyNotificationsApi,
  markAllReadApi,
  markReadApi,
  clearAllApi,
} from "../api/notification";
import { getTokenCookie } from "../cookies";

const getToken = async () => {
  const token = await getTokenCookie();
  if (!token) throw new Error("Not authenticated");
  return token;
};

export async function getMyStudentsAction() {
  try {
    const token = await getToken();
    const res = await getMyStudentsApi(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function sendNotificationAction(data: {
  studentId: string;
  title: string;
  message: string;
  courseId?: string;
}) {
  try {
    const token = await getToken();
    const res = await sendNotificationApi(token, data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function getMyNotificationsAction() {
  try {
    const token = await getToken();
    const res = await getMyNotificationsApi(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function markAllReadAction() {
  try {
    const token = await getToken();
    await markAllReadApi(token);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function markReadAction(id: string) {
  try {
    const token = await getToken();
    await markReadApi(token, id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function clearAllNotificationsAction() {
  try {
    const token = await getToken();
    await clearAllApi(token);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}
