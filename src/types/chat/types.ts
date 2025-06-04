export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: "user" | "other";
  senderName?: string;
}

export interface ChatRoom {
  id: string;
  title: string;
  lastMessage?: string;
  lastActivity: Date;
  unreadCount?: number;
}

export interface ChatState {
  selectedRoom: ChatRoom | null;
  showNewRoomModal: boolean;
  messages: Message[];
}
