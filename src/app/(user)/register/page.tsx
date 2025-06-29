"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/schemas/userRegistration";
import Link from "next/link";

// Zod validation schema

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true);
    try {
      await userApiClient.userRegister(data);
      toast.success("登録が成功しました！OTPを確認してください", {
        position: "top-center",
      });
      await new Promise((res) => setTimeout(res, 800));
      // Redirect to OTP verification instead of login
      window.location.href = "/user/verify-otp";
    } catch (err) {
      console.error(err);
      toast.error("登録に失敗しました", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <ToastContainer />
        <h2 className="text-white lg:text-3xl text-2xl mb-6">ユーザー登録</h2>
        <div className="w-full max-w-md">
          <div className="space-y-6">
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
                  placeholder="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  パスワード
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="glass-input w-full p-3 pr-10"
                  placeholder="password"
                />
                <button
                  type="button"
                  className="absolute top-[42px] right-3 text-gray-400"
                  onClick={() => setShowPassword((prev) => !prev)}
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

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  パスワード確認
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm_password")}
                  className="glass-input w-full p-3 pr-10"
                  placeholder="confirm password"
                />
                <button
                  type="button"
                  className="absolute top-[42px] right-3 text-gray-400"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="cursor-pointer" size={18} />
                  ) : (
                    <Eye className="cursor-pointer" size={18} />
                  )}
                </button>
                {errors.confirm_password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              className="w-full"
              type="button"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
              variant="glassBrand"
            >
              登録中...
            </Button>
            {/* Login Link */}
            <div className="text-center text-sm text-gray-300">
              すでにアカウントをお持ちですか？{" "}
              <Link href="/login" className="text-blue-400 hover:underline">
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
