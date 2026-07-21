import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export const getTutors = async (token: string | null, params: Record<string, any> = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${ENDPOINTS.TUTORS}?${query}` : ENDPOINTS.TUTORS;
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axiosInstance.get(url, config);
  return response.data;
};

export const getTutorById = async (token: string | null, id: string) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axiosInstance.get(`${ENDPOINTS.TUTORS}/${id}`, config);
  return response.data;
};

export const getMyTutorProfile = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.TUTOR_MY_PROFILE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const saveTutorProfile = async (token: string, data: any) => {
  const response = await axiosInstance.put(ENDPOINTS.TUTOR_PROFILE_SAVE, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
