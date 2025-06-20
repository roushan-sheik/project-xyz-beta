"use client";

import { jwtDecode } from "jwt-decode";
import { User } from "@/types/user/types";

interface JwtPayload {
  email: string;
  role?: string;
  [key: string]: any;
}

export const getCurrentUser = (): User | undefined => {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!accessToken) return undefined;

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);

    return {
      email: decoded.email,
      role: role || decoded.role || "user", // fallback if not in localStorage
    } as User;
  } catch (error) {
    console.error("JWT decode error:", error);
    return undefined;
  }
};
