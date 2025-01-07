import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../../auth";
import { chatMembersCollectionGroupRef } from "@/lib/converters/ChatMembers";
import { getDocs } from "firebase/firestore";
import ChatListRows from "./ChatListRows";

const ChatList = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return;

  // Return all chats that the user is a member of
  const chatsSnapshot = await getDocs(
    chatMembersCollectionGroupRef(session?.user.id)
  );

  const initialChats = chatsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null,
  }));

  // Pass data to client
  return <ChatListRows initialChats={initialChats} />;
};

export default ChatList;
