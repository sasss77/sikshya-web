"use server";

import {
  fetchChatRoomsApi,
  createOrGetChatRoomApi,
  fetchChatMessagesApi,
  searchChatUsersApi,
} from "../api/chat";
import { getTokenCookie } from "../cookies";

export async function fetchChatRoomsAction() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await fetchChatRoomsApi(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function createOrGetChatRoomAction(otherUserId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await createOrGetChatRoomApi(token, otherUserId);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function fetchChatMessagesAction(roomId: string, page = 1) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await fetchChatMessagesApi(token, roomId, page);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function searchChatUsersAction(query: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await searchChatUsersApi(token, query);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function getTokenAction() {
  try {
    const token = await getTokenCookie();
    return { success: true, token };
  } catch {
    return { success: false, token: null };
  }
}
