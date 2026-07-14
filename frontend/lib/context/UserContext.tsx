"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserAction } from "@/lib/actions/user-actions";

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  isVerifiedStudent?: boolean;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserAction();
      if (res.success && res.data) {
        setUser(res.data as UserData);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
