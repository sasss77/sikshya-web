"use server";

import {
  getTutors,
  getTutorById,
  getMyTutorProfile,
  saveTutorProfile,
  getTutorBookedSlotsApi,
} from "../api/tutor";
import { getTokenCookie } from "../cookies";

export async function fetchTutorsAction(params?: any) {
  try {
    const token = await getTokenCookie();
    const res = await getTutors(token || null, params);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function fetchTutorByIdAction(id: string) {
  try {
    const token = await getTokenCookie();
    const res = await getTutorById(token || null, id);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function fetchMyTutorProfileAction() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await getMyTutorProfile(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function saveTutorProfileAction(data: any) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await saveTutorProfile(token, data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function fetchTutorBookedSlotsAction(id: string) {
  try {
    const token = await getTokenCookie();
    const res = await getTutorBookedSlotsApi(token || null, id);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}
