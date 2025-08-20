import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const GET = apiHandler(async () => {

  const blogs = await prisma.blog.findMany();

  return NextResponse.json({ ok: true, blogs });

});

export const POST = apiHandler(async (request: Request) => {
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

});
