import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export interface VerifyStudentPayload {
  institution: string;
  gradeLevel: string;
  subjects: string;
  bio: string;
}

/**
 * POST /api/students/verify
 * Submits the student's academic profile for verification.
 */
export const verifyStudentApi = async (
  token: string,
  data: VerifyStudentPayload
) => {
  const response = await axiosInstance.post(ENDPOINTS.VERIFY_STUDENT, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * GET /api/students/profile
 * Fetches the stored student academic profile.
 */
export const getStudentProfileApi = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.STUDENT_PROFILE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * GET /api/students/dashboard
 * Fetches the student's dashboard data (upcoming sessions, active courses, stats).
 */
export const getStudentDashboardApi = async (token: string) => {
  const response = await axiosInstance.get(ENDPOINTS.STUDENT_DASHBOARD, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
