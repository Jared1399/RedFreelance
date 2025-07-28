import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";

// interface Gig {
//   id?: string;
//   title: string;
//   description: string;
//   price: number;
//   status: "active" | "inactive" | "completed"
// }


export const GET = apiHandler(async () => {
  const gigs = await prisma.gig.findMany();

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
    categories
  } = await request.json();

  const categoryIds = Array.isArray(categories)
    ? categories
    : [categories];

  const newGig = await prisma.gig.create({
    data: {
      title: title.toLowerCase(),
      description,
      price,
      status,
      categories: {
        connect: categoryIds.map((id: number) => ({ id }))
      }
    }
  });

  return NextResponse.json(newGig);

});
