export type User = {
  id?: string;
  name?: string;
  role?: string;
  avatar?: string;
  email: string;
  kind: "ADMIN" | "USER" | "UNDEFINED" | string;
};
