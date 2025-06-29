"use client";
import Button from "@/components/admin/ui/Button";
import React, { useEffect, useState, FormEvent, ChangeEvent, FC } from "react";
import Link from "next/link";

// Interfaces
interface Request {
  uid: string | number;
  customer_name: string;
  souvenir_type: string;
  desired_date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | string;
  created_at: string;
  budget?: number;
}

const MainComponent: FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, selectedStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      // Get access token from localStorage
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (selectedStatus && selectedStatus !== "all")
        params.append("status", selectedStatus);
      params.append("page", currentPage.toString());
      params.append("limit", "10"); // Add pagination limit

      const url = `https://15.206.185.80/gallery/admin/souvenir-requests?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`依頼データの取得に失敗しました (${response.status})`);
      }

      const data = await response.json();
      setRequests(data.results || data.data || data); // Handle different response structures
      setTotalCount(
        data.count || data.total || (Array.isArray(data) ? data.length : 0)
      );
      setTotalPages(
        data.totalPages || Math.ceil((data.count || data.total || 0) / 10)
      );
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(error.message || "依頼データの取得に失敗しました");
      setRequests([]); // Clear requests on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchRequests();
  };

  const handleStatusChange = async (
    requestId: string | number,
    newStatus: string
  ) => {
    try {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const response = await fetch(
        `https://15.206.185.80/gallery/admin/souvenir-requests/${requestId}/update`,
        {
          method: "PUT", // Changed from POST to PUT for better REST practices
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      // Update the local state immediately for better UX
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.uid === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (err: any) {
      console.error("Status update error:", err);
      setError(err.message);
      // Refresh data to ensure consistency
      fetchRequests();
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setCurrentPage(1);
  };
  console.log({ requests });
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800 sm:text-2xl">
            アリバイお土産依頼管理
          </h1>
          <div className="text-sm text-gray-600">総件数: {totalCount}件</div>
        </div>
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
            />
            <select
              value={selectedStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedStatus(e.target.value)
              }
              className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
            >
              <option value="all">全てのステータス</option>
              <option value="pending">未着手</option>
              <option value="in_progress">作業中</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="lg:w-20">
                <h4 className="text-center w-full">検索</h4>
              </Button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                クリア
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-500 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-gray-600">
            <div className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              読み込み中...
            </div>
          </div>
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
                    お土産種類
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    希望納期
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                    予算
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
                  <tr key={request.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-600 font-mono">
                      #{request.uid}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                      {request.customer_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {request.souvenir_type}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(request.desired_date).toLocaleDateString(
                        "ja-JP"
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {request.budget
                        ? `¥${request.budget.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(request.status)}
                        <select
                          value={request.status}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            handleStatusChange(request.uid, e.target.value)
                          }
                          className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                        >
                          <option value="pending">未着手</option>
                          <option value="in_progress">作業中</option>
                          <option value="completed">完了</option>
                          <option value="cancelled">キャンセル</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(request.created_at).toLocaleString("ja-JP")}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Link
                        href={`/admin/souvenir-requests/${request.uid}`}
                        className="text-[#357AFF] hover:text-[#2E69DE] font-medium"
                      >
                        <i className="fa-regular fa-eye mr-1"></i>
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <i className="fa-regular fa-file-lines text-2xl text-gray-400"></i>
                        <p>依頼データが見つかりません</p>
                        {(searchTerm || selectedStatus !== "all") && (
                          <button
                            onClick={clearFilters}
                            className="text-[#357AFF] hover:text-[#2E69DE] text-sm"
                          >
                            フィルターをクリア
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <i className="fa-solid fa-angles-left"></i>
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and 2 pages around current
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 2) return true;
                return false;
              })
              .map((page, index, array) => {
                // Add ellipsis where needed
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-2 py-2 text-sm text-gray-400">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-4 py-2 text-sm ${
                        currentPage === page
                          ? "bg-[#357AFF] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <i className="fa-solid fa-angles-right"></i>
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {requests.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {currentPage === 1 ? 1 : (currentPage - 1) * 10 + 1} -{" "}
            {Math.min(currentPage * 10, totalCount)} / {totalCount}件を表示
          </div>
        )}
      </main>
    </div>
  );
};

export default MainComponent;
