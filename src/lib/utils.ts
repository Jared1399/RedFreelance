import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface QueryParams {
  [key: string]: string | number | undefined;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function queryBuilder(queryParams: QueryParams) {
  const query = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value ?? "")}`)
    .join("&");

  return `?${query}`;
}

export function capitalizeFirst(s: string) {
  const firstChar = s.charAt(0).toUpperCase();

  const restOfString = s.slice(1);

  return firstChar + restOfString;
}