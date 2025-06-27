"use client";
import React, { useEffect, useState } from "react";
import Menu from "@/components/home/Menu";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import {
  GalleryItem,
  UserSouvenirRequestResponse,
} from "@/infrastructure/user/utils/types";
import Button from "@/components/ui/Button";
import { FiDownload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/loading/Loading";

const AlibiSouvenir = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderModal, setOrderModal] = useState<GalleryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");
  const [souvenirRequests, setSouvenirRequests] = useState<
    UserSouvenirRequestResponse[]
  >([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestPage, setRequestPage] = useState(1);
  const REQUESTS_PER_PAGE = 6;
  const totalPages = Math.ceil(souvenirRequests.length / REQUESTS_PER_PAGE);
  const paginatedRequests = souvenirRequests.slice(
    (requestPage - 1) * REQUESTS_PER_PAGE,
    requestPage * REQUESTS_PER_PAGE
  );

  const fetchGallery = async () => {
    try {
      const res = await userApiClient.getGalleryPhotos();
      setGalleryItems(res.results || []);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSouvenirRequests = async () => {
    setLoadingRequests(true);
    setRequestError(null);
    try {
      const data = await userApiClient.getUserSouvenirRequests();
      setSouvenirRequests(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : []
      );
    } catch (err: any) {
      setRequestError(err.message || "依頼一覧の取得に失敗しました");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Reset pagination to first page when requests change
  useEffect(() => {
    setRequestPage(1);
  }, [souvenirRequests]);

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 1,
      description: "",
      special_note: "",
      desire_delivery_date: "",
    },
  });

  const onOrderSubmit = async (data: any) => {
    if (!orderModal) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        media_files: [{ gallery_uid: orderModal.uid }],
        quantity: Number(data.quantity),
        description: data.description,
        special_note: data.special_note,
        desire_delivery_date: data.desire_delivery_date,
      };
      const res = await fetch(
        "https://15.206.185.80/gallery/souvenir-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "注文に失敗しました");
      }
      toast.success("注文が正常に送信されました！");
      setOrderModal(null);
      reset();
    } catch (err: any) {
      toast.error(
        err.message || "注文に失敗しました。もう一度お試しください。"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main_gradient_bg min-h-screen">
      <Menu
        text="アリバイギャラリーからお土産注文"
        position="left"
        className="pl-10"
      />
      <div className="max-w-6xl mt-4 lg:mt-0 mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant={activeTab === "form" ? "glassSec" : "glass"}
              className="w-full"
              type="button"
              onClick={() => setActiveTab("form")}
            >
              新規注文
            </Button>
            <Button
              variant={activeTab === "list" ? "glassSec" : "glass"}
              className="w-full"
              type="button"
              onClick={async () => {
                setActiveTab("list");
                fetchSouvenirRequests();
              }}
            >
              注文一覧
            </Button>
          </div>
        </div>

        {activeTab === "form" && (
          <>
            <h2 className="text-2xl font-bold text-white mt-10 mb-8 text-center">
              ギャラリーからお土産を選択
            </h2>
            {loading ? (
              <Loading />
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {galleryItems.map((item) => (
                  <div
                    key={item.uid}
                    className="rounded-2xl bg-white/10 shadow-2xl border border-white/20 hover:border-blue-400 transition-all p-4 flex flex-col gap-3 glass-card backdrop-blur-xl hover:shadow-blue-200/40 group relative cursor-pointer"
                    onClick={() => setOrderModal(item)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-100/20 to-white/10 mb-3 group-hover:scale-105 transition-transform duration-200">
                      <img
                        src={item.file}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-white font-semibold mb-1 text-base truncate">
                      {item.title}
                    </h3>
                    <div className="text-xs text-gray-400 line-clamp-2">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Order Modal */}
        {orderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">
            <div className="glass-card bg-gradient-to-br from-white/20 to-blue-100/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-0 max-w-lg w-full relative flex flex-col items-center border border-white/30 overflow-hidden">
              <button
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold bg-white/40 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-white/70 transition-all z-10 border border-white/30"
                onClick={() => setOrderModal(null)}
              >
                ×
              </button>
              <div className="w-full flex items-center justify-center rounded-b-3xl p-4">
                <img
                  src={orderModal.file}
                  alt={orderModal.title}
                  className="max-h-72 max-w-72 object-contain rounded-2xl shadow-xl border border-white/20"
                />
              </div>
              <div className="w-full px-8 py-6 flex flex-col items-center">
                <h3 className="text-xl font-bold mb-2 text-gray-900 drop-shadow text-center">
                  {orderModal.title}
                </h3>
                <form
                  className="w-full flex flex-col gap-4"
                  onSubmit={handleSubmit(onOrderSubmit)}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      数量
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register("quantity", { required: true, min: 1 })}
                      className="glass-input w-full p-3 rounded-lg border border-white/20 bg-white/30 text-gray-900"
                    />
                    {errors.quantity && (
                      <span className="text-xs text-red-500">
                        数量は1以上で入力してください
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      説明
                    </label>
                    <textarea
                      {...register("description", { required: true })}
                      className="glass-input w-full p-3 rounded-lg border border-white/20 bg-white/30 text-gray-900"
                      placeholder="注文内容の詳細を入力してください"
                    />
                    {errors.description && (
                      <span className="text-xs text-red-500">
                        説明は必須です
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      特記事項
                    </label>
                    <textarea
                      {...register("special_note")}
                      className="glass-input w-full p-3 rounded-lg border border-white/20 bg-white/30 text-gray-900"
                      placeholder="特記事項があれば入力してください"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      納品希望日
                    </label>
                    <input
                      type="date"
                      {...register("desire_delivery_date", { required: true })}
                      className="glass-input w-full p-3 rounded-lg border border-white/20 bg-white/30 text-gray-900"
                    />
                    {errors.desire_delivery_date && (
                      <span className="text-xs text-red-500">
                        納品希望日は必須です
                      </span>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="glassSec"
                    size="md"
                    className="rounded-lg shadow-md border border-white/20 mt-2 w-full"
                    loading={submitting}
                    disabled={submitting}
                  >
                    注文する
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
        {activeTab === "list" && (
          <div className="glass-card p-8 mt-8">
            <h2 className="text-lg text-center text-white font-semibold mb-4">
              注文一覧
            </h2>
            {loadingRequests ? (
              <div className="text-center text-white">読み込み中...</div>
            ) : requestError ? (
              <div className="text-red-500">{requestError}</div>
            ) : souvenirRequests.length === 0 ? (
              <div>注文がありません。</div>
            ) : (
              <>
                <div className="flex flex-col gap-0 divide-y divide-white/10">
                  {paginatedRequests.map((req, idx) => (
                    <div
                      key={req.uid}
                      className={`flex items-center gap-6 py-4 px-2 glass-card bg-white/10 hover:bg-white/20 transition-all rounded-2xl ${
                        idx === 0 ? "mt-0" : ""
                      }`}
                    >
                      {/* Images */}
                      <div className="flex gap-2 min-w-[80px]">
                        {Array.isArray(req.media_files) &&
                        req.media_files.length > 0 ? (
                          req.media_files.slice(0, 3).map((file, i) => (
                            <div
                              key={i}
                              className="w-16 h-16 flex justify-center items-center rounded-xl overflow-hidden border border-white/15 bg-white/5"
                            >
                              <img
                                src={
                                  file.file.startsWith("http")
                                    ? file.file
                                    : `https://15.206.185.80${file.file}`
                                }
                                alt={`Souvenir file ${i + 1}`}
                                className="object-cover w-full h-full rounded-xl"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-xl text-gray-400 text-xl">
                            ?
                          </div>
                        )}
                      </div>
                      {/* Details */}
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-500 font-bold text-base flex items-center gap-2 font-jakarta truncate">
                            <svg
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <rect
                                width="20"
                                height="20"
                                rx="4"
                                fill="#357AFF"
                              />
                              <path
                                d="M7 10.5V9a5 5 0 0 1 10 0v1.5M7 10.5h10M7 10.5v3.25a2.25 2.25 0 0 0 2.25 2.25h5.5A2.25 2.25 0 0 0 17 13.75V10.5"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {req.description?.slice(0, 32) || "No Title"}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm border font-jakarta tracking-wide whitespace-nowrap ${
                              req.request_status === "approved"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : req.request_status === "pending"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                            }`}
                          >
                            {req.request_status}
                          </span>
                        </div>
                        <div className="text-gray-200 text-xs mb-1 line-clamp-2 font-medium font-jakarta truncate">
                          {req.special_note}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-300 font-jakarta mt-1">
                          <span className="font-medium">
                            数量:{" "}
                            <span className="font-normal">{req.quantity}</span>
                          </span>
                          <span className="font-medium">
                            納期:{" "}
                            <span className="font-normal">
                              {req.desire_delivery_date
                                ? new Date(
                                    req.desire_delivery_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                      variant="glassSec"
                      size="sm"
                      className="rounded-full px-4 py-2 shadow border border-white/20"
                      onClick={() => setRequestPage((p) => Math.max(1, p - 1))}
                      disabled={requestPage === 1}
                    >
                      前へ
                    </Button>
                    <span className="text-white/80 font-semibold text-base px-3">
                      {requestPage} / {totalPages}
                    </span>
                    <Button
                      variant="glassSec"
                      size="sm"
                      className="rounded-full px-4 py-2 shadow border border-white/20"
                      onClick={() =>
                        setRequestPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={requestPage === totalPages}
                    >
                      次へ
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AlibiSouvenir;
