import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      const { email, image, name } = user;

      const existingUser = await prisma.user.findFirst({ where: { email } });

      if (!existingUser) {
        await prisma.user.create({ data: { email, image, name } });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    // Copia del JWT a session.user que lees en el cliente
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // session.user.role = token.role as string;
      }
      return session;
    },
  },
});
