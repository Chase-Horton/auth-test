import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "./data/user";
import authConfig from "./auth.config";
import prisma from "./lib/db";
import { JWT } from "next-auth/jwt"
import { UserRole } from "@prisma/client";
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"]
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: UserRole;
  }
}
export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({session, token}) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      console.log("session callback", session)
      return session;
    },
    async jwt({token}) {
      if (!token.sub) {
        //user is not logged in return token
        return token;
      }
      // fetch role from db
      const existingUser = await getUserById(token.sub);
      
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    }
  },
  adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
  ...authConfig,
})