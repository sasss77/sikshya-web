import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

/**
 * Create a Stripe Checkout Session
 * Returns { url, sessionId } — redirect student to `url`
 */
export const createCheckoutSession = async (
  token: string,
  data: {
    tutorId: string;
    subject: string;
    day: string;
    time: string;
    duration?: string;
    notes?: string;
    courseId?: string;
  }
) => {
  const response = await axiosInstance.post(ENDPOINTS.PAYMENTS_CHECKOUT, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Get Checkout Session Details (for success page)
 */
export const getCheckoutSession = async (token: string, sessionId: string) => {
  const response = await axiosInstance.get(
    `${ENDPOINTS.PAYMENTS_SESSION}/${sessionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
