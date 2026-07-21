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

export const enrollInCourse = async (token: string, tutorId: string, courseId: string) => {
  const response = await axiosInstance.post(ENDPOINTS.BOOKINGS_ENROLL, { tutorId, courseId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getEnrollmentDetail = async (token: string, enrollmentId: string) => {
  const response = await axiosInstance.get(`${ENDPOINTS.LEARNINGS}/${enrollmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const markModuleRead = async (token: string, enrollmentId: string, moduleTitle: string, totalModules: number) => {
  const response = await axiosInstance.patch(`${ENDPOINTS.LEARNINGS}/${enrollmentId}/module`, { moduleTitle, totalModules }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
