"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { MessageSquarePlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
// import { userSubscriptionStore } from "../../../store/store";
import LoadingSpinner from "./LoadingSpinner";
import { getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import {
  addChatRef,
  chatMembersCollectionGroupRef,
} from "@/lib/converters/ChatMembers";
import { userSubscriptionStore } from "../../../store/store";
import { ToastAction } from "@/components/ui/toast";

const CreateChatButton = ({ isLarge }: { isLarge?: boolean }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const subscription = userSubscriptionStore((state) => state.subscription);
  const isPro =
    subscription?.role === "pro" && subscription?.status === "active";

  const createNewChat = async () => {
    if (!session?.user.id) return;

    setLoading(true);
    const chatId = uuidv4();

    const chatsSnapshot = await getDocs(
      chatMembersCollectionGroupRef(session?.user.id!)
    );
    const chatCount = chatsSnapshot.docs.map((doc) => doc.data()).length;
    console.log(chatCount);

    // If not pro, limit chat rooms to 3
    if (!isPro && chatCount >= 3) {
      toast({
        title: "Free plan limit exceeded",
        description:
          "You've exceeded the limit of 3 chat rooms. Delete chat rooms or upgrade to PRO for unlimited chats!",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Upgrade"
            onClick={() => router.push("/register")}
          >
            {" "}
            Upgrade to PRO{" "}
          </ToastAction>
        ),
      });
      return;
    }

    // Alert user
    toast({
      title: "Creating new chat...",
      description: "Hold tight while we create your new chat!",
      duration: 3000,
    });

    // Send data to firestore to create new chat
    await setDoc(addChatRef(chatId, session.user.id), {
      userId: session.user.id!,
      email: session.user.email!,
      timestamp: serverTimestamp(),
      isAdmin: true, // user (chat creator) is admin to current chat
      chatId,
      image: session.user.image || ",",
    })
      .then(() => {
        // If chat is succesfully created, alert user
        toast({
          title: "Success!",
          description: "Your chat has been created!",
          className: "bg-green-600 text-white",
          duration: 2000,
        });

        // ... And route to specific chat url
        router.push(`/chat/${chatId}`);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "There was an error creating your chat",
          duration: 3000,
          variant: "destructive",
        });
      })
      // Regardless of success or failure, set loading to false
      .finally(() => {
        setLoading(false);
      });
  };

  if (isLarge)
    return (
      <div>
        <Button onClick={createNewChat}>
          {loading ? <LoadingSpinner /> : "Create New Chat"}
        </Button>
      </div>
    );

  return (
    <Button variant="ghost" onClick={createNewChat}>
      <MessageSquarePlusIcon />
    </Button>
  );
};

export default CreateChatButton;
