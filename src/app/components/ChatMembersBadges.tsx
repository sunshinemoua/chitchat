"use client";
import useAdminId from "@/hooks/useAdminId";
import { ChatMembers, chatMembersRef } from "@/lib/converters/ChatMembers";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingSpinner from "./LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "./UserAvatar";

const ChatMembersBadges = ({ chatId }: { chatId: string }) => {
  const [members, loading, error] = useCollectionData<ChatMembers>(
    chatMembersRef(chatId)
  );

  // Call useAdminId hook to return admin user in chat
  const adminId = useAdminId({ chatId });

  if (loading && !members) return <LoadingSpinner />;

  return (
    !loading && (
      <div className="p-2 border rounded-xl m-5">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 p-2">
          {members?.map((member) => (
            <Badge
              variant="secondary"
              key={member.email}
              className="h-14 p-5 pl-2 pr-5 flex space-x-2"
            >
              {/* Admin Email */}
              <div className="flex items-center space-x-2">
                <UserAvatar name={member.email} image={member.image} />
              </div>

              {/* Admin badge */}
              <div>
                <p>{member.email}</p>
                {member.userId === adminId && (
                  <p className="text-indigo-400 pt-2 animate-pulse">Admin</p>
                )}
              </div>
            </Badge>
          ))}
        </div>
      </div>
    )
  );
};

export default ChatMembersBadges;
