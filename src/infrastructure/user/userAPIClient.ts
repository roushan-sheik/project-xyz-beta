// http://13.208.176.127:8000/users/login

import { LoginResponse } from "./utils/types";

export interface LoginRequest {
  email: string;
  password: string;
}

class UserAPIClient {
  private readonly headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  private readonly apiUrl = "http://13.208.176.127:8000";

  public async userLogin(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/users/login`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Login failed with status: ${response.status}`
        );
      }
      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error during user login:", error);
      throw error;
    }
  }
}

export const userApiClient = new UserAPIClient();
