import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currencyFormatter(num: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "AUD",
  }).format(num);
}
