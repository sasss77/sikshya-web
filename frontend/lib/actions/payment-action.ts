"use server";

import { createCheckoutSession, getCheckoutSession } from "../api/payment";
import { getTokenCookie } from "../cookies";

/**
 * CREATE CHECKOUT SESSION
 * Called from the tutor profile page when student clicks "Book Session".
 * Returns { url } — the frontend should redirect to this URL.
 */
export async function createCheckoutSessionAction(data: {
  tutorId: string;
  subject: string;
  day: string;
  time: string;
  duration?: string;
  notes?: string;
  courseId?: string;
}) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await createCheckoutSession(token, data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message || "Failed to create checkout session",
    };
  }
}

/**
 * GET CHECKOUT SESSION DETAILS
 * Called from the payment success page to show booking confirmation.
 */
export async function getCheckoutSessionAction(sessionId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await getCheckoutSession(token, sessionId);
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message || "Failed to get session details",
    };
  }
}
