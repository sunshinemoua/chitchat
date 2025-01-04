"use client";
import { Button } from "@/components/ui/button";
import { addDoc, collection } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { db } from "../../../firebase";

const CheckoutButton = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async () => {
    if (!session?.user.id) return;

    // Push a document into firestore db
    setLoading(true);

    const docRef = await addDoc(
      collection(db, "customers", session.user.id, "checkout_sessions"),
      {
        price: "price_1QdfUqFjtkHrjCdS7xmNolFW",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );
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
