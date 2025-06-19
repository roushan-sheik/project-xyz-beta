import delay from "@/utils/function/delay";
import { CreatePhotoRequest, GalleryResponse, Photo } from "./utils/types";

class GalleryAPIClient {
  private readonly baseURL = "http://13.208.176.127:8000";
  private authToken: string | null = null;

  private get headers(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
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

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

  public async createPhoto(data: {
    title: string;
    description: string;
    file: File;
  }): Promise<Photo> {
    try {
      const base64File = await this.fileToBase64(data.file);

      const requestBody: CreatePhotoRequest = {
        title: data.title,
        description: data.description || "",
        file_type: "image",
        file: base64File,
      };

      const response = await fetch(`${this.baseURL}/gallery/admin`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(requestBody),
      });

      return await this.handleResponse<Photo>(response);
    } catch (error) {
      console.error("Failed to create photo:", error);
      throw error;
    }
  }

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
