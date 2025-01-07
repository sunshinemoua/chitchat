import React from "react";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flec, flex-col max-w-6xl mx-auto">
      {children}
    </div>
  );
}
