import { DashboardCardProps, NavItem } from "@/types/admin/types";

export const navItems: NavItem[] = [
  { id: "1", label: "ユーザー管理", href: "/users", icon: "Users" },
  { id: "2", label: "アリバイ写真DL管理", href: "/photo-dl", icon: "Image" },
  {
    id: "3",
    label: "アリバイ加工依頼一覧",
    href: "/process-requests",
    icon: "Settings",
  },
  {
    id: "4",
    label: "アリバイ動画音声依頼一覧",
    href: "/video-audio-requests",
    icon: "PlayCircle",
  },
  {
    id: "5",
    label: "アリバイLINE依頼一覧",
    href: "/line-requests",
    icon: "MessageSquare",
  },
  {
    id: "6",
    label: "アリバイ相談チャット一覧",
    href: "/chat-consultations",
    icon: "MessageCircle",
  },
  {
    id: "7",
    label: "アリバイお土産依頼一覧",
    href: "/souvenir-requests",
    icon: "Gift",
  },
  {
    id: "8",
    label: "ダミー請求依頼一覧",
    href: "/dummy-requests",
    icon: "FileText",
  },
];

export const dashboardCards: DashboardCardProps[] = [
  { id: "card1", label: "ユーザー管理", icon: "Users" },
  { id: "card2", label: "アリバイ写真DL管理", icon: "Image" },
  { id: "card3", label: "アリバイ加工依頼一覧", icon: "Settings" },
  { id: "card4", label: "アリバイ動画音声依頼一覧", icon: "PlayCircle" },
  { id: "card5", label: "アリバイLINE依頼一覧", icon: "MessageSquare" },
  { id: "card6", label: "アリバイ相談チャット一覧", icon: "MessageCircle" },
  { id: "card7", label: "アリバイお土産依頼一覧", icon: "Gift" },
  { id: "card8", label: "ダミー請求依頼一覧", icon: "FileText" },
];
