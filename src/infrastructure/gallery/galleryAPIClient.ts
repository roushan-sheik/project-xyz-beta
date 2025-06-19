// src/api/gallery/galleryAPIClient.ts
import delay from "@/utils/function/delay";
import {
  GalleryUploadRequest,
  GalleryUploadResponse,
  GalleryPhoto,
} from "./utils/types";

class GalleryAPIClient {
  private readonly headers: HeadersInit = {
    Accept: "application/json",
  };

  private readonly apiUrl = "http://13.208.176.127:8000";

  public async uploadPhoto(
    data: GalleryUploadRequest
  ): Promise<GalleryUploadResponse> {
    try {
      console.log("🚀 Upload starting with data:", {
        title: data.title,
        description: data.description,
        file_type: data.file_type,
        fileName: data.file.name,
        fileSize: data.file.size,
        fileType: data.file.type,
      });

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("file_type", data.file_type);
      formData.append("file", data.file);

      console.log("📝 FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("🌐 Making request to:", `${this.apiUrl}/gallery/admin`);

      const response = await fetch(`${this.apiUrl}/gallery/admin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error body:", errorText);
        throw new Error(
          `Failed to upload photo: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("✅ Upload successful:", result);
      return result;
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    }
  }

  public async getPhotos(category?: string): Promise<GalleryPhoto[]> {
    try {
      await delay(500); // Optional delay for UX

      const url = new URL(`${this.apiUrl}/gallery/photos`);
      if (category && category !== "all") {
        url.searchParams.append("category", category);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch photos: ${response.statusText}`);
      }

      const result = await response.json();
      return result.photos || [];
    } catch (error) {
      console.error("Fetch photos error:", error);
      throw error;
    }
  }

  public async deletePhoto(photoId: number | string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/gallery/admin/${photoId}`, {
        method: "DELETE",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete photo: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Delete photo error:", error);
      throw error;
    }
  }
}

export const galleryAPIClient = new GalleryAPIClient();
