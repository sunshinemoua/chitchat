"use client";
import { useToast } from "@/hooks/use-toast";
import useAdminId from "@/hooks/useAdminId";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DeleteChatButton = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const adminId = useAdminId({ chatId });
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    toast({
      title: "Deleting chat...",
      description: "Please wait while we delete the chat.",
    });

    console.log("Deleting... ", chatId);

    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId: chatId }),
    })
      .then((res) => {
        toast({
          title: "Success!",
          description: "Your chat has been deleted successfully",
          className: "bg-green-600, text-white",
          duration: 3000,
        });
        router.replace("/chat");
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "There was an error deleting your chat",
          variant: "destructive",
        });
      })
      .finally(() => setIsOpen(false));
  };
  return (
    session?.user.id === adminId && (
      <Dialog open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="ml-4">
            Delete Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will delete the chat for ALL users.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 space-x-2">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};

export default DeleteChatButton;
