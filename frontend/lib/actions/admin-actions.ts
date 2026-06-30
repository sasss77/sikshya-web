"use server";

import { fetchAdminUsersApi, createAdminUserApi, updateAdminUserApi, deleteAdminUserApi } from "../api/adminUsers";
import { getTokenCookie } from "../cookies";

export const getAdminUsersAction = async (params: { page?: number; limit?: number; search?: string }) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "No token found" };
    }
    const response = await fetchAdminUsersApi(token, params);

    // Log raw response for debugging (remove in production)
    console.log("[Admin Users API Response]", JSON.stringify(response, null, 2));

    // Normalize: backends differ in field names — handle all common shapes
    // Shape A: response.meta.currentPage / totalItems / itemsPerPage / totalPages
    // Shape B: response.data is paginate-v2 root: { docs, page, totalDocs, limit, totalPages }
    // Shape C: response.pagination or response.paginate
    const raw = response;
    const metaRaw = raw.meta || raw.pagination || raw.paginate || {};
    const dataArray = Array.isArray(raw.data)
      ? raw.data
      : Array.isArray(raw.data?.docs)
      ? raw.data.docs
      : Array.isArray(raw.docs)
      ? raw.docs
      : [];

    const normalizedMeta = {
      currentPage:
        metaRaw.currentPage ??
        metaRaw.page ??
        raw.data?.page ??
        raw.page ??
        params.page ??
        1,
      itemsPerPage:
        metaRaw.itemsPerPage ??
        metaRaw.limit ??
        metaRaw.perPage ??
        raw.data?.limit ??
        raw.limit ??
        params.limit ??
        10,
      totalItems:
        metaRaw.totalItems ??
        metaRaw.totalDocs ??
        metaRaw.total ??
        metaRaw.count ??
        raw.data?.totalDocs ??
        raw.totalDocs ??
        raw.total ??
        0,
      totalPages:
        metaRaw.totalPages ??
        metaRaw.pageCount ??
        raw.data?.totalPages ??
        raw.totalPages ??
        1,
    };

    return {
      success: true,
      message: response.message,
      data: dataArray,
      meta: normalizedMeta,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch users",
    };
  }
};

export const createAdminUserAction = async (data: any) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "No token found" };
    }
    const response = await createAdminUserApi(token, data);
    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create user",
    };
  }
};

export const updateAdminUserAction = async (id: string, data: any) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "No token found" };
    }
    const response = await updateAdminUserApi(token, id, data);
    return {
      success: true,
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update user",
    };
  }
};

export const deleteAdminUserAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "No token found" };
    }
    const response = await deleteAdminUserApi(token, id);
    return {
      success: true,
      message: response.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete user",
    };
  }
};
