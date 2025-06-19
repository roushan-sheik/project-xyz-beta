import delay from "@/utils/function/delay";
import { mockUsers } from "./mockUsers";
import { AdminUsersResponse } from "./utils/types";

class AdminAPIClient {
  private readonly headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  private readonly apiUrl = "http://localhost:3000";

  public async getAdminUsers(): Promise<AdminUsersResponse> {
    await delay(1000);
    return mockUsers;
  }
}

export const productAPIClient = new AdminAPIClient();
