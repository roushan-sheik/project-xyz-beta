import { galleryAPIClient } from "../galleryAPIClient";
import { GALLERY_QUERY_KEYS } from "./keys";

export const GALLERY_QUERIES = {
  getPhotos: (page = 1, limit = 20) => ({
    queryKey: GALLERY_QUERY_KEYS.list({ page, limit }),
    queryFn: () => galleryAPIClient.getPhotos(page, limit),
  }),
};
