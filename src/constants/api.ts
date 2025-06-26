import { baseUrl } from "./baseApi";

// constants/api.ts
export const BASE_URL = baseUrl;
// For development, you might want to use localhost
// export const BASE_URL = "http://127.0.0.1:8000";

// constants/role.ts
// export const user_role = {
//   USER: "user",
//   SUPER_ADMIN: "super_admin",
// } as const;

// types/subscription.ts
export interface User {
  id: number;
  email: string;
  kind: string;
  // Add other user properties as needed
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}
