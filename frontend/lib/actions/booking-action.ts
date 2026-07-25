"use server";

import {
  createBooking,
  getBookings,
  updateBookingStatus,
  enrollInCourse,
  getEnrollmentDetail,
  markModuleRead,
} from "../api/booking";
import { getTokenCookie } from "../cookies";

export async function createBookingAction(data: any) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await createBooking(token, data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function fetchBookingsAction() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await getBookings(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

// Alias used by the earnings page
export const fetchTutorBookingsAction = fetchBookingsAction;

export async function updateBookingStatusAction(id: string, status: string, cancelReason?: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await updateBookingStatus(token, id, status, cancelReason);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function enrollInCourseAction(tutorId: string, courseId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await enrollInCourse(token, tutorId, courseId);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function getEnrollmentDetailAction(enrollmentId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await getEnrollmentDetail(token, enrollmentId);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function markModuleReadAction(enrollmentId: string, moduleTitle: string, totalModules: number) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await markModuleRead(token, enrollmentId, moduleTitle, totalModules);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}
