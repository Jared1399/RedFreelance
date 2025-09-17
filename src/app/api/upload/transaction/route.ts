import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

export async function GET(req: Request) {
  const allowedTypes = ["image/png", "image/jpeg", "video/mp4"];

  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const destination = searchParams.get("destination");
  const mimeType = searchParams.get("type") || "application/octet-stream";

  if (!userId || !destination) {
    return NextResponse.json({ error: "Missing userId or destination" }, { status: 400 });
  }

  if (!allowedTypes.includes(mimeType)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const key = `transactions/${userId}/${destination}`;

  const command = new PutObjectCommand({
    Bucket: "redfreelance",
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
  const publicUrl = `https://cdn.redfreelance.com/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
