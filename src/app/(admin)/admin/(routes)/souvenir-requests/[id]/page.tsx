"use client";
import Button from "@/components/admin/ui/Button";
import React, { useEffect, useState, ChangeEvent, FC } from "react";
import { useRouter } from "next/navigation";

// Interfaces
interface RequestDetail {
  id: string | number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  souvenir_type: string;
  souvenir_description: string;
  desired_date: string;
  delivery_address: string;
  special_instructions: string;
  budget: number;
  status: "pending" | "in_progress" | "completed" | "cancelled" | string;
  created_at: string;
  updated_at: string;
  admin_notes: string;
}

interface RequestDetailsProps {
  params: { id: string };
}

const RequestDetailsPage: FC<RequestDetailsProps> = ({ params }) => {
  const router = useRouter();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    fetchRequestDetails();
  }, [params.id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      // Get access token from localStorage
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const response = await fetch(
        `https://15.206.185.80/gallery/admin/souvenir-requests/${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("依頼詳細の取得に失敗しました");
      }

      const data = await response.json();
      setRequest(data);
      setAdminNotes(data.admin_notes || "");
    } catch (error) {
      setError("依頼詳細の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!request) return;

    try {
      setIsUpdating(true);
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const response = await fetch(
        `https://15.206.185.80/gallery/admin/souvenir-requests/${request.id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            status: newStatus,
            admin_notes: adminNotes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      fetchRequestDetails();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotesUpdate = async () => {
    if (!request) return;

    try {
      setIsUpdating(true);
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const response = await fetch(
        `https://15.206.185.80/gallery/admin/souvenir-requests/${request.id}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ admin_notes: adminNotes }),
        }
      );

      if (!response.ok) {
        throw new Error("メモの更新に失敗しました");
      }

      fetchRequestDetails();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "未着手", color: "bg-yellow-100 text-yellow-800" },
      in_progress: { label: "作業中", color: "bg-blue-100 text-blue-800" },
      completed: { label: "完了", color: "bg-green-100 text-green-800" },
      cancelled: { label: "キャンセル", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-lg font-semibold text-gray-800 sm:text-2xl">
            依頼詳細
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="py-12 text-center text-gray-600">読み込み中...</div>
        </main>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-[#357AFF] hover:text-[#2E69DE]"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              戻る
            </button>
            <h1 className="text-lg font-semibold text-gray-800 sm:text-2xl">
              依頼詳細
            </h1>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="rounded bg-red-50 p-4 text-center text-red-500">
            {error || "依頼が見つかりません"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-[#357AFF] hover:text-[#2E69DE]"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            戻る
          </button>
          <h1 className="text-lg font-semibold text-gray-800 sm:text-2xl">
            依頼詳細 - ID: {request.id}
          </h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                依頼情報
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    依頼者名
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.customer_name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    メールアドレス
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.customer_email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    電話番号
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.customer_phone}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    お土産種類
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.souvenir_type}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    希望納期
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(request.desired_date).toLocaleDateString("ja-JP")}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    予算
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ¥{request.budget?.toLocaleString() || "未設定"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">
                    お土産詳細説明
                  </label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {request.souvenir_description}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">
                    配送先住所
                  </label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {request.delivery_address}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">
                    特別な指示
                  </label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {request.special_instructions || "なし"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                ステータス管理
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  現在のステータス
                </label>
                {getStatusBadge(request.status)}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  ステータス変更
                </label>
                <select
                  value={request.status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleStatusChange(e.target.value)
                  }
                  disabled={isUpdating}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="pending">未着手</option>
                  <option value="in_progress">作業中</option>
                  <option value="completed">完了</option>
                  <option value="cancelled">キャンセル</option>
                </select>
              </div>

              <div className="text-xs text-gray-500">
                <p>
                  依頼日時:{" "}
                  {new Date(request.created_at).toLocaleString("ja-JP")}
                </p>
                <p>
                  更新日時:{" "}
                  {new Date(request.updated_at).toLocaleString("ja-JP")}
                </p>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                管理者メモ
              </h3>

              <textarea
                value={adminNotes}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setAdminNotes(e.target.value)
                }
                placeholder="管理者用のメモを入力してください..."
                rows={6}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm resize-none"
              />

              <Button
                onClick={handleNotesUpdate}
                disabled={isUpdating}
                className="mt-3 w-full"
              >
                {isUpdating ? "更新中..." : "メモを保存"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestDetailsPage;
