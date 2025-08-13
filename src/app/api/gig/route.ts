import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const GET = apiHandler(async (request: Request) => {

  const { searchParams } = new URL(request.url);

  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "0", 10);

  const gigs = await prisma.gig.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          userImg: true,
        },
      },
    },
    skip: skip || undefined,
    take: limit || undefined
  });

  return NextResponse.json(
    { ok: true, gigs }
  );

});

export const POST = apiHandler(async (request: Request) => {
  const {
    title,
    description,
    price,
    status,
    categories,
    userId
  } = await request.json();

  const categoryIds = categories.split(",").map((c: string) => Number.parseInt(c));

  const newGig = await prisma.gig.create({
    data: {
      title: title.toLowerCase(),
      description,
      price,
      status,
      userId,
      categories: {
        connect: categoryIds.map((id: number) => ({ id }))
      }
    }
  });

  return NextResponse.json(newGig);

});
