"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/admin/ui/Button";
import { useParams } from "next/navigation";

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
  { value: "pending", label: "未着手" },
  { value: "in_progress", label: "作業中" },
  { value: "completed", label: "完了" },
  { value: "cancelled", label: "キャンセル" },
];

const VideoEditRequestDetailPage = () => {
  const { uid } = useParams() as { uid: string };
  const [data, setData] = useState<VideoEditRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await fetch(`https://15.206.185.80/gallery/admin/video-audio-edit-requests/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
      });
      if (!response.ok) throw new Error('詳細データの取得に失敗しました');
      const detail = await response.json();
      setData(detail);
    } catch (err: any) {
      setError(err.message || '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!uid) return;
    fetchDetail();
  }, [uid]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusUpdating(true);
    setStatusError(null);
    setStatusSuccess(null);
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      let csrfToken = null;
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        if (match) csrfToken = match[1];
      }
      if (!csrfToken && typeof window !== 'undefined') {
        csrfToken = localStorage.getItem('csrftoken');
      }
      const response = await fetch(`https://15.206.185.80/gallery/admin/video-audio-edit-requests/${uid}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
          ...(csrfToken ? { 'X-CSRFTOKEN': csrfToken } : {}),
        },
        body: JSON.stringify({ request_status: newStatus }),
      });
      if (!response.ok) throw new Error('ステータスの更新に失敗しました');
      setStatusSuccess('ステータスが更新されました');
      // Refetch detail from backend to ensure dropdown is in sync
      await fetchDetail();
    } catch (err: any) {
      setStatusError(err.message || '予期しないエラーが発生しました');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">読み込み中...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">動画/音声加工依頼詳細</h1>
      <div className="mb-4">
        <span className="font-semibold">依頼ID:</span> {data.uid}
      </div>
      <div className="mb-4">
        <span className="font-semibold">依頼内容:</span> {data.description}
      </div>
      <div className="mb-4">
        <span className="font-semibold">特記事項:</span> {data.special_note}
      </div>
      <div className="mb-4">
        <span className="font-semibold">ステータス:</span>{" "}
        <select
          value={data.request_status}
          onChange={handleStatusChange}
          disabled={statusUpdating}
          className="rounded border border-gray-300 px-2 py-1 text-sm ml-2"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {statusUpdating && <span className="ml-2 text-blue-500">更新中...</span>}
        {statusSuccess && <span className="ml-2 text-green-600">{statusSuccess}</span>}
        {statusError && <span className="ml-2 text-red-500">{statusError}</span>}
      </div>
      <div className="mb-4">
        <span className="font-semibold">依頼タイプ:</span> {data.request_type}
      </div>
      <div className="mb-4">
        <span className="font-semibold">納品希望日:</span> {new Date(data.desire_delivery_date).toLocaleString('ja-JP')}
      </div>
      <div className="mb-4">
        <span className="font-semibold">ファイル一覧:</span>
        <div className="mt-2 space-y-2">
          {data.files && data.files.length > 0 ? (
            data.files.map((file, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center gap-2">
                <div><span className="font-medium">種別:</span> {file.file_type}</div>
                <div><span className="font-medium">ユーザー提出:</span> <a href={file.user_request_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ファイル</a></div>
                <div><span className="font-medium">ファイル状態:</span> {file.file_status}</div>
                {file.admin_response_file && <div><span className="font-medium">管理者納品:</span> <a href={file.admin_response_file} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">ファイル</a></div>}
              </div>
            ))
          ) : (
            <div className="text-gray-400">ファイルがありません</div>
          )}
        </div>
      </div>
      <Button className="mt-6" onClick={() => window.history.back()}>戻る</Button>
    </div>
  );
};

export default VideoEditRequestDetailPage; 