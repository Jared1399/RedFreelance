import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    error: '/',  // a dónde ir en caso de error
  },
  callbacks: {
    async signIn({ profile }) {
      try {
        const response = await fetch(`http://localhost:3000/api/user/email/${profile?.email}`);
        const user = await response.json();

        if (!user) {
          const [firstName, lastName] = profile?.name?.split(" ") ?? [];

          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/`, {
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
        }

        return true;
      } catch (err) {
        console.error("Error creating or fetching user:", err);
        return false;
      }

    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
