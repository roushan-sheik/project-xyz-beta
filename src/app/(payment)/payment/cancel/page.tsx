"use client";
import React from "react";
import { XCircle, Home, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="glass-card rounded-lg p-8 text-center">
            <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              支払いがキャンセルされました
            </h2>
            <p className="text-gray-300 mb-6">
              支払いがキャンセルされました。いつでも再度お試しいただけます。
            </p>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 font-medium mb-2">
                何か問題がありましたか？
              </p>
              <p className="text-sm text-gray-300">
                サポートチームがお手伝いします。お気軽にお問い合わせください。
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/subscription">
                <Button
                  variant="glassBrand"
                  className="w-full flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  プラン選択に戻る
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" className="w-full">
                  サポートに問い合わせ
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <Home className="mr-2 h-4 w-4" />
                  ホームに戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentCancelPage;
