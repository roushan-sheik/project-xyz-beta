export const ADMIN_USERS_QUERY_KEYS = {
  default: () => ["admin"] as const,
  list: (params?: string) =>
    [...ADMIN_USERS_QUERY_KEYS.default(), "list", params] as const,
};
