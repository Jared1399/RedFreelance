import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const gigId = searchParams.get("gigId");
  const destination = searchParams.get("destination");

  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

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
