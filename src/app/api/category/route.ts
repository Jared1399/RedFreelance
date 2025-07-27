import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler(async () => {
  const category = await prisma.category.findMany();
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