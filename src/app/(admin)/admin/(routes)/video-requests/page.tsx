"use client";
import Button from "@/components/admin/ui/Button";
import React, { useEffect, useState, FormEvent, ChangeEvent, FC } from "react";

interface VideoRequest {
  uid: string;
  customer_name: string;
  description: string;
  type: "video" | "audio";
  request_status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
}

interface VideoRequestResponse {
  requests: VideoRequest[];
  totalPages: number;
}

const MainComponent: FC = () => {
  const [requests, setRequests] = useState<VideoRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, selectedStatus]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRequests();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      if (searchTerm) params.append("search", searchTerm);
      if (selectedStatus && selectedStatus !== "all") params.append("status", selectedStatus);
      const response = await fetch(`https://15.206.185.80/gallery/admin/video-audio-edit-requests?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!response.ok) throw new Error("依頼データの取得に失敗しました");
      const data = await response.json();
      setRequests(data.results || data.requests || []);
      setTotalPages(data.total_pages || data.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "不明なエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRequests();
  };

  const handleStatusChange = async (
    requestId: string,
    newStatus: VideoRequest["request_status"]
  ) => {
    try {
      const response = await fetch("/api/admin/video-requests/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: newStatus }),
      });

      if (!response.ok) throw new Error("ステータスの更新に失敗しました");

      fetchRequests();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "不明なエラーが発生しました");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <h1 className="text-lg font-semibold text-gray-800 sm:text-2xl">
          アリバイ動画音声依頼管理
        </h1>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              placeholder="依頼者名、依頼内容で検索..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            />
            <select
              value={selectedStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedStatus(e.target.value)
              }
              className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2"
            >
              <option value="all">全てのステータス</option>
              <option value="pending">未着手</option>
              <option value="in_progress">作業中</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
            <Button className="lg:w-20 text-center" type="submit">
              <h4 className="text-center w-full">検索</h4>
            </Button>
          </form>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-gray-600">読み込み中...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    依頼ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    依頼者
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    種別
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    内容
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    ステータス
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    依頼日時
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr key={request.uid}>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {request.uid}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      {request.customer_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {request.type === "video" ? "動画" : "音声"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 line-clamp-2">
                      {request.description}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <select
                        value={request.request_status}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          handleStatusChange(
                            request.uid,
                            e.target.value as VideoRequest["request_status"]
                          )
                        }
                        className="rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="pending">未着手</option>
                        <option value="in_progress">作業中</option>
                        <option value="completed">完了</option>
                        <option value="cancelled">キャンセル</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(request.created_at).toLocaleString("ja-JP")}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <a
                        href={`/admin/video-requests/${request.uid}`}
                        className="text-[#357AFF] hover:text-[#2E69DE]"
                      >
                        <i className="fa-regular fa-eye mr-1"></i>詳細
                      </a>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-sm text-gray-500"
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
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-4 py-2 text-sm ${
                  currentPage === page
                    ? "bg-[#357AFF] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MainComponent;
