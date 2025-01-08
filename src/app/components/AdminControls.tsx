"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import InviteUserButton from "./InviteUserButton";

const AdminControls = ({ chatId }: { chatId: string }) => {
  return (
    <div className="flex justify-end p-2 mr-5">
      <InviteUserButton chatId={chatId} />
    </div>
  );
};

export default AdminControls;
