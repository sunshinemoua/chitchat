"use client";
import { Button } from "@/components/ui/button";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { db } from "../../../firebase";
import LoadingSpinner from "./LoadingSpinner";

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
        price: "price_1Qdg9WFjtkHrjCdSvUVQPqrf",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    // Create checkout sesion using stripe extension on firebase
    return onSnapshot(docRef, (snap) => {
      const data = snap.data();
      const url = data?.url;
      const error = data?.error;

      // Alert customer of error--inspect cloud func logs in firebase console
      if (error) {
        alert(`An error occured: ${error.message}`);
        setLoading(false);
      }

      // Redirect to stripe checkout page
      if (url) {
        window.location.assign(url);
        setLoading(false);
      }
    });
  };

  return (
    <Button
      onClick={() => createCheckoutSession()}
      className="mt-8 bg-indigo-600 text-white hover:bg-indigo-500"
    >
      {loading ? <LoadingSpinner /> : "Sign Up"}
    </Button>
  );
};

export default CheckoutButton;
