import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";

export const GET = apiHandler(async () => {
  const users = await prisma.user.findMany();
  return NextResponse.json({ ok: true, users });
});

export const POST = apiHandler(async (request: Request) => {
  const {
    firstName,
    lastName,
    email,
    passwordHash,
    identification,
    phone
  } = await request.json();

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      identification,
      phone
    }
  });

  return NextResponse.json({ ok: true, user: newUser }, { status: 201 });
});