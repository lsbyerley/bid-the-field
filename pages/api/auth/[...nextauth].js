import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  // TODO: taking this out for now, the user is not redirected back to home page with this enabled
  pages: {
    signIn: '/auth/signin',
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  debug: process.env.NEXTAUTH_DEBUG,
});
