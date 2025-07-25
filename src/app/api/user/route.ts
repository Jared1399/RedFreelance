import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const users = await prisma.user.findMany()

    return NextResponse.json(
      {
        ok: true,
        users
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error.message)
    }
  }
}


export async function POST(request: Request) {
  const {
    firstName,
    lastName,
    email,
    passwordHash,
    identification,
    phone
  } = await request.json()


  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      identification,
      phone
    }
  })

  return NextResponse.json(newUser)
}