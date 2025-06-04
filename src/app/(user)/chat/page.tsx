"use client";
import React, { useState } from "react";

import { ChatRoomFormData } from "@/schemas/chat";

import "./styles.css";
import { ChatRoom, ChatState, Message } from "@/types/chat/types";
import ChatSidebar from "@/components/chat/ChatSidebar";
import MessageInput from "@/components/chat/MessageInput";
import MessageList from "@/components/chat/MessageList";
import NewRoomModal from "@/components/chat/NewRoomModal";

const ChatMain: React.FC = () => {
  // Sample data - replace with real data from your backend
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: "1",
      title: "一般的な質問",
      lastMessage: "ありがとうございました！",
      lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 2,
    },
    {
      id: "2",
      title: "技術サポート",
      lastMessage: "問題は解決しましたか？",
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "3",
      title: "プロジェクト相談",
      lastMessage: "来週の会議について",
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ]);

  const [chatState, setChatState] = useState<ChatState>({
    selectedRoom: null,
    showNewRoomModal: false,
    messages: [],
  });

  const sampleMessages: Message[] = [
    {
      id: "1",
      content: "こんにちは！何かお手伝いできることはありますか？",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      sender: "other",
      senderName: "サポート",
    },
    {
      id: "2",
      content: "はい、プロジェクトについて質問があります。",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      sender: "user",
    },
    {
      id: "3",
      content: "もちろんです！どのようなことでしょうか？詳しく教えてください。",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      sender: "other",
      senderName: "サポート",
    },
  ];

  const handleRoomSelect = (room: ChatRoom) => {
    setChatState((prev) => ({
      ...prev,
      selectedRoom: room,
      messages: room.id === "1" ? sampleMessages : [], // Show sample messages for first room
    }));

    // Mark room as read
    setChatRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r))
    );
  };

  const handleNewRoom = () => {
    setChatState((prev) => ({
      ...prev,
      showNewRoomModal: true,
    }));
  };

  const handleCloseModal = () => {
    setChatState((prev) => ({
      ...prev,
      showNewRoomModal: false,
    }));
  };

  const handleCreateRoom = (data: ChatRoomFormData) => {
    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      title: data.title,
      lastActivity: new Date(),
    };

    setChatRooms((prev) => [newRoom, ...prev]);
    setChatState((prev) => ({
      ...prev,
      selectedRoom: newRoom,
      messages: [],
      showNewRoomModal: false,
    }));
  };

  const handleSendMessage = (messageContent: string) => {
    if (!chatState.selectedRoom) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      timestamp: new Date(),
      sender: "user",
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    // Update last message in room
    setChatRooms((prev) =>
      prev.map((room) =>
        room.id === chatState.selectedRoom?.id
          ? {
              ...room,
              lastMessage: messageContent,
              lastActivity: new Date(),
            }
          : room
      )
    );

    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "メッセージを受信しました。ありがとうございます！",
        timestamp: new Date(),
        sender: "other",
        senderName: "サポート",
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, responseMessage],
      }));
    }, 1000);
  };

  return (
    <div className="main_gradient_bg">
      <div className="h-screen flex">
        {/* Sidebar */}
        <ChatSidebar
          chatRooms={chatRooms}
          selectedRoom={chatState.selectedRoom}
          onRoomSelect={handleRoomSelect}
          onNewRoom={handleNewRoom}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {chatState.selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="glass-card mx-4 mt-4 p-4">
                <h2 className="text-lg font-semibold text-white">
                  {chatState.selectedRoom.title}
                </h2>
                <p className="text-sm text-white/60">
                  最後の活動:{" "}
                  {chatState.selectedRoom.lastActivity.toLocaleString("ja-JP")}
                </p>
              </div>

              {/* Messages */}
              <MessageList messages={chatState.messages} />

              {/* Input */}
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            /* No Room Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white/60">
                <div className="text-6xl mb-6">💬</div>
                <h2 className="text-2xl font-semibold mb-4">
                  チャットルームを選択してください
                </h2>
                <p className="text-lg">
                  左側からチャットルームを選択するか、新しいルームを作成してください
                </p>
              </div>
            </div>
          )}
        </div>

        {/* New Room Modal */}
        <NewRoomModal
          isOpen={chatState.showNewRoomModal}
          onClose={handleCloseModal}
          onSubmit={handleCreateRoom}
        />
      </div>
    </div>
  );
};

export default ChatMain;
