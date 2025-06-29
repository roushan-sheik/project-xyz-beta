"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Video,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Eye,
  Music,
  Film,
} from "lucide-react";
import Link from "next/link";

interface FileItem {
  file_type: string;
  user_request_file: string;
  file_status: string;
  admin_response_file: string;
}

interface VideoEditRequestDetail {
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
  {
    value: "in_progress",
    label: "作業中",
    color: "bg-purple-100 text-purple-700",
  },
  { value: "completed", label: "完了", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "キャンセル", color: "bg-red-100 text-red-700" },
];

const VideoEditRequestDetailPage = () => {
  const [data, setData] = useState<VideoEditRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: VideoEditRequestDetail = {
      uid: "VID-2024-007",
      description:
        "企業紹介動画の編集をお願いします。オープニングとエンディングのタイトル追加、BGM挿入、カラーグレーディングを行ってください。全体的にプロフェッショナルな仕上がりを希望します。",
      special_note:
        "クライアントプレゼン用なので、高品質な仕上がりをお願いします。音声レベルの調整も重要です。",
      request_status: "in_progress",
      request_type: "動画編集・音声調整",
      desire_delivery_date: "2024-07-05T15:00:00Z",
      files: [
        {
          file_type: "MP4ファイル",
          user_request_file: "https://example.com/original_video.mp4",
          file_status: "処理中",
          admin_response_file: "",
        },
        {
          file_type: "音声ファイル",
          user_request_file: "https://example.com/narration.wav",
          file_status: "完了",
          admin_response_file: "https://example.com/processed_audio.mp3",
        },
        {
          file_type: "字幕ファイル",
          user_request_file: "https://example.com/subtitles.srt",
          file_status: "完了",
          admin_response_file: "https://example.com/final_subtitles.srt",
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
        return <Clock className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes("MP4") || fileType.includes("動画")) {
      return <Video className="w-4 h-4 text-purple-600" />;
    } else if (
      fileType.includes("音声") ||
      fileType.includes("WAV") ||
      fileType.includes("MP3")
    ) {
      return <Music className="w-4 h-4 text-blue-600" />;
    } else if (fileType.includes("字幕")) {
      return <FileText className="w-4 h-4 text-green-600" />;
    }
    return <Film className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={"/admin/video-requests"}>
            <button className="flex items-center cursor-pointer space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">一覧に戻る</span>
            </button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                動画/音声加工依頼詳細
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <Film className="w-4 h-4" />
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
                <Video className="w-5 h-5 text-purple-600" />
                <span>依頼内容</span>
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    依頼タイプ
                  </label>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <span className="text-purple-800 font-medium">
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  <div className="flex items-center space-x-2 text-purple-600 text-sm">
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
                <Calendar className="w-5 h-5 text-purple-600" />
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

            {/* Video Processing Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Video className="w-5 h-5 text-purple-600" />
                <span>処理のポイント</span>
              </h3>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>高品質な出力には十分な処理時間が必要です</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>音声レベルの調整は最終段階で行います</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>カラーグレーディングで全体の統一感を調整</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditRequestDetailPage;
