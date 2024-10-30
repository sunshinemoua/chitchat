import withAuth from "next-auth/middleware";

export default withAuth;

// Authentication check for protected routes
export const config = {
  matcher: ["/chat", "/chat/:id", "/register"],
};
