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
import { X } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { baseUrl } from "@/constants/baseApi";
import {
  ClipboardList,
  AlertCircle,
  Image,
  Hash,
  Package,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
      const res = await fetch(`${baseUrl}/gallery/souvenir-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
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
  // console.log({ paginatedRequests });

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
              <Spinner />
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

        {orderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="relative max-w-xl w-full bg-gradient-to-br from-white/10 to-blue-100/10 border border-white/20 shadow-2xl rounded-xl p-6 backdrop-blur-2xl text-white overflow-hidden">
              <div className="pb-4">
                {/* Title */}
                <h3 className="text-xl font-semibold text-center  ">
                  {orderModal.title}
                </h3>
              </div>
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white   w-9 h-9 flex items-center justify-center text-4xl cursor-pointer transition-all"
                onClick={() => setOrderModal(null)}
              >
                <X size={30} className="hover:text-red-500" />
              </button>

              {/* Image Preview */}
              <div className="flex justify-center  ">
                <div className="w-full h-52 sm:h-60 md:h-64 rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-white/10 backdrop-blur-md mb-6">
                  <img
                    src={orderModal.file}
                    alt={orderModal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Form */}
              <form
                className="w-full flex flex-col gap-4"
                onSubmit={handleSubmit(onOrderSubmit)}
              >
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/80">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...register("quantity", { required: true, min: 1 })}
                    className="w-full p-2 rounded-lg border border-white/20 bg-white/20 text-white placeholder-white/60 focus:outline-none"
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && (
                    <span className="text-xs text-red-400">
                      Quantity must be at least 1.
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/80">
                    Description
                  </label>
                  <textarea
                    {...register("description", { required: true })}
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-white/60 focus:outline-none"
                    placeholder="Provide order details..."
                  />
                  {errors.description && (
                    <span className="text-xs text-red-400">
                      Description is required.
                    </span>
                  )}
                </div>

                {/* Special Note */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/80">
                    Special Note
                  </label>
                  <textarea
                    {...register("special_note")}
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-white/60 focus:outline-none"
                    placeholder="Optional notes..."
                  />
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/80">
                    Desired Delivery Date
                  </label>
                  <input
                    type="date"
                    {...register("desire_delivery_date", { required: true })}
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-white/60 focus:outline-none"
                  />
                  {errors.desire_delivery_date && (
                    <span className="text-xs text-red-400">
                      Delivery date is required.
                    </span>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="glassSec"
                  size="md"
                  className="rounded-lg shadow-md border border-white/20 mt-2 w-full"
                  loading={submitting}
                  disabled={submitting}
                >
                  Place Order
                </Button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="glass-card p-0 mt-8 overflow-hidden">
            {/* Header */}
            <div className="glass-heigh-pro rounded-0 px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3 font-jakarta">
                <ClipboardList className="w-6 h-6 text-white/80" />
                注文一覧
              </h2>
            </div>

            <div className="p-6">
              {loadingRequests ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                </div>
              ) : requestError ? (
                <div className="glass-red p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-white/90" />
                    <span className="text-white/90 font-medium font-jakarta">
                      {requestError}
                    </span>
                  </div>
                </div>
              ) : souvenirRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="glass-mid w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-10 h-10 text-white/60" />
                  </div>
                  <p className="text-white/80 text-lg font-medium font-jakarta mb-2">
                    注文がありません
                  </p>
                  <p className="text-white/60 text-sm font-jakarta">
                    新しい注文を作成してください
                  </p>
                </div>
              ) : (
                <>
                  {/* Order List */}
                  <div className="grid grid-cols-1 md:grid-cols-2  w-full  gap-6">
                    {paginatedRequests.map((req, idx) => (
                      <div
                        key={req.uid}
                        className="rounded-2xl w-full  glass border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 p-6 shadow-xl animate-fade-in"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        {/* Header with Icon and Status */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 flex-shrink-0">
                              <Package className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-blue-400 font-semibold text-lg truncate font-jakarta">
                              {req.description?.slice(0, 40) || "タイトルなし"}
                              {req.description?.length > 40 && "..."}
                            </h3>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-3 ${
                              req.request_status === "approved"
                                ? "bg-green-500 text-white"
                                : req.request_status === "pending"
                                ? "bg-yellow-500 text-black"
                                : req.request_status === "rejected"
                                ? "bg-red-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            {req.request_status === "approved" && "承認済み"}
                            {req.request_status === "pending" && "審査中"}
                            {req.request_status === "rejected" && "却下"}
                            {!["approved", "pending", "rejected"].includes(
                              req.request_status
                            ) && req.request_status}
                            {req.request_status ? req.request_status : "Status"}
                          </span>
                        </div>

                        {/* Note/Description */}
                        {req.special_note && (
                          <div className="mb-4">
                            <span className="text-white/70 text-sm font-medium font-jakarta">
                              Note:{" "}
                            </span>
                            <span className="text-white text-sm font-jakarta">
                              {req.special_note}
                            </span>
                          </div>
                        )}

                        {/* Delivery Date */}
                        <div className="mb-4">
                          <span className="text-white/70 text-sm font-medium font-jakarta">
                            Delivery:{" "}
                          </span>
                          <span className="text-white text-sm font-jakarta">
                            {req.desire_delivery_date
                              ? new Date(
                                  req.desire_delivery_date
                                ).toLocaleDateString("ja-JP")
                              : "指定なし"}
                          </span>
                        </div>

                        {/* Product Images */}
                        {Array.isArray(req.media_files) &&
                          req.media_files.length > 0 && (
                            <div className="flex gap-2 mb-4">
                              {req.media_files.slice(0, 4).map((file, i) => (
                                <div
                                  key={i}
                                  className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 bg-white/5 shadow-sm"
                                >
                                  <img
                                    src={
                                      file.file.startsWith("http")
                                        ? file.file
                                        : `${baseUrl}${file.file}`
                                    }
                                    alt={`商品画像 ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {req.media_files.length > 4 && (
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                  <span className="text-white/70 text-xs font-semibold font-jakarta">
                                    +{req.media_files.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                        {/* Additional Details */}
                        {req.quantity && (
                          <div className="mb-2">
                            <span className="text-white/70 text-sm font-medium font-jakarta">
                              Quantity:{" "}
                            </span>
                            <span className="text-white text-sm font-jakarta">
                              {req.quantity}
                            </span>
                          </div>
                        )}

                        <div className="text-white/50 text-xs font-mono font-jakarta">
                          ID: {req.uid?.slice(0, 8) || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8 pt-6">
                      <div className="glass-mid rounded-full p-1 border border-white/20">
                        <button
                          className="px-4 py-2 text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-jakarta rounded-full hover:bg-white/10"
                          onClick={() =>
                            setRequestPage((p) => Math.max(1, p - 1))
                          }
                          disabled={requestPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1 inline" />
                          前へ
                        </button>
                      </div>

                      <div className="glass-heigh px-4 py-2 rounded-full border border-white/20">
                        <span className="text-white/60 text-sm font-jakarta">
                          ページ{" "}
                        </span>
                        <span className="text-white font-semibold font-jakarta">
                          {requestPage}
                        </span>
                        <span className="text-white/60 text-sm font-jakarta">
                          {" "}
                          / {totalPages}
                        </span>
                      </div>

                      <div className="glass-mid rounded-full p-1 border border-white/20">
                        <button
                          className="px-4 py-2 text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-jakarta rounded-full hover:bg-white/10"
                          onClick={() =>
                            setRequestPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={requestPage === totalPages}
                        >
                          次へ
                          <ChevronRight className="w-4 h-4 ml-1 inline" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AlibiSouvenir;
