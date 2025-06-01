import { MenuItem } from "@/types/dashboard/types";

export const MENU_ITEMS: MenuItem[] = [
  // User Menu Items
  {
    id: "home",
    label: "Home",
    icon: "Home",
    path: "/dashboard",
    roles: ["user", "admin"],
  },
  {
    id: "photo-dl",
    label: "Photo Download",
    icon: "Download",
    path: "/photo-download",
    roles: ["user"],
  },
  {
    id: "photo-edit-request",
    label: "Photo Edit Request",
    icon: "FileEdit",
    path: "/photo-edit-request",
    roles: ["user"],
  },
  {
    id: "video-edit-request",
    label: "Video Edit Request",
    icon: "Video",
    path: "/video-edit-request",
    roles: ["user"],
  },
  {
    id: "text-request",
    label: "Text Request",
    icon: "FileText",
    path: "/text-request",
    roles: ["user"],
  },
  {
    id: "chat",
    label: "Chat",
    icon: "MessageCircle",
    path: "/chat",
    roles: ["user", "admin"],
  },
  {
    id: "gift",
    label: "Gift Orders",
    icon: "Gift",
    path: "/gift",
    roles: ["user"],
  },
  {
    id: "pdf-request",
    label: "PDF Request",
    icon: "FileImage",
    path: "/pdf-request",
    roles: ["user"],
  },

  // Admin Menu Items
  {
    id: "photo-management",
    label: "Photo Management",
    icon: "Upload",
    path: "/admin/photo-management",
    roles: ["admin"],
  },
  {
    id: "photo-edit-manage",
    label: "Photo Edit Requests",
    icon: "FileEdit",
    path: "/admin/photo-edit-manage",
    roles: ["admin"],
    badge: 5,
  },
  {
    id: "video-edit-manage",
    label: "Video Edit Requests",
    icon: "Video",
    path: "/admin/video-edit-manage",
    roles: ["admin"],
    badge: 3,
  },
  {
    id: "text-manage",
    label: "Text Requests",
    icon: "FileText",
    path: "/admin/text-manage",
    roles: ["admin"],
    badge: 2,
  },
  {
    id: "pdf-manage",
    label: "PDF Requests",
    icon: "FileImage",
    path: "/admin/pdf-manage",
    roles: ["admin"],
  },
  {
    id: "user-management",
    label: "User Management",
    icon: "Users",
    path: "/admin/users",
    roles: ["admin"],
  },
  {
    id: "payment-management",
    label: "Payment Management",
    icon: "CreditCard",
    path: "/admin/payments",
    roles: ["admin"],
  },
  {
    id: "gift-manage",
    label: "Gift Management",
    icon: "Gift",
    path: "/admin/gift-manage",
    roles: ["admin"],
  },
];

export const MOCK_USERS = {
  user: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user" as const,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  admin: {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as const,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
};
