// Reusable Button Component
const Button: React.FC<{
  variant?: "primary" | "secondary" | "danger";
  leftIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}> = ({
  variant = "primary",
  leftIcon,
  className = "",
  disabled,
  children,
  onClick,
  type = "button",
}) => {
  const baseClasses =
    "flex items-center gap-2 px-4 lg:py-3 py-2  rounded-lg font-medium transition-colors disabled:opacity-50";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {leftIcon}
      {children}
    </button>
  );
};
export default Button;
