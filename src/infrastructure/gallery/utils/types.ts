export type Photo = {
  uid: string;
  title: string;
  code: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  file_type: "image";
  file: string;
  created_at?: string;
};

export type GalleryResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Photo[];
};

export type CreatePhotoRequest = {
  title: string;
  description: string;
  file_type: "image";
  file: string; // Base64 encoded file
};
