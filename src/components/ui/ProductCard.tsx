import React from "react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  title: string;
  file: string;
  file_type: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  file,
  file_type,
  selected,
  onSelect,
}) => {
  const getProxiedUrl = (url: string) =>
    `/api/image-proxy?url=${encodeURIComponent(url)}`;

  return (
    <div
      className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
        selected ? "ring-2 ring-blue-400" : ""
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800/30">
        {file_type === "image" ? (
          <Image
            src={getProxiedUrl(file)}
            alt={title}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <video controls className="w-full h-full object-cover">
            <source src={file} />
            Your browser does not support video.
          </video>
        )}
      </div>
      <h3 className="text-white font-medium mb-2 text-sm">{title}</h3>
    </div>
  );
};

export default ProductCard;
