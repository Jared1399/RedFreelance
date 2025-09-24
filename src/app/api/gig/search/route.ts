import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") ?? undefined;
  const includeUser = !!(searchParams.get("user") ?? false);

  const gig = await prisma.gig.findMany({
    where: {
      title: {
        contains: title
      }
    },
    include: {
      user: includeUser
    }
  });

  return NextResponse.json(gig);
};