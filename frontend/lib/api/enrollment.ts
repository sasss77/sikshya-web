import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export const getLearnings = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.LEARNINGS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const toggleTopic = async (token: string, enrollmentId: string, topicIndex: number, done: boolean) => {
  const response = await axiosInstance.patch(
    `${ENDPOINTS.LEARNINGS}/${enrollmentId}/topic`,
    { topicIndex, done },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
