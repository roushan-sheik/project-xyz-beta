"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatRoomSchema, ChatRoomFormData } from "@/schemas/chat";

interface NewRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChatRoomFormData) => void;
}

const NewRoomModal: React.FC<NewRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChatRoomFormData>({
    resolver: zodResolver(chatRoomSchema),
  });

  const handleFormSubmit = (data: ChatRoomFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="modal-content p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          新しいチャットルームを作成
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              {...register("title")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="チャットルームのタイトル"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRoomModal;
