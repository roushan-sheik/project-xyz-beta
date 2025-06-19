"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // react-hook-form ইম্পোর্ট

import { Search, Eye } from "lucide-react"; // Lucide আইকন ইম্পোর্ট
import Button from "@/components/ui/Button";

// API থেকে আসা ডেটার জন্য টাইপ
type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled";
type RequestType = "video" | "audio";

interface VideoRequest {
  id: number | string;
  customer_name: string;
  type: RequestType;
  description: string;
  status: RequestStatus;
  created_at: string;
}

// ফিল্টার ফর্মের ডেটার জন্য টাইপ
interface FilterFormInputs {
  searchTerm: string;
  status: RequestStatus | "all";
}

const MainComponent: React.FC = () => {
  // কম্পোনেন্টের State
  const [requests, setRequests] = useState<VideoRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // react-hook-form সেটআপ
  const { register, handleSubmit, watch, getValues } =
    useForm<FilterFormInputs>({
      defaultValues: {
        searchTerm: "",
        status: "all",
      },
    });

  // স্ট্যাটাস ফিল্টারের পরিবর্তন ট্র্যাক করার জন্য watch
  const watchedStatus = watch("status");

  // ডেটা fetch করার জন্য useEffect
  useEffect(() => {
    fetchRequests();
  }, [currentPage, watchedStatus]); // currentPage বা status পরিবর্তন হলে রি-ফেচ হবে

  // API থেকে ডেটা fetch করার ফাংশন
  const fetchRequests = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { searchTerm, status } = getValues(); // ফর্ম থেকে বর্তমান ভ্যালু নেওয়া হচ্ছে
      const response = await fetch("/api/admin/video-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: currentPage,
          search: searchTerm,
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error("依頼データの取得に失敗しました");
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ফর্ম সাবমিট হলে এই ফাংশন কল হবে
  const onSearchSubmit: SubmitHandler<FilterFormInputs> = () => {
    setCurrentPage(1); // সার্চ করলে প্রথম পেজে ফিরে যাবে
    fetchRequests();
  };

  // স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusChange = async (
    requestId: number | string,
    newStatus: RequestStatus
  ): Promise<void> => {
    try {
      const response = await fetch("/api/admin/video-requests/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      const updatedRequests = requests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      );
      setRequests(updatedRequests);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1
            className="text-2xl font-medium text-gray-800"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            アリバイ動画音声依頼管理
          </h1>
        </header>

        <main className="p-6">
          <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <form
              onSubmit={handleSubmit(onSearchSubmit)}
              className="flex flex-col md:flex-row gap-4 items-center"
            >
              <input
                type="text"
                {...register("searchTerm")}
                placeholder="依頼者名、依頼内容で検索..."
                className="flex-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <select
                {...register("status")}
                className="w-full md:w-auto rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全てのステータス</option>
                <option value="pending">未着手</option>
                <option value="in_progress">作業中</option>
                <option value="completed">完了</option>
                <option value="cancelled">キャンセル</option>
              </select>
              <Button
                leftIcon={<Search className="h-4 w-4" />}
                className="bg-[#357AFF] text-white hover:bg-[#2E69DE] w-full md:w-auto"
                type="submit"
              >
                検索
              </Button>
            </form>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12 text-gray-600">
              読み込み中...
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "依頼ID",
                      "依頼者",
                      "依頼種別",
                      "依頼内容",
                      "ステータス",
                      "依頼日時",
                      "操作",
                    ].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.type === "video" ? "動画" : "音声"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {request.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={request.status}
                          onChange={(e) =>
                            handleStatusChange(
                              request.id,
                              e.target.value as RequestStatus
                            )
                          }
                          className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">未着手</option>
                          <option value="in_progress">作業中</option>
                          <option value="completed">完了</option>
                          <option value="cancelled">キャンセル</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(request.created_at).toLocaleString("ja-JP")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={`/admin/video-requests/${request.id}`}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          詳細
                        </a>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        依頼データが見つかりません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainComponent;
