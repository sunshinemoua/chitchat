import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import ChatInput from "@/app/components/ChatInput";
import ChatMessages from "@/app/components/ChatMessages";
import { getDocs } from "firebase/firestore";
import { sortedMessagesRef } from "@/lib/converters/Message";
import ChatMembersBadges from "@/app/components/ChatMembersBadges";
import AdminControls from "@/app/components/AdminControls";
import { chatMembersCollectionGroupRef } from "@/lib/converters/ChatMembers";

// Extract chatId from URL
interface Props {
  params: Promise<{ chatId: string }>;
}

const ChatRoom = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const { chatId } = await params;

  // Call API to return all messages in this chat in asc order
  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(
    (doc) => doc.data()
  );

  // If the user is logged in and attempting to access chat room but NOT a member of the chat
  if (session && session?.user.id) {
    const chatMembersSnapshot = await getDocs(
      chatMembersCollectionGroupRef(session?.user.id)
    );

    // Check if the user is in the chat members list
    const isMember = chatMembersSnapshot.docs.some(
      (doc) => doc.data().userId === session.user.id
    );

    if (!isMember) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-lg px-6 py-8 bg-white shadow-md rounded-lg dark:bg-gray-800">
            <h1 className="text-3xl font-bold text-center text-red-500">
              Access Denied
            </h1>
            <p className="mt-4 text-center text-lg text-gray-700 dark:text-gray-400">
              You are not a member of the chat you are attempting to access.
              Please contact the admin to receive an invite.
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <AdminControls chatId={chatId} />
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
