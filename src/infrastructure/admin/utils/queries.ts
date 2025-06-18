import { productAPIClient } from "../adminAPIClient";
import { ADMIN_USERS_QUERY_KEYS } from "./keys";

export const PRODUCT_QUERIES = {
  getAdminUsers: {
    queryKey: ADMIN_USERS_QUERY_KEYS.list(),
    queryFn: productAPIClient.getAdminUsers,
  },
};
