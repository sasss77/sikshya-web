"use server";

import { cookies } from "next/headers";

const TOKEN_KEY = "access_token";

export const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

export const getTokenCookie = async () => {
  const cookieStore = await cookies();

  return cookieStore.get(TOKEN_KEY)?.value;
};

export const removeTokenCookie = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(TOKEN_KEY);
};