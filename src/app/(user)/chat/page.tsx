import ChatList from "@/app/components/ChatList";
import React from "react";

type Props = {
  params: {};
  searchParams: {
    error: string;
  };
};

const ChatsOverviewPage = async ({ searchParams }: Props) => {
  //   const { error } = await searchParams;
  return (
    <div>
      <ChatList />
    </div>
  );
};

export default ChatsOverviewPage;
