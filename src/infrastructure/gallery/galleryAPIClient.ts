import { GalleryResponse, Photo } from "./utils/types";
import { baseUrl } from "@/constants/baseApi";

class GalleryAPIClient {
  private readonly baseURL = baseUrl;
  private authToken: string | null = null;

  private get headers(): HeadersInit {
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  public setAuthToken(token: string) {
    this.authToken = token;
  }

  public clearAuthToken() {
    this.authToken = null;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("認証が必要です。ログインしてください。");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    return response.json();
  }

  public async getPhotos(page = 1, limit = 20): Promise<GalleryResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/gallery/admin?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: this.headers,
        }
      );

      return await this.handleResponse<GalleryResponse>(response);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
      throw error;
    }
  }

  public createPhoto = async (data: {
    title: string;
    description: string;
    file: File;
  }): Promise<Photo> => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("file_type", "image");
      formData.append("file", data.file);

      // Create a copy of the base headers
      const requestHeaders: HeadersInit = { ...this.headers };

      // Cast to Record<string, any> to allow indexing with a string literal for deletion
      delete (requestHeaders as Record<string, any>)["Content-Type"];

      const response = await fetch(`${this.baseURL}/gallery/admin`, {
        method: "POST",
        headers: requestHeaders,
        body: formData,
      });

      return await this.handleResponse<Photo>(response);
    } catch (error) {
      console.error("Failed to create photo:", error);
      throw error;
    }
  };

  public async deletePhoto(uid: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/gallery/admin/${uid}`, {
        method: "DELETE",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete photo: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
      throw error;
    }
  }
}

export const galleryAPIClient = new GalleryAPIClient();
