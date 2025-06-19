// src/api/gallery/utils/types.ts
export interface GalleryUploadRequest {
  title: string;
  description: string;
  file_type: "image";
  file: File;
}

export interface GalleryUploadResponse {
  id: number | string;
  url: string;
  title: string;
  description: string;
  file_type: string;
  created_at: string;
  category?: string;
  message?: string;
}

export interface GalleryPhoto {
  id: number | string;
  url: string;
  title?: string;
  description?: string;
  created_at: string;
  category?: string;
  file_type?: string;
}

export interface GalleryPhotosResponse {
  photos: GalleryPhoto[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface GalleryDeleteResponse {
  message: string;
  success: boolean;
}
