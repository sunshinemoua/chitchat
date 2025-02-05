"use client";

import {
  ChatMembers,
  chatMembersCollectionGroupRef,
} from "@/lib/converters/ChatMembers";
import { useSession } from "next-auth/react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import React from "react";
import { MessageSquare } from "lucide-react";
import CreateChatButton from "./CreateChatButton";
import { lastMessageRef, Message } from "@/lib/converters/Message";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "./UserAvatar";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "../../../store/store";

const ChatRow = ({ chatId }: { chatId: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const language = useLanguageStore((state) => state.language);

  const [messages, loading, error] = useCollectionData<Message>(
    lastMessageRef(chatId)
  );

  if (error) console.error("There was an error retreving messages:", error);

  const renderChatRow = (message?: Message) => {
    return (
      <div
        key={chatId}
        onClick={() => router.push(`/chat/${chatId}`)}
        className="flex p-5 items-center space-x-2 cursor-pointer gover:bg-gray-100 dark:hover:bg-slate-700"
      >
        <UserAvatar
          name={message?.user.name! || session?.user.name!}
          image={message?.user.image! || session?.user.image!}
        />

        {/* Chat Header */}
        <div className="flex-1">
          <p className="font-bold">
            {!message && "New Chat"}
            {message &&
              [message?.user.name || session?.user.name]
                .toString()
                .split(" ")[0]}
          </p>
          {/* Chat Preview */}
          <p className="text-gray-400 line-clamp-1">
            {message?.translated?.[language] ||
              "Get the conversation started.."}
          </p>
        </div>
        {/* Timestamp of last message sent */}
        <div className="text-xs text-gray-400 text-right">
          <p className="mb-auto">
            {message
              ? new Date(message?.timestamp)?.toLocaleTimeString()
              : "No messages yet"}
          </p>
          {/* Return first 4 characters of chat ID or chat name*/}
          <p>chat #{chatId.substring(0, 4)}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      {loading && (
        <div className="flex p-5 items-center space-x-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      )}

      {messages?.length === 0 && !loading && renderChatRow()}
      {messages?.map((message) => renderChatRow(message))}
    </div>
  );
};

const ChatList = ({ initialChats }: { initialChats: ChatMembers[] }) => {
  const { data: session } = useSession();

  // useCollectionData extracts list of query snapshot docs
  const [members, loading, error] = useCollectionData<ChatMembers>(
    // If session exists, then retrieve data from firestore query (ref)
    session && chatMembersCollectionGroupRef(session?.user.id!),
    {
      initialValue: initialChats, // initial value until data is retrieved from snapshots
    }
  );

  // If user is not in any chats...
  if (members?.length === 0)
    return (
      <div className="flex flex-col justify-center items-center pt-40 space-y-2">
        <MessageSquare className="h-10 w-10" />
        <h1 className="text-5xl font-extralight">Welcome!</h1>
        <h2 className="pb-10">Let's start by creating your first chat!</h2>
        <CreateChatButton isLarge={true} />
      </div>
    );

  return (
    <div>
      {members?.map((member, i) => (
        <ChatRow key={member.chatId} chatId={member.chatId} />
      ))}
    </div>
  );
};

export default ChatList;
