import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Extracts the authenticated userId from the NextAuth JWT session.
 * Returns the userId string or null if not authenticated.
 */
export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.userId ?? null;
}

/**
 * Same as getSessionUserId but throws-friendly:
 * returns { userId } or { error: NextResponse } for quick guards.
 */
export async function requireSessionUserId() {
  const userId = await getSessionUserId();
  if (!userId) {
    return { userId: null as never, authenticated: false as const };
  }
  return { userId, authenticated: true as const };
}
