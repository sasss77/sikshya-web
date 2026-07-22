import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export const fetchAdminUsersApi = async (token: string, params: { page?: number; limit?: number; search?: string; role?: string }) => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN_USERS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const fetchAdminUserByIdApi = async (token: string, id: string) => {
  const response = await axiosInstance.get(`${ENDPOINTS.ADMIN_USERS}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAdminStatsApi = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN_STATS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAdminCoursesApi = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN_COURSES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAdminCourseByIdApi = async (token: string, id: string) => {
  const url = ENDPOINTS.ADMIN_COURSE_BY_ID.replace(":id", id);
  const response = await axiosInstance.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createAdminUserApi = async (token: string, data: any) => {
  const response = await axiosInstance.post(ENDPOINTS.ADMIN_USERS, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateAdminUserApi = async (token: string, id: string, data: any) => {
  const response = await axiosInstance.put(`${ENDPOINTS.ADMIN_USERS}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const sendAdminNotificationApi = async (token: string, payload: { audience: string; title: string; message: string }) => {
  const response = await axiosInstance.post(ENDPOINTS.ADMIN_SEND_NOTIFICATION, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteAdminUserApi = async (token: string, id: string) => {
  const response = await axiosInstance.delete(`${ENDPOINTS.ADMIN_USERS}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAdminRequestsApi = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN_REQUESTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const verifyAdminApi = async (token: string, id: string) => {
  const url = ENDPOINTS.ADMIN_VERIFY.replace(":id", id);
  const response = await axiosInstance.patch(url, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
