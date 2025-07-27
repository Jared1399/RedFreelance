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
    status
  } = await request.json();

  const newGig = await prisma.gig.create({
    data: {
      title,
      description,
      price,
      status
    }
  });

  return NextResponse.json(newGig);

});
