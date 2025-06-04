import { z } from "zod";

export const chatRoomSchema = z.object({
  title: z.string().min(1, "チャットルームのタイトルを入力してください"),
});

export const messageSchema = z.object({
  message: z.string().min(1, "メッセージを入力してください"),
});

export type ChatRoomFormData = z.infer<typeof chatRoomSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;

export default chatRoomSchema;
