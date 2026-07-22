import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export const fetchChatRoomsApi = async (token: string) => {
  const res = await axiosInstance.get(ENDPOINTS.CHAT_ROOMS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createOrGetChatRoomApi = async (token: string, otherUserId: string) => {
  const res = await axiosInstance.post(
    ENDPOINTS.CHAT_ROOMS,
    { otherUserId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const fetchChatMessagesApi = async (token: string, roomId: string, page = 1) => {
  const url = ENDPOINTS.CHAT_MESSAGES.replace(":roomId", roomId);
  const res = await axiosInstance.get(`${url}?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const searchChatUsersApi = async (token: string, query: string) => {
  const res = await axiosInstance.get(`${ENDPOINTS.CHAT_SEARCH}?q=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
