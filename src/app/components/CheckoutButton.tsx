"use client";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { db } from "../../../firebase";
import LoadingSpinner from "./LoadingSpinner";
import { userSubscriptionStore } from "../../../store/store";
import ManageAccountButton from "./ManageAccountButton";
import { Button } from "@/components/ui/button";

const CheckoutButton = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const subscription = userSubscriptionStore((state) => state.subscription);
  const isSubscribed =
    subscription?.status === "active" && subscription?.role === "pro";

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
    <div className="flex flex-col space-y-2">
      {(session && subscription !== null) ||
      (session && subscription === undefined) ||
      loading ? (
        <div className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500">
          <LoadingSpinner />
        </div>
      ) : isSubscribed ? (
        <ManageAccountButton />
      ) : (
        <Button
          onClick={() => createCheckoutSession()}
          className="mt-8 bg-indigo-600 font-semibold text-white hover:bg-indigo-500"
        >
          Sign Up
        </Button>
      )}
    </div>
  );
};

export default CheckoutButton;
