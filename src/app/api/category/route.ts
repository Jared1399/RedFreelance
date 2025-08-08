import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "0", 10);

  const category = await prisma.category.findMany({
    skip: skip || undefined,
    take: limit || undefined
  });

  return NextResponse.json({ ok: true, category });
});

export const POST = apiHandler(async (request: Request) => {
  const {
    name,
    description
  } = await request.json();

  const newCategory = await prisma.category.create({
    data: {
      name: name.toLowerCase(),
      description
    }
  });

  return NextResponse.json({ ok: true, user: newCategory }, { status: 201 });
});