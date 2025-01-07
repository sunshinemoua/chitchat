import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import ChatInput from "@/app/components/ChatInput";

// Extraxt chatId from URL
interface Props {
  params: {
    chatId: string;
  };
}

const ChatRoom = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const { chatId } = await params;

  return (
    <>
      <ChatInput chatId={chatId} />
    </>
  );
};

export default ChatRoom;
