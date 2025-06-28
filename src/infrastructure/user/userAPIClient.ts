import { GalleryResponse } from "../gallery/utils/types";
import {
  LoginResponse,
  UserPhotoEditRequest,
  UserPhotoEditRequestResponse,
  UserVideoAudioEditRequest,
  UserVideoAudioEditRequestResponse,
  UserSouvenirRequestResponse,
} from "./utils/types";
import { baseUrl } from "@/constants/baseApi";

export interface LoginRequest {
  email: string;
  password: string;
}

class UserAPIClient {
  private readonly apiUrl = baseUrl;

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken"); // or from cookies
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
  public async userRegister(registerData: {
    email: string;
    password: string;
    confirm_password: string;
  }): Promise<{ detail: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      return data; // { detail: "User registered successfully" }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  public async userLogin(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/users/login`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Login failed`);
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  public async getUserProfile(): Promise<{ email: string; kind: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/users/profile`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  }

  public async userPhotoEditRequests(
    formData: FormData
  ): Promise<UserPhotoEditRequestResponse> {
    try {
      const response = await fetch(
        `${this.apiUrl}/gallery/photo-edit-requests`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            ...(localStorage.getItem("accessToken") && {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to photo edit request`);
      }

      return await response.json();
    } catch (error) {
      console.error("Photo request fetch error:", error);
      throw error;
    }
  }

  public async userVideoAndAudioRequests(
    bodyData: UserVideoAudioEditRequest
  ): Promise<UserVideoAudioEditRequestResponse> {
    try {
      const response = await fetch(
        `${this.apiUrl}/gallery/video-audio-edit-requests`, // Assuming this is the correct endpoint
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Failed to video/audio edit request`
        );
      }

      const data: UserVideoAudioEditRequestResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Video/audio request fetch error:", error);
      throw error;
    }
  }

  public async getUserVideoAudioEditRequests(): Promise<
    UserVideoAudioEditRequestResponse[]
  > {
    try {
      const response = await fetch(
        `${this.apiUrl}/gallery/video-audio-edit-requests`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Failed to fetch video/audio edit requests`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Video/audio request list fetch error:", error);
      throw error;
    }
  }

  public async getUserPhotoEditRequests(): Promise<
    UserPhotoEditRequestResponse[]
  > {
    try {
      const response = await fetch(
        `${this.apiUrl}/gallery/photo-edit-requests`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Failed to fetch photo edit requests`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Photo edit request list fetch error:", error);
      throw error;
    }
  }

  public async getGalleryPhotos(): Promise<GalleryResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/gallery`, {
        method: "GET",
        headers: this.getHeaders(), // Assumes Authorization or other headers are set here
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch gallery data");
      }

      const data: GalleryResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Gallery fetch error:", error);
      throw error;
    }
  }

  public async getUserSouvenirRequests(): Promise<
    UserSouvenirRequestResponse[]
  > {
    try {
      const response = await fetch(`${this.apiUrl}/gallery/souvenir-requests`, {
        method: "GET",
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Failed to fetch souvenir requests`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Souvenir request list fetch error:", error);
      throw error;
    }
  }
  async verifyOtp(data: { otp: string }): Promise<{ detail: string }> {
    const response = await fetch(`${this.apiUrl}/users/verify-otp`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const userApiClient = new UserAPIClient();
