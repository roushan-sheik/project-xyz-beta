"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import { subscriptionApiClient } from "@/infrastructure/subscription/subscriptionAPIClient";
import Cookies from "js-cookie";
import { LoginResponse } from "@/infrastructure/user/utils/types";
import { ToastContainer, toast } from "react-toastify";
import { user_role } from "@/constants/role";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const checkSubscriptionStatus = async (): Promise<string> => {
    const role = localStorage.getItem("role");

    if (role === user_role.SUPER_ADMIN) {
      return "/admin";
    }
    try {
      const subscriptionStatus =
        await subscriptionApiClient.getSubscriptionStatus();

      const hasActiveSubscription =
        subscriptionStatus?.has_subscription &&
        subscriptionStatus?.status === "active";

      return hasActiveSubscription ? "/" : "/subscription-plans";
    } catch (error) {
      console.error("Failed to check subscription status:", error);
      return "/subscription-plans";
    }
  };

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    console.log({ data });

    try {
      const response: LoginResponse = await userApiClient.userLogin(data);

      if (response.access && response.refresh) {
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
          path: "/",
        });

        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("role", response.user.kind);
      }

      toast.success("ログイン成功!", { position: "top-center" });

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (response.user.kind === user_role.SUPER_ADMIN) {
        router.push("/admin");
      } else {
        const redirectUrl = await checkSubscriptionStatus();

        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.response?.status === 401) {
        toast.error("メールアドレスまたはパスワードが正しくありません", {
          position: "top-center",
        });
      } else if (error.response?.status === 400) {
        toast.error("入力内容に誤りがあります", {
          position: "top-center",
        });
      } else {
        toast.error(
          "ログインに失敗しました。しばらく時間をおいて再度お試しください",
          {
            position: "top-center",
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <ToastContainer />

        <h2 className="text-white lg:text-3xl text-2xl mb-6">ログイン</h2>

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-lg border glass-card p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-200">
                  メールアドレス
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="glass-input w-full p-3"
                  placeholder="your@email.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password with Eye Icon */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  パスワード
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="glass-input w-full p-3 pr-10"
                  placeholder="パスワードを入力"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute top-[42px] right-3 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="cursor-pointer" size={18} />
                  ) : (
                    <Eye className="cursor-pointer" size={18} />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              className="w-full"
              type="submit"
              loading={loading}
              variant="glassBrand"
              disabled={loading}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-300 mt-6">
            アカウントをお持ちではありませんか？{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              登録はこちら
            </Link>
          </div>

          <div className="mt-8 glass-card p-4 rounded-lg text-center">
            <p className="text-sm text-gray-300 mb-2">
              ログイン後、プレミアムプランの選択が必要です
            </p>
            <p className="text-xs text-gray-400">
              安全なStripe決済システムを使用しています
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
