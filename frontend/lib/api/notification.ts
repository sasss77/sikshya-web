import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

/** GET /api/notifications/my-students */
export const getMyStudentsApi = async (token: string) => {
  const res = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS_MY_STUDENTS, {
    headers: authHeader(token),
  });
  return res.data;
};

/** POST /api/notifications/send */
export const sendNotificationApi = async (
  token: string,
  data: { studentId: string; title: string; message: string; courseId?: string }
) => {
  const res = await axiosInstance.post(ENDPOINTS.NOTIFICATIONS_SEND, data, {
    headers: authHeader(token),
  });
  return res.data;
};

/** GET /api/notifications */
export const getMyNotificationsApi = async (token: string) => {
  const res = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS, {
    headers: authHeader(token),
  });
  return res.data;
};

/** PATCH /api/notifications/read-all */
export const markAllReadApi = async (token: string) => {
  const res = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS_READ_ALL, {}, {
    headers: authHeader(token),
  });
  return res.data;
};

/** PATCH /api/notifications/:id/read */
export const markReadApi = async (token: string, id: string) => {
  const res = await axiosInstance.patch(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`, {}, {
    headers: authHeader(token),
  });
  return res.data;
};

/** DELETE /api/notifications/clear-all */
export const clearAllApi = async (token: string) => {
  const res = await axiosInstance.delete(ENDPOINTS.NOTIFICATIONS_CLEAR_ALL, {
    headers: authHeader(token),
  });
  return res.data;
};
