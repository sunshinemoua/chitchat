"use client";
import React from "react";
import InviteUserButton from "./InviteUserButton";
import DeleteChatButton from "./DeleteChatButton";

const AdminControls = ({ chatId }: { chatId: string }) => {
  return (
    <div className="flex justify-end p-2 mr-5">
      <InviteUserButton chatId={chatId} />
      <DeleteChatButton chatId={chatId} />
    </div>
  );
};

export default AdminControls;
