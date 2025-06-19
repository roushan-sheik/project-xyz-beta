import { LoginRequest, userApiClient } from "../userAPIClient";
import { USER_QUERY_KEYS } from "./keys";

export const USER_QUERIES = {
  loginUser: (credentials: LoginRequest) => ({
    mutationKey: USER_QUERY_KEYS.login(),
    mutationFn: () => userApiClient.userLogin(credentials),
  }),
};
