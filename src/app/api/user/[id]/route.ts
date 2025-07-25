import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// interface Params {
//   params: { title: string }
// }

export async function GET() {
  try {
    const user = prisma.user.findFirst({
      where: {
        firstName: "John"
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error.message)
    }
  }
}
