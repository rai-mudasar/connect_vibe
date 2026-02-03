import Credentials from "next-auth/providers/credentials";
import connectToDb from "@/lib/dbConnect";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },

        authorize: async (credentials) => {
          await connectToDb();

          try {
            const user = await User.findOne({
              $OR: [
                {username: credentials.identifier},
                {email: credentials.identifier}
              ]
            });

            if(!user) {
                throw new Error('User not found with this username or email');
            }
            
            if(!user.isVerified){
                throw new Error('Please verify your email');
            }

            const isMatchedPassword = await bcryptjs.compare(credentials.password, user.password);

            if(isMatchedPassword){
                return user;
            }
            else{
                throw new Error('Incorrect Password');
            }

          } catch (error) {
            throw new Error(error);
          }
        },
      },
    }),
  ],

  callbacks: {
    async jwt({token, user}){
        if(user) {
            token._id = user._id
            token.username = user.username        
        }

        return token;
    },

    async session({token, session}){
        if(token){
            session._id = token._id
            session.username = token.username
        }

        return session;
    }
  },

  session: {
    strategy: 'jwt'
  },

  secret: process.env.NEXTAUTH_SECRET
};