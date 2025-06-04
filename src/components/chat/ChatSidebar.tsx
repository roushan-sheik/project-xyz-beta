"use client";
import { ChatRoom } from "@/types/chat/types";
import React from "react";

interface ChatSidebarProps {
  chatRooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  onRoomSelect: (room: ChatRoom) => void;
  onNewRoom: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatRooms,
  selectedRoom,
  onRoomSelect,
  onNewRoom,
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? "今" : `${minutes}分前`;
    } else if (hours < 24) {
      return `${hours}時間前`;
    } else {
      return date.toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="chat-sidebar w-80 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">チャット</h1>
        </div>

        <button
          onClick={onNewRoom}
          className="glass-button w-full p-3 text-white font-medium"
        >
          新しいチャットルーム
        </button>
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4">
          <p className="text-white/70 text-sm mb-4">
            チャットルームを選択してください
          </p>

          <div className="space-y-2">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onRoomSelect(room)}
                className={`chat-room-item p-4 cursor-pointer ${
                  selectedRoom?.id === room.id ? "active" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white truncate">
                    {room.title}
                  </h3>
                  <span className="text-xs text-white/60 ml-2 flex-shrink-0">
                    {formatTime(room.lastActivity)}
                  </span>
                </div>

                {room.lastMessage && (
                  <p className="text-sm text-white/70 truncate">
                    {room.lastMessage}
                  </p>
                )}

                {room.unreadCount && room.unreadCount > 0 && (
                  <div className="flex justify-end mt-2">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {room.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
