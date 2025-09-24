import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(
  request: Request, { params }:
    { params: Promise<{ categoryId: string }> }
) {
  const param = await params;

  const parseIds = param.categoryId.toString().split(",");
  const categoryIds = parseIds.length ? parseIds.map(num => parseInt(num, 10)) : null;

  if (categoryIds) {
    const gigs = await prisma.gig.findMany({
      where: {
        categories: {
          some: {
            id: {
              in: categoryIds
            }
          }
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            userImg: true,
          },
        },
      }
    });

    return NextResponse.json(gigs);
  }
};