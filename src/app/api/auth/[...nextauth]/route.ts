import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@/../models/user.js'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {

      User.findOrCreate({
        where: { email: profile?.email },
        defaults: {
          firstName: account?.given_name || 'Nombre',
          lastName: account?.family_name || 'Apellido',
          passwordHash: '', // o puedes generar una hash dummy si se requiere
          identification: '', // puedes asignar un valor temporal o manejarlo luego
          phone: '',
          isFreelancer: false,
          rankCommunity: 0,
          rankPlatform: 0,
          subscriptionPlan: 'basic',
          subscriptionStart: null,
          subscriptionEnd: null,
          level: 'novice',
          isVerified: true, // si estás usando Google OAuth, esto puede ser true por defecto
          warningCount: 0,
        },
      });

      return true;
    }
  }
});

export { handler as GET, handler as POST };