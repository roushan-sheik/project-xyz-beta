import { LoginResponse, UserPhotoEditRequestResponse } from "./utils/types";
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

  public async userPhotoEditRequests(): Promise<UserPhotoEditRequestResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/photo-edit-request`, {
        method: "GET",
        headers: this.getHeaders(), // ✅ uses token automatically
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to fetch request`);
      }

      const data: UserPhotoEditRequestResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Photo request fetch error:", error);
      throw error;
    }
  }
}

export const userApiClient = new UserAPIClient();
