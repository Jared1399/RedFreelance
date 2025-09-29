import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim());

const allowedKeys = (process.env.ALLOWED_KEYS ?? "")
  .split(",")
  .map((k) => k.trim());

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = !origin || allowedOrigins.includes(origin);
  const path = req.nextUrl.pathname;


  const corsOrigin = isAllowedOrigin && origin ? origin : allowedOrigins[0];

  if (origin && !allowedOrigins.includes(origin)) {
    const response = new NextResponse(
      JSON.stringify({ ok: false, error: "Origin not allowed" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
    response.headers.set("Access-Control-Allow-Origin", corsOrigin);
    return response;
  }

  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 200 });
    res.headers.set("Access-Control-Allow-Origin", corsOrigin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
    return res;
  }

  if (path === '/api/chat') {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", corsOrigin);
    return response;
  }

  const apiKey = req.headers.get("x-api-key") ?? "";
  const isInternal = origin === "" || origin === null || origin === req.nextUrl.origin;


  if (!isInternal && !allowedKeys.includes(apiKey)) {
    const response = new NextResponse(
      JSON.stringify({ ok: false, error: "Unauthorized: invalid API key" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
    response.headers.set("Access-Control-Allow-Origin", corsOrigin);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", corsOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};