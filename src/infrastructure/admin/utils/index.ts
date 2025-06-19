"use client";

import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const getCurrentUser = () => {
  const accessToken = Cookies.get("accessToken");

  if (!accessToken) return undefined;

  try {
    const decoded = jwtDecode(accessToken);
    return decoded;
  } catch (error) {
    console.error("JWT decode error:", error);
    return undefined;
  }
};
