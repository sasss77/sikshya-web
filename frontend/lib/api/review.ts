import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";
export const createReviewApi = async (data: {
  tutorId: string;
  targetType: "tutor" | "course";
  rating: number;
  reviewText: string;
  courseId?: string;
}) => {
  const response = await axiosInstance.post("/reviews", data);
  return response.data;
};

export const getTutorReviewsApi = async (tutorId: string, limit = 10) => {
  const response = await axiosInstance.get(`/reviews/tutor/${tutorId}?limit=${limit}`);
  return response.data;
};

export const getCourseReviewsApi = async (courseId: string, limit = 10) => {
  const response = await axiosInstance.get(`/reviews/course/${courseId}?limit=${limit}`);
  return response.data;
};
