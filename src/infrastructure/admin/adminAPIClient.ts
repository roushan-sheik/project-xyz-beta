import delay from "@/utils/function/delay";

import { AdminUsersResponse } from "./utils/types";

class AdminAPIClient {
  private readonly headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  private readonly apiUrl = "http://localhost:3000";

  public async getAdminUsers(): Promise<AdminUsersResponse> {
    await delay(1000);
    return [
      {
        email: "test@gmail.com",
        kind: "Admin",
      },
    ];
  }
}

export const productAPIClient = new AdminAPIClient();
