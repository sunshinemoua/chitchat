import React from "react";

type Props = {
  params: {};
  searchParams: {
    error: string;
  };
};
const ChatsOverviewPage = async ({ searchParams }: Props) => {
  const { error } = await searchParams;

  return <div> CHATS overview page</div>;
};

export default ChatsOverviewPage;
