"use server";

import { getLearnings, toggleTopic } from "../api/enrollment";
import { getTokenCookie } from "../cookies";

export async function fetchLearningsAction() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await getLearnings(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function toggleTopicAction(enrollmentId: string, topicIndex: number, done: boolean) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };
    const res = await toggleTopic(token, enrollmentId, topicIndex, done);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}
