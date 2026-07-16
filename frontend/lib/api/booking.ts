import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export const createBooking = async (token: string, data: any) => {
  const response = await axiosInstance.post(ENDPOINTS.BOOKINGS, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBookings = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKINGS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateBookingStatus = async (token: string, id: string, status: string, cancelReason?: string) => {
  const response = await axiosInstance.patch(`${ENDPOINTS.BOOKINGS}/${id}/status`, { status, cancelReason }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
