// import React from "react";

// type Props = {
//   params: {};
//   searchParams: {
//     error: string;
//   };
// };
// const ChatsOverviewPage = async ({ searchParams }: Props) => {
//   const { error } = await searchParams;
//   console.log(error);

//   return <div> CHATS overview page</div>;
// };

// export default ChatsOverviewPage;

import ChatList from "@/app/components/ChatList";
import React from "react";

const ChatsOverviewPage = () => {
  return (
    <div>
      chats overview page
      <ChatList />
    </div>
  );
};

export default ChatsOverviewPage;
