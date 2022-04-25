import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // Persist any values to the token right after signin
      // if (account) {
      //  token.accessToken = account.access_token;
      // }
      return token;
    },
    async session({ session, token, user }) {
      // session.accessToken = token.accessToken;
      session.user.id = token.sub;
      return session;
    },
  },
  debug: process.env.NEXTAUTH_DEBUG,
});
