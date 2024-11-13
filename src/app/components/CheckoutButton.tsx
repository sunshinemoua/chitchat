"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React from "react";

const CheckoutButton = () => {
  const { data: session } = useSession();

  const createCheckoutSession = async () => {
    if (!session) return;
  };

  return (
    <Button
      onClick={() => createCheckoutSession()}
      className="mt-8 bg-indigo-600 text-white hover:bg-indigo-500"
    >
      Sign Up
    </Button>
  );
};

export default CheckoutButton;
