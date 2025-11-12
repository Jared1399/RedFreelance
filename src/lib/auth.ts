import { NextAuthOptions, Profile, DefaultSession } from "next-auth";
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

interface CustomProfile extends Profile {
  userId?: string;
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
      try {
        if (!profile?.email) {
          console.error("Error en signIn: El perfil de Google no devolvió un email.");
          return false;
        }

        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });


        if (!user) {
          const [firstName, lastName] = profile?.name?.split(" ") ?? [];

          user = await prisma.user.create({
            data: {
              firstName: firstName || '',
              lastName: lastName || '',
              email: profile.email,
              userImg: profile?.image,
            }
          });
        }

        (profile as CustomProfile).userId = user.id;

        return true;

      } catch (err) {
        console.error("Error en el callback de signIn:", err);
        return false;
      }
    },

    async jwt({ token, user, profile }) {
      if (user) {
        token.userId = (profile as CustomProfile)?.userId;
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