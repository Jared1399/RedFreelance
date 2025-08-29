import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ajusta la ruta a tu config de next-auth

export default async function AuthMiddleware(
  { children }: { children: ReactNode }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
}
