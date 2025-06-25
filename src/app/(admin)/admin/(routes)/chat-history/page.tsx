"use client";
import Button from "@/components/admin/ui/Button";
import React, { useEffect, useState, ChangeEvent, FormEvent, FC } from "react";

interface ChatRoom {
  id: string | number;
  customer_name: string;
  last_message_at: string;
}

interface ChatMessage {
  id: string | number;
  content: string;
  created_at: string;
  is_admin: boolean;
}

const MainComponent: FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  const fetchChatRooms = async () => {
    try {
      const response = await fetch("/api/admin/chat-rooms");
      if (!response.ok) throw new Error("チャットルームの取得に失敗しました");
      const data = await response.json();
      setChatRooms(data.rooms || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "チャットルーム読み込みエラー");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string | number) => {
    try {
      const response = await fetch(`/api/admin/chat-messages/${roomId}`);
      if (!response.ok) throw new Error("メッセージの取得に失敗しました");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "メッセージ読み込みエラー");
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filtered = chatRooms.filter(
      (room) =>
        room.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.id.toString().includes(searchTerm)
    );
    setChatRooms(filtered);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-gray-200 bg-white px-4 py-3 md:px-6">
        <h1 className="text-xl font-medium text-gray-800 md:text-2xl">
          チャット履歴管理
        </h1>
      </header>

      <main className="flex flex-col md:flex-row flex-1 h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="p-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="ユーザー名、ルームIDで検索..."
                className="rounded-lg border border-gray-300 px-4 py-2 w-full"
              />
              <Button type="submit" className="w-full sm:w-auto">
                検索
              </Button>
            </form>
          </div>

          <div className="h-[300px] md:h-full overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-gray-600">読み込み中...</div>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {chatRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full rounded-lg p-3 text-left transition-colors ${
                      selectedRoom?.id === room.id
                        ? "bg-[#357AFF] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{room.customer_name}</span>
                      <span className="text-sm opacity-80">
                        {new Date(room.last_message_at).toLocaleDateString(
                          "ja-JP"
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-sm opacity-80">ID: {room.id}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1">
          {selectedRoom ? (
            <div className="flex h-full flex-col">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-medium text-gray-800">
                  {selectedRoom.customer_name} とのチャット
                </h2>
                <p className="text-sm text-gray-600">
                  ルームID: {selectedRoom.id}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.is_admin ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        message.is_admin
                          ? "bg-[#357AFF] text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="mt-1 text-right text-xs opacity-60">
                        {new Date(message.created_at).toLocaleString("ja-JP")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-gray-500 p-6">
              左側のリストからチャットルームを選択してください
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainComponent;
