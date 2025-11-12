import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "0", 10);

  const blogs = await prisma.blog.findMany({
    skip: skip || undefined,
    take: limit || undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ ok: true, blogs });
};

export async function POST(request: Request) {
  try {
    const { title, content, authorId, categories } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    let categoriesToConnect;
    if (categories && categories.length > 0) {
      const existingCategories = await prisma.blogCategory.findMany({
        where: { id: { in: categories } },
      });

      if (existingCategories.length !== categories.length) {
        return NextResponse.json(
          { ok: false, error: "Alguna categoría no existe" },
          { status: 400 }
        );
      }

      categoriesToConnect = { connect: categories.map((id: number) => ({ id })) };
    }

    const newBlog = await prisma.blog.create({
      data: {
        title: title.toLowerCase(),
        content,
        authorId,
        categories: categoriesToConnect,
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json({ ok: true, blog: newBlog });

  } catch (error) {
    console.error("Error creando blog:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
