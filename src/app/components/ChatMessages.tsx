"use client";

import { Message, sortedMessagesRef } from "@/lib/converters/Message";
import { Session } from "next-auth";
import { useLanguageStore } from "../../../store/store";
import { useEffect, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { MessageCircleIcon } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import UserAvatar from "./UserAvatar";

type Props = {
  chatId: string;
  session: Session | null;
  initialMessages: Message[];
};
const ChatMessages = ({ chatId, session, initialMessages }: Props) => {
  const { language } = useLanguageStore();

  // Listener to scroll to end of chat when new message is received
  const messagesEndRef = useRef<HTMLDivElement>();

  // Fetch current messages
  const [messages, loading, error] = useCollectionData<Message>(
    sortedMessagesRef(chatId),
    {
      initialValue: initialMessages,
    }
  );

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <div className="p-5">
      {/* Render welcome message if no messages or loading */}
      {!loading && messages?.length === 0 && (
        <div className="flex flex-col justify-center items-center text-center p-20 rounded-xl space-y-2 bg-indigo-400 text-white font-extralight">
          <MessageCircleIcon className="h-10 w-10" />
          <h2>
            <p className="font-bold">
              Invite a friend & send your first message in any language!!
            </p>
          </h2>
          <p className="font-light">
            The AI will auto-detect & translate it all for you!
          </p>
        </div>
      )}

      {messages?.map((message) => {
        const isSender = message.user.id === session?.user.id;

        return (
          <div key={message.id} className="flex my-2 items-end">
            {/* Conditional message block color */}
            <div
              className={`flex flex-col relative space-y-2 p-4 w-fit line-clamp-1 mx-2 rounded-lg ${
                isSender
                  ? "ml-auto bg-violet-600 text-white rounded-br-none"
                  : "bg-gray-100 dark:text-gray-100 dark:bg-slate-700 rounded-bl-none"
              }`}
            >
              {/* Username in message block and conditional text side if isSender*/}
              <p
                className={`text-xs italic font-extralight line-clamp-1 ${
                  isSender ? "text-right" : "text-left"
                }`}
              >
                {message.user.name.split(" ")[0]}
              </p>

              {/* Message sent */}
              <div className="flex space-x-2">
                {/* Render message in selected language */}
                <p>{message.translated?.[language] || message.input}</p>
                {!message.translated && <LoadingSpinner />}
              </div>
            </div>

            {/* Profile Pic */}
            <UserAvatar
              name={message.user.name}
              image={message.user.image}
              className={`${!isSender && "-order-1"}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
