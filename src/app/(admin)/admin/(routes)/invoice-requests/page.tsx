"use client";
import Button from "@/components/admin/ui/Button";
import React, { useEffect, useState, FormEvent, ChangeEvent, FC } from "react";

// Interfaces
interface InvoiceRequest {
  id: string | number;
  customer_name: string;
  company_name: string;
  amount: number;
  status: "pending" | "issued" | "cancelled" | string;
  created_at: string;
}

const MainComponent: FC = () => {
  const [requests, setRequests] = useState<InvoiceRequest[]>([]);
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
      const response = await fetch("/api/admin/invoice-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: currentPage,
          search: searchTerm,
          status: selectedStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("請求書データの取得に失敗しました");
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRequests();
  };

  const handleStatusChange = async (
    requestId: string | number,
    newStatus: string
  ) => {
    try {
      const response = await fetch("/api/admin/invoice-requests/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      fetchRequests();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDownload = async (requestId: string | number) => {
    try {
      const response = await fetch(
        `/api/admin/invoice-requests/${requestId}/download`
      );
      if (!response.ok) {
        throw new Error("請求書のダウンロードに失敗しました");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${requestId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-medium text-gray-800">
            ダミー請求書依頼管理
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
                placeholder="依頼者名、会社名で検索..."
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
                <option value="pending">未発行</option>
                <option value="issued">発行済み</option>
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
                      依頼者
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      会社名
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      金額
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      ステータス
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      依頼日時
                    </th>
                    <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b last:border-b-0">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {request.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {request.customer_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {request.company_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        ¥{request.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={request.status}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            handleStatusChange(request.id, e.target.value)
                          }
                          className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                        >
                          <option value="pending">未発行</option>
                          <option value="issued">発行済み</option>
                          <option value="cancelled">キャンセル</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(request.created_at).toLocaleString("ja-JP")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-3">
                          <a
                            href={`/admin/invoice-requests/${request.id}`}
                            className="text-[#357AFF] hover:text-[#2E69DE]"
                          >
                            <i className="fa-regular fa-eye mr-1"></i>
                            詳細
                          </a>
                          {request.status === "issued" && (
                            <button
                              onClick={() => handleDownload(request.id)}
                              className="text-[#357AFF] hover:text-[#2E69DE]"
                            >
                              <i className="fa-regular fa-download mr-1"></i>
                              ダウンロード
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        請求書データが見つかりません
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
