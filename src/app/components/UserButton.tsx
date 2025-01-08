"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { userSubscriptionStore } from "../../../store/store";
import { StarIcon } from "lucide-react";
import ManageAccountButton from "./ManageAccountButton";

const UserButton = ({ session }: { session: Session | null }) => {
  const subscription = userSubscriptionStore((state) => state.subscription);

  // If not signed in, render button and redirect to Google login page
  if (!session)
    return (
      <Button variant={"outline"} onClick={() => signIn()}>
        Sign In
      </Button>
    );

  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            name={session.user?.name || "Username"}
            image={session.user?.image || "https://github.com/shadcn.png"}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {session.user?.name || "My Account"}
            {subscription?.role === "pro" && (
              <div className="text-[#e935c1] flex items-center justify-around text-xs mt-1 animate-pulse">
                <StarIcon fill="#e935c1" size={18} />
                <p>PRO Member</p>
              </div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {subscription?.role === "pro" && (
            <>
              <DropdownMenuItem>
                <ManageAccountButton />
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default UserButton;
