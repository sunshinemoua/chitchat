"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import useAdminId from "@/hooks/useAdminId";
import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userSubscriptionStore } from "../../../store/store";
import { addChatRef, chatMembersRef } from "@/lib/converters/ChatMembers";
import { getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";
import { getUserByEmailRef } from "@/lib/converters/User";
import ShareLinkButton from "./ShareLinkButton";

const InviteUserButton = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const adminId = useAdminId({ chatId });
  const { subscription } = userSubscriptionStore();
  const isPro =
    subscription?.role === "pro" && subscription?.status === "active";
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInviteLink, setIsOpenInviteLink] = useState(false);

  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
  });

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session?.user.id || values.email.length === 0) return;

    toast({
      title: "Sending invite",
      description: "Please wait while we send the invite!",
    });

    // Call API to reutrn number of users in a chat room
    const usersCount = (await getDocs(chatMembersRef(chatId))).docs.map((doc) =>
      doc.data()
    ).length;

    // Alert member if not Pro and attempting to add more users
    if (!isPro && usersCount >= 2) {
      toast({
        title: "Free plan limit exceeded",
        description:
          "You've exceeded the limit of 2 users per chat. Upgrade to PRO to add more users!",
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

    // Ensure email entered is registered
    const userEmailSnapshot = await getDocs(getUserByEmailRef(values.email));

    // If email is not found in db, alert member
    if (userEmailSnapshot.empty) {
      toast({
        title: "User not found",
        description:
          "Please enter an email address of a registered user OR resend the invitation once they have signed up!",
      });
      return;
    } else {
      // Fetch doc that matches email (only one would be returned)
      const user = userEmailSnapshot.docs[0].data();

      // Call API to add new user data to chat room then alert member
      await setDoc(addChatRef(chatId, user.id), {
        userId: user.id,
        email: user.email!,
        timestamp: serverTimestamp(),
        isAdmin: false, // This user is being invited, therefore, they are NOT an admin
        chatId: chatId,
        image: user.image || "",
      }).then(() => {
        setIsOpen(false);
        toast({
          title: "Added to chat",
          description: "The user has successfully joined!!",
          className: "bg-green-600 text-white",
          duration: 3000,
        });

        // Automatically open share link modal after email is entered
        setIsOpenInviteLink(true);
      });
    }
    form.reset();
  };

  return (
    adminId === session?.user.id && (
      <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              {" "}
              <PlusCircleIcon />
              Add User To Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add User to Chat</DialogTitle>
              <DialogDescription>
                Enter an email address to invite them to this chat! <br />
                <span className="text-violet-400">
                  {" "}
                  Note: User must be registered.
                </span>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2"
              >
                <FormField
                  control={form.control} // Connects component to RHF form context--manages form state
                  name="email"
                  // Extract { field } to bind props to Input for event handling and values
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="john@doe.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <Button
                  type="submit"
                  className="bg-violet-700 text-white hover:bg-violet-500"
                >
                  Send
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Share Link */}
        <ShareLinkButton
          chatId={chatId}
          isOpen={isOpenInviteLink}
          setIsOpen={setIsOpenInviteLink}
        />
      </div>
    )
  );
};

export default InviteUserButton;
