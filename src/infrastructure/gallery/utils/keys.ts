// src/api/gallery/queries/keys.ts
export const GALLERY_QUERY_KEYS = {
  default: () => ["gallery"] as const,
  photos: (category?: string) =>
    [...GALLERY_QUERY_KEYS.default(), "photos", category] as const,
  upload: () => [...GALLERY_QUERY_KEYS.default(), "upload"] as const,
  delete: (photoId: number | string) =>
    [...GALLERY_QUERY_KEYS.default(), "delete", photoId] as const,
};
