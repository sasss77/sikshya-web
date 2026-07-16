"use server";

import {
  getMyCourses,
  createCourse,
  editCourse,
  removeCourse,
  addModuleApi,
  deleteModuleApi,
  addModuleContentApi,
  deleteModuleContentApi,
  uploadCourseFileApi,
} from "../api/courses";
import { getTokenCookie } from "../cookies";

const getToken = async () => {
  const token = await getTokenCookie();
  if (!token) throw new Error("Not authenticated");
  return token;
};

export async function fetchMyCoursesAction() {
  try {
    const token = await getToken();
    const res = await getMyCourses(token);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function createCourseAction(data: any) {
  try {
    const token = await getToken();
    const res = await createCourse(token, data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function editCourseAction(courseId: string, data: any) {
  try {
    const token = await getToken();
    const res = await editCourse(token, courseId, data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function deleteCourseAction(courseId: string) {
  try {
    const token = await getToken();
    await removeCourse(token, courseId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function addModuleAction(courseId: string, title: string) {
  try {
    const token = await getToken();
    const res = await addModuleApi(token, courseId, { title });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function deleteModuleAction(courseId: string, moduleIndex: number) {
  try {
    const token = await getToken();
    const res = await deleteModuleApi(token, courseId, moduleIndex);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function addModuleContentAction(
  courseId: string,
  moduleIndex: number,
  data: { type: string; title: string; urlOrText: string }
) {
  try {
    const token = await getToken();
    const res = await addModuleContentApi(token, courseId, moduleIndex, data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function deleteModuleContentAction(
  courseId: string,
  moduleIndex: number,
  contentIndex: number
) {
  try {
    const token = await getToken();
    const res = await deleteModuleContentApi(token, courseId, moduleIndex, contentIndex);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}

export async function uploadCourseFileAction(formData: FormData) {
  try {
    const token = await getToken();
    const res = await uploadCourseFileApi(token, formData);
    return { success: true, url: res.url };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || error.message };
  }
}
