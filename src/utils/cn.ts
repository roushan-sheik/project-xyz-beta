// utils/cn.ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to merge Tailwind CSS classes with conditional logic.
 * Combines `clsx` for conditional classNames and `tailwind-merge` for conflict resolution.
 *
 * @param inputs - Accepts any number of class names, conditionally applied.
 * @returns A merged class string ready for use in JSX `className` attributes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
