import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";

interface Params {
  params: { categoryId: string | number[] }
}


export const GET = apiHandler(async (request: Request, { params }: Params) => {
  const param = await params;

  const parseIds = param.categoryId.toString().split(",");
  const categoryIds = parseIds.length ? parseIds.map(num => parseInt(num, 10)) : null;


  if (categoryIds) {
    const gigs = await prisma.gig.findMany({
      where: {
        categories: {
          every: {
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

});