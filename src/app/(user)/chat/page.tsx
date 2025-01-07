import ChatDataLayer from "@/app/components/ChatDataLayer";
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
      <ChatDataLayer />
    </div>
  );
};

export default ChatsOverviewPage;
