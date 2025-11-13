import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session extends DefaultSession {
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}

declare module "next-auth" {
  interface Session {
    userId?: string;
  }
}


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    error: '/',
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        console.error("Error en signIn: El perfil de Google no devolvió un email.");
        return false;
      }
      return true;
    },

    async jwt({ token, profile }) {

      if (token.userId) {
        return token;
      }

      if (profile?.email) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!dbUser) {
            const [firstName, lastName] = profile?.name?.split(" ") ?? [];
            dbUser = await prisma.user.create({
              data: {
                firstName: firstName || '',
                lastName: lastName || '',
                email: profile.email,
                userImg: profile?.image,
              }
            });
          }

          token.userId = dbUser.id;

        } catch (err) {
          console.error("Error en JWT callback buscando/creando usuario:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.userId) {
        session.userId = token.userId as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};