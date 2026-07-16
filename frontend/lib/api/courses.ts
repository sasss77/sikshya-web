import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

/** GET /api/tutors/courses */
export const getMyCourses = async (token: string) => {
  const res = await axiosInstance.get(ENDPOINTS.TUTOR_COURSES, {
    headers: authHeader(token),
  });
  return res.data;
};

/** POST /api/tutors/courses */
export const createCourse = async (token: string, data: any) => {
  const res = await axiosInstance.post(ENDPOINTS.TUTOR_COURSES, data, {
    headers: authHeader(token),
  });
  return res.data;
};

/** PUT /api/tutors/courses/:courseId */
export const editCourse = async (token: string, courseId: string, data: any) => {
  const res = await axiosInstance.put(`${ENDPOINTS.TUTOR_COURSES}/${courseId}`, data, {
    headers: authHeader(token),
  });
  return res.data;
};

/** DELETE /api/tutors/courses/:courseId */
export const removeCourse = async (token: string, courseId: string) => {
  const res = await axiosInstance.delete(`${ENDPOINTS.TUTOR_COURSES}/${courseId}`, {
    headers: authHeader(token),
  });
  return res.data;
};

/** POST /api/tutors/courses/:courseId/modules */
export const addModuleApi = async (token: string, courseId: string, data: { title: string }) => {
  const res = await axiosInstance.post(`${ENDPOINTS.TUTOR_COURSES}/${courseId}/modules`, data, {
    headers: authHeader(token),
  });
  return res.data;
};

/** DELETE /api/tutors/courses/:courseId/modules/:moduleIndex */
export const deleteModuleApi = async (token: string, courseId: string, moduleIndex: number) => {
  const res = await axiosInstance.delete(
    `${ENDPOINTS.TUTOR_COURSES}/${courseId}/modules/${moduleIndex}`,
    { headers: authHeader(token) }
  );
  return res.data;
};

/** POST /api/tutors/courses/:courseId/modules/:moduleIndex/contents */
export const addModuleContentApi = async (
  token: string,
  courseId: string,
  moduleIndex: number,
  data: { type: string; title: string; urlOrText: string }
) => {
  const res = await axiosInstance.post(
    `${ENDPOINTS.TUTOR_COURSES}/${courseId}/modules/${moduleIndex}/contents`,
    data,
    { headers: authHeader(token) }
  );
  return res.data;
};

/** DELETE /api/tutors/courses/:courseId/modules/:moduleIndex/contents/:contentIndex */
export const deleteModuleContentApi = async (
  token: string,
  courseId: string,
  moduleIndex: number,
  contentIndex: number
) => {
  const res = await axiosInstance.delete(
    `${ENDPOINTS.TUTOR_COURSES}/${courseId}/modules/${moduleIndex}/contents/${contentIndex}`,
    { headers: authHeader(token) }
  );
  return res.data;
};

/** POST /api/tutors/upload-content */
export const uploadCourseFileApi = async (
  token: string,
  formData: FormData
) => {
  const res = await axiosInstance.post(
    ENDPOINTS.UPLOAD_COURSE_CONTENT,
    formData,
    {
      headers: {
        ...authHeader(token),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};
