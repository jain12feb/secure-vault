import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import { LoginSchema } from "./schemas/login.schema";
import { getUserByEmail } from "./data/user";

export default {
  providers: [
    // GitHub({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    Credentials({
      async authorize(credentials, req) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields?.success) {
          const { email, password } = validatedFields?.data;

          const user = await getUserByEmail(email);

          if (!user) throw new Error("No account found!");

          if (!password) return null;

          const isPasswordMatched = await bcryptjs.compare(
            password,
            user.password
          );

          if (isPasswordMatched) return user;

          // return null;
        }

        return null;
      },
    }),
  ],
};
