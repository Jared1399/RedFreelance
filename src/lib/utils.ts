import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isValidValue(value: string | number | boolean | undefined | null): boolean {
  return value !== undefined && value !== null && value !== "" && value !== false;
}

export function queryBuilder(
  queryParams: Record<string, string | number | boolean | undefined | null>
) {
  const query = Object.entries(queryParams)
    .filter(([, value]) => isValidValue(value))
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  return query ? `?${query}` : "";
}

export function capitalizeFirst(s: string) {
  const firstChar = s.charAt(0).toUpperCase();

  const restOfString = s.slice(1);

  return firstChar + restOfString;
}