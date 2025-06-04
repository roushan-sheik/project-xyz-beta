"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema, MessageFormData } from "@/schemas/chat";
import Button from "../ui/Button";
import { Send, SendHorizontal } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const handleFormSubmit = (data: MessageFormData) => {
    onSendMessage(data.message);
    reset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(handleFormSubmit)();
    }
  };

  return (
    <div className="chat-input-area p-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-3">
        <div className="flex-1">
          <textarea
            {...register("message")}
            className="glass-input w-full  p-3 resize-none"
            placeholder="メッセージを入力してください..."
            rows={1}
            disabled={disabled}
            onKeyPress={handleKeyPress}
            style={{
              minHeight: "55px",
              maxHeight: "120px",
            }}
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>
        <div className="flex  items-center mb-8">
          <Button variant="glassBrand">
            <div className="flex gap-2">
              <span>送信</span>
              <Send />
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
