import withAuth from "next-auth/middleware";

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET! as string,
});

// Authentication check for protected routes
export const config = {
  matcher: ["/chat", "/chat/:id", "/register"],
};
