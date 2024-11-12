"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { MessageSquarePlusIcon } from "lucide-react";
import { useRouter } from "next/router";

const CreateChatButton = () => {
  //   const router = useRouter();
  //   const createNewChat = async () => {
  //     router.push(`/chat/chatABC`);
  //   };

  return (
    <Button variant="ghost">
      <MessageSquarePlusIcon />
    </Button>
  );
};

export default CreateChatButton;