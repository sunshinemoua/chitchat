import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../../auth";
import { chatMembersCollectionGroupRef } from "@/lib/converters/ChatMembers";
import { getDocs } from "firebase/firestore";
import ChatList from "./ChatList";

// SSR to fetch docs from firestore and pass to client side
const ChatDataLayer = async () => {
  const session = await getServerSession(authOptions);

  // Return all chats that the user is a member of
  const chatsSnapshot = await getDocs(
    chatMembersCollectionGroupRef(session?.user.id!)
  );

  const initialChats = chatsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null,
  }));

  // Pass data to client
  return <ChatList initialChats={initialChats} />;
};

export default ChatDataLayer;
