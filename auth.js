import NextAuth from "next-auth";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";
import { getUserById } from "./data/user";
import { createSession } from "./actions/session-actions";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  pages: {
    signIn: "/login",
    error: "/error",
    newUser: "/register",
    signOut: "/",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // const userFromDb = await getUserById(user?.id);

      // preventing signin without email verification
      if (!user || !user.emailVerified)
        throw new Error("Your account is not verified!");

      // Add 2FA check
      if (user.isTwoFactorEnabled) {
        const twofactorConfirmation = await getTwoFactorConfirmationByUserId(
          user.id
        );

        if (!twofactorConfirmation)
          throw new Error("No Two-factor confirmation found");

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twofactorConfirmation.id },
        });
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token?.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      // Store the session in the Session table when the JWT is created
      if (user) {
        const sessionToken = await createSession(token, user.id);

        token.sessionToken = sessionToken; // Add session token to the JWT token
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.sessionToken = token?.sessionToken;
      }

      return session;
    },
  },
});
