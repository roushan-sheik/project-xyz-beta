"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Menu from "@/components/home/Menu";
import Button from "@/components/ui/Button";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import Cookies from "js-cookie";
import { LoginResponse } from "@/infrastructure/user/utils/types";
import { ToastContainer, toast } from "react-toastify";
import { user_role } from "@/constants/role";

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(6, "パスワードは6文字以上で入力してください"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);

    try {
      const response: LoginResponse = await userApiClient.userLogin(data);

      if (response.access && response.refresh) {
        // Set in Cookies
        Cookies.set("accessToken", response.access, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
        });
        Cookies.set("refreshToken", response.refresh, {
          expires: 30,
          secure: process.env.NODE_ENV === "production",
        });
        Cookies.set("role", response.user.kind, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
        });

        // Also set in localStorage
        localStorage.setItem("accessToken", response.access);
      }

      toast("Login Successfully", {
        ariaLabel: "something",
        position: "top-center",
      });

      // Optional delay (should be `await`)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Redirect after success and set user role
      if (response.user.kind === user_role.SUPER_ADMIN) {
        localStorage.setItem("role", user_role.SUPER_ADMIN);
        window.location.href = "/admin";
      } else {
        localStorage.setItem("role", user_role.USER);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <div>ログイン</div>
      <main className="flex min-h-screen items-center justify-center px-4">
        <ToastContainer />
        <div className="w-full max-w-md">
          <div className="space-y-6">
            <div className="rounded-lg border glass-card p-6 space-y-4">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-200">
                  メールアドレス
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={"glass-input  w-full p-3"}
                  placeholder="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  パスワード
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className={"glass-input  w-full p-3"}
                  placeholder="password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              className="w-full"
              type="button"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
              variant="glassBrand"
            >
              ログイン中...
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
