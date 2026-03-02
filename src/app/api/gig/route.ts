import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireSessionUserId } from "@/lib/session";

const CreateGigBody = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  categories: z.string(),
  tiers: z.array(z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    deliveryTime: z.number()
  }))
});

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "0", 10);
  const gigId = searchParams.get("gigId");
  const userId = searchParams.get("userId");

  if (gigId && userId) {
    const gigDetails = await prisma.gig.findFirst({
      where: { AND: [{ id: gigId }, { userId: userId }] },
      include: {
        GigTier: true,
        categories: true
      }
    });

    if (!gigDetails || gigDetails.userId !== userId) {
      return NextResponse.json(
        { ok: false, error: "No gig found matching Id" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: true, gigDetails }
    );
  }

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
  const { userId, authenticated } = await requireSessionUserId();
  if (!authenticated) {
    return NextResponse.json(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const validation = CreateGigBody.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { ok: false, error: validation.error.format() },
      { status: 400 }
    );
  }

  const {
    title,
    description,
    price,
    categories,
    tiers
  } = validation.data;

  const categoryIds = categories.split(",").map((c: string) => Number.parseInt(c));

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "User does not exist" },
      { status: 400 }
    );
  }

  const newGig = await prisma.gig.create({
    data: {
      title: title.toLowerCase(),
      description,
      price,
      userId,
      categories: {
        connect: categoryIds.map((id: number) => ({ id })),
      },
      GigTier: {
        create: tiers.map((tier) => ({
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
