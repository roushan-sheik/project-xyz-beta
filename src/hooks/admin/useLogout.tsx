"use client";

import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");

    // Clear cookies
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("role");

    // Redirect to login
    router.push("/login");
  };

  return logout;
};
