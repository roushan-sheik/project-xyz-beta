"use client";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Button from "@/components/admin/ui/Button";
import { baseUrl } from "@/constants/baseApi";
import { getAuthHeaders } from "@/infrastructure/admin/utils/getAuthHeaders";

// ✅ Types matching Swagger response
interface FileItem {
  file_type: string;
  user_request_file: string;
  file_status: string;
  admin_response_file: string;
}

interface PhotoEditRequest {
  uid: string;
  description: string;
  special_note: string;
  request_status: "pending" | "in_progress" | "completed" | "cancelled";
  request_type: string;
  desire_delivery_date: string;
  files: FileItem[];
}

interface PhotoEditResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PhotoEditRequest[];
}

const MainComponent: React.FC = () => {
  const [requests, setRequests] = useState<PhotoEditRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, selectedStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const url = new URL(`${baseUrl}/gallery/admin/photo-edit-requests`);
      url.searchParams.set("page", currentPage.toString());
      if (searchTerm) url.searchParams.set("search", searchTerm);
      if (selectedStatus !== "all")
        url.searchParams.set("status", selectedStatus); /*  */

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("依頼データの取得に失敗しました");
      }

      const data: PhotoEditResponse = await response.json();
      setRequests(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
    } catch (err: any) {
      console.error(err);
      setError(err.message || "予期しないエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRequests();
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/gallery/admin/photo-edit-requests`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ uid: requestId, status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      fetchRequests();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "予期しないエラーが発生しました");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-medium text-gray-800">
            アリバイ写真加工依頼管理
          </h1>
        </header>

        <main className="p-6">
          <div className="mb-6 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="依頼内容で検索..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
              />
              <select
                value={selectedStatus}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedStatus(e.target.value)
                }
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="all">全てのステータス</option>
                <option value="pending">未着手</option>
                <option value="in_progress">作業中</option>
                <option value="completed">完了</option>
                <option value="cancelled">キャンセル</option>
              </select>
              <Button type="submit">検索</Button>
            </form>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-gray-600">読み込み中...</div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      依頼ID
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      依頼内容
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      ステータス
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      納品希望日
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.uid} className="border-b last:border-b-0">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {request.uid}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="line-clamp-2">
                          {request.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={request.request_status}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            handleStatusChange(request.uid, e.target.value)
                          }
                          className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                        >
                          <option value="pending">未着手</option>
                          <option value="in_progress">作業中</option>
                          <option value="completed">完了</option>
                          <option value="cancelled">キャンセル</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(request.desire_delivery_date).toLocaleString(
                          "ja-JP"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`/admin/photo-edit-requests/${request.uid}`}
                          className="text-[#357AFF] hover:text-[#2E69DE]"
                        >
                          <i className="fa-regular fa-eye mr-1"></i>
                          詳細
                        </a>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
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
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-4 py-2 ${
                      currentPage === page
                        ? "bg-[#357AFF] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
