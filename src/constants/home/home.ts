import { MenuItem } from "@/types/home/types";

export const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "アリバイ写真DL",
    description: "高品質なアリバイ写真をダウンロード",
    icon: "fa-regular fa-images",
    path: "/alibi-photos",
  },
  {
    id: 2,
    title: "アリバイ写真加工",
    description: "プロフェッショナルな写真加工サービス",
    icon: "fa-regular fa-image",
    path: "/photo-edit",
  },
  {
    id: 3,
    title: "アリバイ動画音声",
    description: "リアルで説得力のある動画・音声制作",
    icon: "fa-regular fa-video",
    path: "/alibi-video",
  },
  {
    id: 4,
    title: "アリバイLINE",
    description: "安全で信頼性の高いメッセージング",
    icon: "fa-regular fa-comment",
    path: "/alibi-line",
  },
  {
    id: 5,
    title: "アリバイ相談",
    description: "専門家による個別カウンセリング",
    icon: "fa-regular fa-comments",
    path: "/chat",
  },
  {
    id: 6,
    title: "アリバイお土産",
    description: "リアルな証拠品の制作サービス",
    icon: "fa-regular fa-gift",
    path: "/alibi-souvenir",
  },
  {
    id: 7,
    title: "ダミー請求書",
    description: "完璧な書類作成サービス",
    icon: "fa-regular fa-file-lines",
    path: "/dummy-invoice",
  },
];
