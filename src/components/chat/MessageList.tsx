"use client";
import { Message } from "@/types/chat/types";
import React, { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (messages.length === 0) {
    return (
      <div className="chat-messages flex-1 flex items-center justify-center">
        <div className="text-center text-white/60">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-lg">メッセージを送信して会話を始めましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages flex-1 overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs lg:max-w-md">
              {message.sender === "other" && message.senderName && (
                <p className="text-xs text-white/60 mb-1 ml-3">
                  {message.senderName}
                </p>
              )}

              <div
                className={`message-bubble ${
                  message.sender === "user" ? "message-user" : "message-other"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user"
                      ? "text-white/80"
                      : "text-white/60"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
