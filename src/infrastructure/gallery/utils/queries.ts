// src/api/gallery/queries/queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryAPIClient } from "../galleryAPIClient";
import { GALLERY_QUERY_KEYS } from "./keys";
import { GalleryUploadRequest } from "../utils/types";

export const GALLERY_QUERIES = {
  getPhotos: (category?: string) => ({
    queryKey: GALLERY_QUERY_KEYS.photos(category),
    queryFn: () => galleryAPIClient.getPhotos(category),
  }),
};

// Custom hooks for mutations
export const useUploadPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GalleryUploadRequest) =>
      galleryAPIClient.uploadPhoto(data),
    onSuccess: () => {
      // Invalidate and refetch photos queries
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.default() });
    },
    onError: (error) => {
      console.error("Upload mutation error:", error);
    },
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: number | string) =>
      galleryAPIClient.deletePhoto(photoId),
    onSuccess: () => {
      // Invalidate and refetch photos queries
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.default() });
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
    },
  });
};

export const usePhotos = (category?: string) => {
  return useQuery(GALLERY_QUERIES.getPhotos(category));
};
