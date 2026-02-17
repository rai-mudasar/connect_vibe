import CredentialsProvider from "next-auth/providers/credentials";
import userModel from "@/models/userModel";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.profileImageUrl = user.profileImageUrl;
        token.name = user.firstName + " " + user.lastName
      }

      if (trigger === "update" && session) {
        token.id = session.user.id;
        token.isVerified = session.user.isVerified;
        token.username = session.user.username;
        token.profileImageUrl = session.user.profileImageUrl;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name,
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.profileImageUrl = token.profileImageUrl;
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
