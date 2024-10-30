"use client";

import { SessionProvider } from "next-auth/react";

// Create provider to allow interaction with sessions from client side

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientProviders;
