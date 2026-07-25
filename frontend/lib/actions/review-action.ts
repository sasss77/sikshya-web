"use server";

import { createReviewApi, getTutorReviewsApi, getCourseReviewsApi } from "../api/review";
import { getTokenCookie } from "../cookies";

export const createReviewAction = async (data: {
  tutorId: string;
  targetType: "tutor" | "course";
  rating: number;
  reviewText: string;
  courseId?: string;
  bookingId?: string;
}) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, error: "Not authenticated" };

    const res = await createReviewApi(token, data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to submit review",
    };
  }
};

export const getTutorReviewsAction = async (tutorId: string, limit = 10) => {
  try {
    const res = await getTutorReviewsApi(tutorId, limit);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch reviews" };
  }
};

export const getCourseReviewsAction = async (courseId: string, limit = 10) => {
  try {
    const res = await getCourseReviewsApi(courseId, limit);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch reviews" };
  }
};
