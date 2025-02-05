import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import ClientProviders from "./components/ClientProviders";
import FirebaseAuthProvider from "./components/FirebaseAuthProvider";
import SubscriptionProvider from "./components/SubscriptionProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ChitChat",
  description: "Chat in any language!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientProviders>
      <html lang="en" suppressHydrationWarning>
        <body className="flex flex-col min-h-screen">
          <FirebaseAuthProvider>
            <SubscriptionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                {children}
                <Toaster />
              </ThemeProvider>
            </SubscriptionProvider>
          </FirebaseAuthProvider>
        </body>
      </html>
    </ClientProviders>
  );
}
