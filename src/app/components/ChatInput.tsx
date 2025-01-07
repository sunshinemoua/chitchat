"use client";
import { useSession } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  limitedMessagesRef,
  messagesRef,
  User,
} from "@/lib/converters/Message";
import { addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { userSubscriptionStore } from "../../../store/store";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  input: z.string().max(1000),
});

const ChatInput = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { subscription } = userSubscriptionStore();
  const isPro =
    subscription?.role === "pro" && subscription?.status === "active";

  // Define form with RHK (useForm)
  // Extract formSchema type with z.infer
  // Pass schema into zodResolver for validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  // Submit Handler to send message to firestore
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.input.length === 0) return;
    if (!session?.user) return;

    const messageCount = (await getDocs(limitedMessagesRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    if (!isPro && messageCount >= 25) {
      toast({
        title: "Free plan limit exceeded",
        description:
          "You've exceeded the FREE plam limit of 25 messages per chat. Upgrade to PRO for unlimited chat messages!",
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
    }

    // Get user info from session
    const userToStore: User = {
      id: session.user.id!,
      name: session.user.name!,
      email: session.user.email!,
      image: session.user.image || "",
    };

    // Pass chatId to messagesRef and save input to messages collection
    addDoc(messagesRef(chatId), {
      input: values.input,
      timestamp: serverTimestamp(),
      user: userToStore,
    });
    form.reset();
  };

  return (
    <div className="sticky bottom-0">
      {/* Create form with Shadcn component */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-white border dark:bg-slate-800 hover:border-1"
        >
          <FormField
            control={form.control} // Connects component to RHF form context--manages form state
            name="input"
            // Extract { field } to bind props to Input for event handling and values
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="border-none bg-transparent dark:placeholder:text-white/70"
                    placeholder="Enter your message in ANY language..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit" className="bg-violet-600 text-white">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;
