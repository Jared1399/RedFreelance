import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { requireSessionUserId } from "@/lib/session";

export async function GET(req: Request) {
  const { userId, authenticated } = await requireSessionUserId();
  if (!authenticated) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const gigId = searchParams.get("gigId");
  const destination = searchParams.get("destination");

  if (!gigId) {
    return NextResponse.json({ error: "Missing gig id" }, { status: 400 });
  }

  const key = `gigs/${userId}/${gigId}/${destination}`;

  const command = new PutObjectCommand({
    Bucket: "redfreelance",
    Key: key,
    ContentType: "image/png",
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

  const publicUrl = `https://cdn.redfreelance.com/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
