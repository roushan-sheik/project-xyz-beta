// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    role: "user" | "admin"
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: ("user" | "admin")[];
  badge?: number;
}
