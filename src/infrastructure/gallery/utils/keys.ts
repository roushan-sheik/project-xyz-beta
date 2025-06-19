export const GALLERY_QUERY_KEYS = {
  default: () => ["gallery"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...GALLERY_QUERY_KEYS.default(), "list", params] as const,
  detail: (uid: string) =>
    [...GALLERY_QUERY_KEYS.default(), "detail", uid] as const,
};
