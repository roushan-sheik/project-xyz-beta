import { Photo } from "@/infrastructure/gallery/utils/types";

const PhotoCard: React.FC<{
  photo: any;
  onDelete: (photoId: number | string) => void;
}> = ({ photo, onDelete }) => (
  <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg">
    <div className="aspect-square overflow-hidden">
      <img
        src={photo.url}
        alt={photo.title || "アリバイ写真"}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
    </div>
    <div className="p-3">
      <p className="mb-1 truncate text-sm text-gray-800">
        {photo.title || "タイトルなし"}
      </p>
      <p className="text-xs text-gray-500">
        {new Date(photo.created_at).toLocaleDateString("ja-JP")}
      </p>
      <div className="mt-2 flex justify-end space-x-2">
        <button
          onClick={() => onDelete(photo.id)}
          className="text-gray-600 hover:text-red-500"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
);

export default PhotoCard;
