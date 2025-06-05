import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@mail.com" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) throw new Error("User not found with this credentials");
          else if (!user.isVerified) throw new Error("User is not verified");

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password,
            user.password
          );

          if (isPasswordCorrect) return user;
          else throw new Error("Invalid password");
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
};
