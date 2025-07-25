import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {

      const response = await fetch(`http://localhost:3000/api/user/email/${profile?.email}`);
      const user = await response.json();

      if (!user) {
        const [firstName, lastName] = profile?.name?.split(" ") ?? [];

        await fetch(`http://localhost:3000/api/user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: profile?.email,
            userImg: profile?.image
          })
        });
      }

      return true;
    }
  }
});

export { handler as GET, handler as POST };