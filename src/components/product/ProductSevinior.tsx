import React from "react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

const ProductSevinior: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  selected,
  onSelect,
}) => {
  return (
    <div
      className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
        selected ? "ring-2 ring-blue-400" : ""
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800/30">
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-white font-medium mb-2 text-sm">{title}</h3>
      <p className="text-gray-300 text-sm">¥{price.toLocaleString()}</p>
    </div>
  );
};

export default ProductSevinior;
