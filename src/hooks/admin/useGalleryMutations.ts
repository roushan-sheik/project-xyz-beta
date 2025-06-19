import { galleryAPIClient } from "@/infrastructure/gallery/galleryAPIClient";
import { GALLERY_QUERY_KEYS } from "@/infrastructure/gallery/utils/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreatePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryAPIClient.createPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GALLERY_QUERY_KEYS.default(),
      });
      toast.success("写真をアップロードしました");
    },
    onError: (error: Error) => {
      toast.error(error.message || "アップロードに失敗しました");
    },
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryAPIClient.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GALLERY_QUERY_KEYS.default(),
      });
      toast.success("写真を削除しました");
    },
    onError: (error: Error) => {
      toast.error(error.message || "削除に失敗しました");
    },
  });
};
