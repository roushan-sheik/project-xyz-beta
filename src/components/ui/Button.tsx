import React, { ButtonHTMLAttributes, forwardRef } from "react";

// Utility function for className merging (replace with your own implementation)
const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// Define variant types
export type ButtonVariant =
  | "primary"
  | "glassSec"
  | "glass"
  | "glassBrand"
  | "outline"
  | "ghost"
  | "dark";

export type ButtonSize = "sm" | "default" | "md" | "lg" | "xl" | "icon";

export type ButtonGlass = "none" | "light" | "medium" | "heavy";

// Props interface extending HTML button attributes
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: React.ReactNode;
  /** Button variant style */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Glass effect intensity */
  glass?: ButtonGlass;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Apply glow effect on hover */
  glow?: boolean;
}

// Base button classes
const baseClasses = [
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
  "transition-all duration-300 ease-in-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50",
  "relative overflow-hidden",
  "backdrop-blur-xl border border-white/20",
  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
  "before:translate-x-[-100%] before:transition-transform before:duration-700",
  "hover:before:translate-x-[100%]",
  "active:scale-[0.98]",
].join(" ");

// Variant classes
const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-700)]",
    "text-white shadow-lg shadow-[var(--color-brand-500)]/25",
    "hover:shadow-xl hover:shadow-[var(--color-brand-500)]/40",
    "hover:from-[var(--color-brand-400)] hover:to-[var(--color-brand-600)]",
    "cursor-pointer",
  ].join(" "),
  glassSec: [
    "bg-gradient-to-r from-sky-200/10 to-sky-400/10",
    "text-white border-sky-300/20",
    "hover:from-sky-300/20 hover:to-sky-500/20",
    "shadow-lg shadow-sky-300/20",
    "cursor-pointer",
  ].join(" "),
  glass: [
    "bg-gradient-to-r from-white/10 to-white/5",
    "text-white border-white/30",
    "hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10",
    "shadow-lg shadow-black/10",
    "cursor-pointer",
  ].join(" "),
  glassBrand: [
    "bg-gradient-to-r from-[var(--color-brand-500)]/20 to-[var(--color-brand-700)]/10 ",
    "text-white border-[var(--color-brand-400)]/30",
    "hover:from-[var(--color-brand-500)]/30 hover:to-[var(--color-brand-700)]/20",
    "shadow-lg shadow-[var(--color-brand-500)]/20",
    "cursor-pointer",
  ].join(" "),
  outline: [
    "bg-transparent border-2 border-white/40",
    "text-white",
    "hover:bg-white/10 hover:border-white/60",
    "shadow-lg shadow-black/10",
    "cursor-pointer",
  ].join(" "),
  ghost: [
    "bg-transparent border-transparent",
    "text-white",
    "hover:bg-white/10 hover:border-white/20",
    "cursor-pointer",
  ].join(" "),
  dark: [
    "bg-gradient-to-r from-black/40 to-black/20",
    "text-white border-white/20",
    "hover:from-black/50 hover:to-black/30",
    "shadow-lg shadow-black/20",
    "cursor-pointer",
  ].join(" "),
};

// Size classes
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-6 px-3 text-xs",
  default: "h-12 px-3 py-3",
  md: "h-11 px-6 text-base",
  lg: "h-12 px-8 text-lg",
  xl: "h-14 px-10 text-xl",
  icon: "h-10 w-10 p-0",
};

// Glass effect classes
const glassClasses: Record<ButtonGlass, string> = {
  none: "",
  light: "backdrop-blur-sm",
  medium: "backdrop-blur-md",
  heavy: "backdrop-blur-xl",
};

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Get button classes based on props
const getButtonClasses = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "default",
  glass: ButtonGlass = "medium",
  glow: boolean = false,
  className?: string
): string => {
  return cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    glassClasses[glass],
    glow && "hover:shadow-2xl hover:shadow-current/20",
    className
  );
};

// Forward ref for better component composition
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      glass = "medium",
      children,
      loading = false,
      leftIcon,
      rightIcon,
      glow = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonClasses = getButtonClasses(
      variant,
      size,
      glass,
      glow,
      className
    );

    return (
      <button
        className={cn(buttonClasses, "")}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Left icon or loading spinner */}
        {loading ? (
          <LoadingSpinner />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}

        {/* Button text */}
        <span className={cn(loading && "opacity-70")}>{children}</span>

        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}

        {/* Glassmorphism shine effect */}
        <div className="absolute  inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      </button>
    );
  }
);

Button.displayName = "Button";

// Default export
export default Button;

/* 
Usage Examples:

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="glass" size="lg">Glass Button</Button>
<Button variant="glassBrand" glow>Brand Glass</Button>

// With icons
<Button leftIcon={<YourIcon />}>With Left Icon</Button>
<Button rightIcon={<ArrowIcon />}>With Right Icon</Button>

// Loading state
<Button loading>Loading...</Button>

// Custom styling
<Button 
  className="custom-class" 
  variant="outline"
  size="md"
  glass="heavy"
>
  Custom Button
</Button>

// All props example
<Button
  variant="glassBrand"
  size="lg"
  glass="medium"
  glow
  loading={false}
  leftIcon={<SomeIcon />}
  rightIcon={<AnotherIcon />}
  onClick={() => console.log('clicked')}
  disabled={false}
  className="my-custom-class"
>
  Complete Example
</Button>
*/
