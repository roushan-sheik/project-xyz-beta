import { MenuItem } from "@/types/home/types";

interface CartProps {
  item: MenuItem;
}

const Cart = ({ item }: CartProps) => {
  return (
    <div
      className="glass-card p-4  lg:py-6 lg:px-4 cursor-pointer animate-glass-fade"
      style={{ animationDelay: `${item.id * 0.1}s` }}
    >
      {/* circle   */}
      <div className="glass w-4 h-4 rounded-full"></div>
      <div className="text-center ">
        {/* Title */}
        <h3 className="text-white text-heading2 font-medium">{item.title}</h3>

        {/* Description */}
        <p className="text-body2 text-white/70 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default Cart;
