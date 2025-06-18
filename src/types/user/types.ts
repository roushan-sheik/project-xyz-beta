export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
};
