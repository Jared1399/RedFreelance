import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { z } from "zod";

const UploadTransactionSchema = z.object({
  userId: z.uuid(),
  destination: z.string().min(1),
  type: z.enum(["image/png", "image/jpeg", "video/mp4", "image/webp"]),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const rawParams = {
    userId: searchParams.get("userId"),
    destination: searchParams.get("destination"),
    type: searchParams.get("type"),
  };

  const validation = UploadTransactionSchema.safeParse(rawParams);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Missing/Invalid parameters", details: validation.error.format() },
      { status: 400 }
    );
  }

  const { userId, destination, type } = validation.data;
  const mimeType = type;

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
