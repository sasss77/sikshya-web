"use server";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
} from "../api/notification";
import { getTokenCookie } from "../cookies";

export async function fetchNotificationsAction() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await getNotifications(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function markNotificationReadAction(id: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await markNotificationRead(token, id);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await markAllNotificationsRead(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function clearAllNotificationsAction() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await clearAllNotifications(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}
