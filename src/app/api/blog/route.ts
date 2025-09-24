import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  const blogs = await prisma.blog.findMany();
  return NextResponse.json({ ok: true, blogs });
};

export async function POST(request: Request) {
  const {
    title,
    content,
    categories,
    authorId
  } = await request.json();

  const newBlog = await prisma.blog.create({
    data: {
      title: title.toLowerCase(),
      content,
      authorId,
      categoryId: {
        connect: categories.map((id: number) => ({ id }))
      }
    }
  });

  return NextResponse.json(newBlog);
};
