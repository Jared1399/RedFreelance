import { NextAuthOptions, Session, Profile, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

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
        const response = await fetch(`${BASE_URL}/api/user/email/${profile?.email}`);
        let user = await response.json();

        if (!user?.id) {
          const [firstName, lastName] = profile?.name?.split(" ") ?? [];

          const newUserRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email: profile?.email,
              userImg: profile?.image,
            }),
          });

          user = await newUserRes.json();
        }

        // Guardamos userId en el profile para usarlo luego en jwt/session
        (profile as CustomProfile).userId = user.id;

        return true;
      } catch (err) {
        console.error("Error creating or fetching user:", err);
        return false;
      }
    },
    async jwt({ token, profile }): Promise<JWT & { userId?: string }> {
      if (profile && (profile as CustomProfile).userId) {
        token.userId = (profile as CustomProfile).userId;
      }
      return token;
    },

    async session({ session, token }): Promise<Session & { userId?: string }> {
      if (token.userId) {
        session.userId = token.userId;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
