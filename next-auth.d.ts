import NextAuth, { DefaultSession } from "next-auth";

// Module augmentation to add user id as a parameter in Session

declare module "next-auth" {
  interface Session {
    firebaseToken?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
