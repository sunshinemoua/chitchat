import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import ChatInput from "@/app/components/ChatInput";
import ChatMessages from "@/app/components/ChatMessages";
import { getDocs } from "firebase/firestore";
import { sortedMessagesRef } from "@/lib/converters/Message";
import ChatMembersBadges from "@/app/components/ChatMembersBadges";

// Extract chatId from URL
interface Props {
  params: {
    chatId: string;
  };
}

const ChatRoom = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const { chatId } = await params;

  // Call API to return all messages in this chat in asc order
  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(
    (doc) => doc.data()
  );

  return (
    <>
      <ChatMembersBadges chatId={chatId} />

      <div className="flex-1">
        <ChatMessages
          chatId={chatId}
          session={session}
          initialMessages={initialMessages}
        />
      </div>
      <ChatInput chatId={chatId} />
    </>
  );
};

export default ChatRoom;
