"use client";

import { chatMemberAdminRef } from "@/lib/converters/ChatMembers";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const useAdminId = ({ chatId }: { chatId: string }) => {
  const [adminId, setAdminId] = useState<string>("");

  // Call API to check is user is admin
  const fetchAdminStatus = async () => {
    const adminId = (await getDocs(chatMemberAdminRef(chatId))).docs.map(
      (doc) => doc.id
    )[0];

    // Update adminId in state
    setAdminId(adminId);
  };

  // Run fetchAdminStatus any time chatId changes
  useEffect(() => {
    fetchAdminStatus();
  }, [chatId]);

  return adminId;
};

export default useAdminId;
