import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name");

  if (name) {
    const lifecycle = await prisma.lifecycle.findFirst({
      where: {
        name: { equals: name }
      }
    });
    return NextResponse.json({ ok: true, lifecycle });
  }

  return NextResponse.json({ ok: true, lifecycle: [] });
};