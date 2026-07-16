"use server";

import {
  createBooking,
  getBookings,
  updateBookingStatus,
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
