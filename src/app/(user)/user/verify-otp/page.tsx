"use client";
import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Button from "@/components/ui/Button";

import { Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import { userApiClient } from "@/infrastructure/user/userAPIClient";

const VerifyOtp = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP input change
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const pasteValues = pasteData.slice(0, 6).split("");

    if (pasteValues.every((val) => !isNaN(Number(val)))) {
      const newOtp = [...otp];
      pasteValues.forEach((val, index) => {
        if (index < 6) newOtp[index] = val;
      });
      setOtp(newOtp);

      // Focus on the last filled input or next empty one
      const lastIndex = Math.min(pasteValues.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  // Submit OTP
  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("6桁のOTPを入力してください", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      await userApiClient.verifyOtp({ otp: otpString });

      setIsVerified(true);
      toast.success("Email認証が成功しました！", {
        position: "top-center",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("OTPの認証に失敗しました", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  if (isVerified) {
    return (
      <div className="min-h-screen main_gradient_bg text-white">
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          <ToastContainer />
          <div className="w-full max-w-md text-center">
            <div className="rounded-lg border glass-card p-8 space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <h2 className="text-white lg:text-3xl text-2xl font-semibold">
                認証成功
              </h2>
              <p className="text-gray-300 text-lg">
                Email認証が正常に完了しました
              </p>
              <div className="pt-4">
                <p className="text-sm text-gray-400">
                  まもなくログインページにリダイレクトします...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <ToastContainer />
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Mail className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-white lg:text-3xl text-2xl mb-2">OTP認証</h2>
            <p className="text-gray-300 text-sm">
              メールアドレスに送信された6桁のコードを入力してください
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border glass-card p-6 space-y-6">
              {/* OTP Input Fields */}
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="glass-input w-12 h-12 text-center text-lg font-semibold"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      backdropFilter: "blur(10px)",
                      color: "white",
                    }}
                  />
                ))}
              </div>

              {/* Resend OTP Link */}
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">
                  コードが届かない場合は？
                </p>
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                  onClick={() => {
                    toast.info("OTPを再送信しました", {
                      position: "top-center",
                    });
                  }}
                >
                  OTPを再送信
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full"
              type="button"
              onClick={handleSubmit}
              loading={loading}
              variant="glassBrand"
              disabled={otp.join("").length !== 6}
            >
              {loading ? "認証中..." : "認証する"}
            </Button>

            {/* Back to Register Link */}
            <div className="text-center text-sm text-gray-300">
              <Link href="/register" className="text-blue-400 hover:underline">
                ← 登録画面に戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyOtp;
