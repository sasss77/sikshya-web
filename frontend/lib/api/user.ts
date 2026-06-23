import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export const whoamiApi = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.WHOAMI, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProfileApi = async (token: string, formData: FormData) => {
  const response = await axiosInstance.put(ENDPOINTS.UPDATE_PROFILE, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
