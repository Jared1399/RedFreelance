import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";

/**
 * Issues a short-lived JWT for Socket.IO authentication.
 * The socket server verifies this token using the same NEXTAUTH_SECRET.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.userId) {
    return NextResponse.json(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  const token = jwt.sign(
    { userId: session.userId },
    secret,
    { expiresIn: "12h" }
  );

  return NextResponse.json({ ok: true, token });
}
