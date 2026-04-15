import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        identifier: {
          label: "Username or Email",
          type: "text",
          placeholder: "username or email",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Please enter both identifier and password.");
          }

          const { identifier, password } = credentials;

          const user = await userModel.findOne({
            $or: [{ username: identifier }, { email: identifier }],
          });

          if (!user) {
            throw new Error("User not found.");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

          return user;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;  
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET,
};
