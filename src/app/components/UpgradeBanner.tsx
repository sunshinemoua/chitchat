"use client";
import React from "react";
import { userSubscriptionStore } from "../../../store/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const UpgradeBanner = () => {
  const subscription = userSubscriptionStore((state) => state.subscription);
  const isPro = subscription?.role === "pro";
  const router = useRouter();

  if (subscription === undefined || isPro) return null;

  return (
    <Button
      onClick={() => router.push("/register")}
      className="w-full rounded-none bg-gradient-to-r from-[#341087] to-[#e935c1] text-center text-white px-5 py-2 hover:from-[#341087] hover:to-[#e935c1] hover:shadow-md hover:opacity-75 transition-all"
    >
      Upgrade to Pro to unlock all features!
    </Button>
  );
};

export default UpgradeBanner;
