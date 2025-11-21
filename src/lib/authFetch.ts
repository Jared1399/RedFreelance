const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const getSystemApiKey = () => {
  return process.env.ALLOWED_KEYS?.split(",")[0]?.trim() || "";
};

export const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;

  const apiKey = getSystemApiKey();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (apiKey) {
    (headers as Record<string, string>)["x-api-key"] = apiKey;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};