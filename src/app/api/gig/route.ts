import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


interface Tier {
  localId: number;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
}



export async function GET(request: Request) {

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

};

export async function POST(request: Request) {
  const {
    title,
    description,
    price,
    status,
    categories,
    tiers,
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
        connect: categoryIds.map((id: number) => ({ id })),
      },
      GigTier: {
        create: tiers.map((tier: Tier) => ({
          name: tier.name,
          price: tier.price,
          description: tier.description,
          deliveryTime: tier.deliveryTime,
        })),
      },
    },
    include: {
      GigTier: true,
    },
  });

  return NextResponse.json(newGig);

};
