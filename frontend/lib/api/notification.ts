import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export const getNotifications = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const markNotificationRead = async (token: string, id: string) => {
  const response = await axiosInstance.patch(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const markAllNotificationsRead = async (token: string) => {
  const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS_READ_ALL, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const clearAllNotifications = async (token: string) => {
  const response = await axiosInstance.delete(ENDPOINTS.NOTIFICATIONS_CLEAR_ALL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
