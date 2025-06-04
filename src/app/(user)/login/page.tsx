"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Menu from "@/components/home/Menu";
import Button from "@/components/ui/Button";

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

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful login
      console.log("Login data:", data);
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error state here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen main_gradient_bg   text-white">
      <Menu text="ログイン" />

      <main className="flex min-h-screen items-center justify-center px-4">
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
                  placeholder="your@email.com"
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
                  placeholder="••••••••"
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
              //   disabled={loading || !isValid}
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
