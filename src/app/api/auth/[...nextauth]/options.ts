import type { NextAuthOptions } from "next-auth";
import bcrypt from 'bcryptjs';
import dbconnect from '@/lib/dbconnect';
import UserModel from '@/model/user.model';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any): Promise<any> => {
        await dbconnect();
        try {

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this credential");
          }

          if (!user.isverified) {
            throw new Error("Verify your account to login");
          }

          const isCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }

        } catch (error: any) {
          throw new Error("Error in options.ts: " + error.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) { // User is available during sign-in
        token.id = user._id?.toString();
        token.isverified = user.isverified;
        token.isacceptingmessages = user.isacceptingmessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user._id = token.id as string;
        session.user.isverified = token.isverified as boolean;
        session.user.isacceptingmessages = token.isacceptingmessages as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};