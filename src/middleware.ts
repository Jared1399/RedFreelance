import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedKeys = (process.env.ALLOWED_KEYS ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const hostname = req.headers.get("host");
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isAllowedOrigin = !origin || allowedOrigins.includes(origin);
  const corsOrigin = isAllowedOrigin && origin ? origin : allowedOrigins[0] ?? "";

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

  if (path === "/api/chat") {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", corsOrigin);
    return response;
  }

  const isInternal =
    !origin || origin === req.nextUrl.origin || origin.includes(hostname ?? "");

  const apiKey = req.headers.get("x-api-key") ?? "";

  if (
    !isInternal &&
    !allowedKeys.includes(apiKey) &&
    !path.startsWith("/api/user") &&
    !path.startsWith("/api/auth")
  ) {
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
