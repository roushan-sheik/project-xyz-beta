export const USER_QUERY_KEYS = {
  default: () => ["user"] as const,

  list: (params?: string) =>
    [...USER_QUERY_KEYS.default(), "list", params] as const,

  login: () => [...USER_QUERY_KEYS.default(), "login"] as const,
};
