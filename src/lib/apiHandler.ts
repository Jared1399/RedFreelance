import { NextResponse } from 'next/server';

const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "")
  .split(",")
  .map(o => o.trim());

export function apiHandler<T extends unknown[], R>(handler: (...args: T) => Promise<R>) {
  return async (...args: T) => {
    try {
      const result = await handler(...args);

      const req = args[0] as Request;
      const origin = req.headers.get("origin") ?? "";

      const corsOrigin = allowedOrigins.includes(origin) ? origin : "";

      if (result instanceof NextResponse) {
        result.headers.set("Access-Control-Allow-Origin", corsOrigin);
        result.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        result.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return result;
      }

      return NextResponse.json(
        { ok: true, data: result },
        {
          headers: {
            "Access-Control-Allow-Origin": corsOrigin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json(
        { ok: false, error: message },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }
  };
}
