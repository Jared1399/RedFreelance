import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "")
  .split(",").map((o) => o.trim()).filter(Boolean);

const allowedKeys = (process.env.ALLOWED_KEYS ?? "")
  .split(",").map((k) => k.trim()).filter(Boolean);

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const apiKey = req.headers.get("x-api-key");
  const path = req.nextUrl.pathname;

  const fetchSite = req.headers.get("sec-fetch-site");

  if (path.startsWith("/api/auth")) return NextResponse.next();

  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 200 });
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Credentials", "true");
    }
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
    return res;
  }

  if (apiKey && allowedKeys.includes(apiKey)) {
    const res = NextResponse.next();
    if (allowedOrigins.includes(origin)) res.headers.set("Access-Control-Allow-Origin", origin);
    return res;
  }

  if (!fetchSite) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized: Missing browser security headers" },
      { status: 401 }
    );
  }

  if (fetchSite === "same-origin") {
    return NextResponse.next();
  }

  if (
    (fetchSite === "cross-site" || fetchSite === "same-site")
    && allowedOrigins.includes(origin)
  ) {
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  return NextResponse.json({ ok: false, error: "Unauthorized Origin" }, { status: 403 });
}

export const config = {
  matcher: "/api/:path*",
};