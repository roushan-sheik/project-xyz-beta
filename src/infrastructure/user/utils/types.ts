export type LoginResponse = {
  user: {
    email: string;
    kind: "UNDEFINED" | string;
  };
  refresh: string;
  access: string;
};

export type RegisterResponse = {
  detail: string;
};

export type AuthResponse = LoginResponse | RegisterResponse;

export type UserPhotoEditRequest = {
  description: string;
  special_note: string;
  desire_delivery_date: string;
  request_files: string[];
};

export type UserPhotoEditRequestResponse = {
  uid: string; // UUID format
  description: string;
  special_note: string;
  request_status: "pending" | "approved" | "rejected"; // assuming enum, adjust if needed
  desire_delivery_date: string; // ISO date string
};

export interface UserVideoAudioEditRequest {
  title: string;
  description: string;
  special_note?: string; // Corresponds to `additionalNotes`
  desire_delivery_date: string; // ISO 8601 string, corresponds to `dueDate`
  edit_type:
    | "photo_editing"
    | "video_editing"
    | "audio_editing"
    | "video_audio_editing"
    | "other"; // Mapping `editType`
  request_files: string[]; // Array of file URLs/IDs (for video/audio files)
}

export interface UserVideoAudioEditRequestResponse {
  uid: string;
  title: string;
  description: string;
  special_note?: string;
  request_status: string;
  desire_delivery_date: string; // ISO 8601 string
}

// types for gallery=======================
export interface GalleryItem {
  uid: string;
  title: string;
  code: string;
  description: string;
  file_type: string; // "image", "video", etc.
  file: string;
}

export interface GalleryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GalleryItem[];
}

export interface UserSouvenirRequestResponse {
  uid: string;
  description: string;
  special_note: string;
  request_status: "pending" | "approved" | "rejected";
  desire_delivery_date: string;
  quantity: number;
  media_files: GalleryItem[];
}
