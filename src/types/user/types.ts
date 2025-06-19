export type User = {
  email: string;
  kind: "ADMIN" | "USER" | "UNDEFINED" | string;
};
