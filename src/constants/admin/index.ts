import { DashboardCardProps, NavItem } from "@/types/admin/types";

export const navItems: NavItem[] = [
  { id: "1", label: "ユーザー管理", href: "/admin/users", icon: "Users" },
  {
    id: "2",
    label: "アリバイ写真DL管理",
    href: "/admin/photo-albums",
    icon: "Image",
  },
  {
    id: "3",
    label: "アリバイ加工依頼一覧",
    href: "/admin/photo-edit-requests",
    icon: "Settings",
  },
  {
    id: "4",
    label: "アリバイ動画音声依頼一覧",
    href: "/admin/video-requests",
    icon: "PlayCircle",
  },
  {
    id: "5",
    label: "アリバイLINE依頼一覧",
    href: "/admin/line-requests",
    icon: "MessageSquare",
  },
  {
    id: "6",
    label: "アリバイ相談チャット一覧",
    href: "/admin/chat-history",
    icon: "MessageCircle",
  },
  {
    id: "7",
    label: "アリバイお土産依頼一覧",
    href: "/admin/souvenir-requests",
    icon: "Gift",
  },
  {
    id: "8",
    label: "ダミー請求依頼一覧",
    href: "/admin/invoice-requests",
    icon: "FileText",
  },
];

export const dashboardCards: DashboardCardProps[] = [
  { id: "card1", label: "ユーザー管理", icon: "Users", href: "/admin/users" },
  {
    id: "card2",
    label: "アリバイ写真DL管理",
    icon: "Image",
    href: "/admin/photo-albums",
  },
  {
    id: "card3",
    label: "アリバイ加工依頼一覧",
    icon: "Settings",
    href: "/admin/photo-edit-requests",
  },
  {
    id: "card4",
    label: "アリバイ動画音声依頼一覧",
    icon: "PlayCircle",
    href: "/admin/video-requests",
  },
  {
    id: "card5",
    label: "アリバイLINE依頼一覧",
    icon: "MessageSquare",
    href: "/admin/line-requests",
  },
  {
    id: "card6",
    label: "アリバイ相談チャット一覧",
    icon: "MessageCircle",
    href: "/admin/chat-history",
  },
  {
    id: "card7",
    label: "アリバイお土産依頼一覧",
    icon: "Gift",
    href: "/admin/souvenir-requests",
  },
  {
    id: "card8",
    label: "ダミー請求依頼一覧",
    icon: "FileText",
    href: "/admin/invoice-requests",
  },
];
