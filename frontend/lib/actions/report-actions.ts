import axios from "axios";
import { getTokenCookie } from "../cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function createReportAction(data: { reportedUserId: string; reason: string; details?: string }) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.post(`${API_URL}/reports`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to create report" };
  }
}

export async function getAdminReportsAction(params: { page?: number; limit?: number } = {}) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.get(`${API_URL}/reports/admin`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return { success: true, data: res.data.data, meta: res.data.meta };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to fetch reports" };
  }
}

export async function updateReportStatusAction(id: string, status: "pending" | "reviewed" | "resolved") {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.patch(`${API_URL}/reports/admin/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: res.data.data };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to update report" };
  }
}
