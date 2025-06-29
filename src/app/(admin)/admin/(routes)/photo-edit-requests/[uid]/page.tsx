"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Camera,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface FileItem {
  file_type: string;
  user_request_file: string;
  file_status: string;
  admin_response_file: string;
}

interface PhotoEditRequestDetail {
  uid: string;
  description: string;
  special_note: string;
  request_status: string;
  request_type: string;
  desire_delivery_date: string;
  files: FileItem[];
}

const STATUS_OPTIONS = [
  { value: "pending", label: "未着手", color: "bg-gray-100 text-gray-700" },
  { value: "in_progress", label: "作業中", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "完了", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "キャンセル", color: "bg-red-100 text-red-700" },
];

const PhotoEditRequestDetailPage = () => {
  const [data, setData] = useState<PhotoEditRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: PhotoEditRequestDetail = {
      uid: "REQ-2024-001",
      description:
        "プロフィール写真の背景を透明にして、明度を調整してください。全体的にプロフェッショナルな印象になるように仕上げをお願いします。",
      special_note:
        "急ぎの案件です。可能であれば24時間以内の納品を希望します。",
      request_status: "in_progress",
      request_type: "背景除去・色調補正",
      desire_delivery_date: "2024-06-30T10:00:00Z",
      files: [
        {
          file_type: "JPEGファイル",
          user_request_file: "https://example.com/original.jpg",
          file_status: "処理中",
          admin_response_file: "",
        },
        {
          file_type: "RAWファイル",
          user_request_file: "https://example.com/original.raw",
          file_status: "完了",
          admin_response_file: "https://example.com/processed.jpg",
        },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setStatusUpdating(true);
    setStatusError(null);
    setStatusSuccess(null);

    // Simulate API call
    setTimeout(() => {
      setData((prev) => (prev ? { ...prev, request_status: newStatus } : prev));
      setStatusSuccess("ステータスが更新されました");
      setStatusUpdating(false);

      // Clear success message after 3 seconds
      setTimeout(() => setStatusSuccess(null), 3000);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusOption ? statusOption : STATUS_OPTIONS[0];
  };

  const getFileStatusIcon = (status: string) => {
    switch (status) {
      case "完了":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "処理中":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statusBadge = getStatusBadge(data.request_status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={"/admin/photo-edit-requests"}>
            <button className="flex items-center cursor-pointer space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">一覧に戻る</span>
            </button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                写真加工依頼詳細
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>依頼ID: {data.uid}</span>
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full font-medium text-sm ${statusBadge.color}`}
            >
              {statusBadge.label}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <span>依頼内容</span>
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    依頼タイプ
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <span className="text-blue-800 font-medium">
                      {data.request_type}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    詳細説明
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                </div>

                {data.special_note && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      特記事項
                    </label>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-amber-800">{data.special_note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ステータス管理
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    現在のステータス
                  </label>
                  <select
                    value={data.request_status}
                    onChange={handleStatusChange}
                    disabled={statusUpdating}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Messages */}
                {statusUpdating && (
                  <div className="flex items-center space-x-2 text-blue-600 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>更新中...</span>
                  </div>
                )}

                {statusSuccess && (
                  <div className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4" />
                    <span>{statusSuccess}</span>
                  </div>
                )}

                {statusError && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4" />
                    <span>{statusError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>納品情報</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">納品希望日</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(data.desire_delivery_date).toLocaleString(
                      "ja-JP",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    残り時間:{" "}
                    {Math.ceil(
                      (new Date(data.desire_delivery_date).getTime() -
                        Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    日
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditRequestDetailPage;
