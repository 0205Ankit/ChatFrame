import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { db } from "@/server/db";
import { nanoid } from "nanoid";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      userName?: string | null;
      profilePhoto?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userName?: string | null;
    picture?: string | null;
    email?: string | null;
    name?: string | null;
    profilePhoto?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.userName = token.userName;
        session.user.image = token.picture;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.profilePhoto = token.profilePhoto;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        token.userName = user.name;
        return token;
      }

      if (!dbUser.userName) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            userName: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        profilePhoto: dbUser.profilePhoto,
        name: dbUser.name,
        picture: dbUser.image,
        userName: dbUser.userName,
      };
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
