import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../../../auth";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If user is not logged in and attempting to access /chat or /chat/:chatId
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-lg px-6 py-8 bg-white shadow-md rounded-lg dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-center text-red-500">
            Access Denied
          </h1>
          <p className="mt-4 text-center text-lg text-gray-700 dark:text-gray-400">
            You are currently not logged in. Please log in or register to access
            this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col max-w-6xl mx-auto">
      {children}
    </div>
  );
}
