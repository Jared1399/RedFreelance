import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";

interface Params {
  params: { firstName: string }
}


export const GET = apiHandler(async ({ params }: Params) => {
  const user = prisma.user.findFirst({
    where: {
      firstName: params.firstName
    }
  })

  return NextResponse.json(user)
})