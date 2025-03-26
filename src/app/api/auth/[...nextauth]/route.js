import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import conn_to_mon from "@/features/mongoose";
import bcrypt from "bcryptjs";
import AdminUser from "@/models/AdminUser";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await conn_to_mon();

          const user = await AdminUser.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (user.active==="false") {
            throw new Error("User not Active");
          }

          if (!isMatch) {
            throw new Error("Wrong password");
          }

          return {
            id: user._id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 60 * 60 * 24 * 7, // Token age increased to 7 days
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    async signIn({ user, account }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.phoneNumber = user.phoneNumber;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.email = token.email;
      session.user.phoneNumber = token.phoneNumber;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
