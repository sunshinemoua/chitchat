"use client";

import { subscriptionRef } from "@/lib/converters/Subscription";
import { onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { userSubscriptionStore } from "../../../store/store";

const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const setSubscription = userSubscriptionStore(
    (state) => state.setSubscription
  );

  // Update subscription state if session is active
  useEffect(() => {
    if (!session) return;

    return onSnapshot(
      subscriptionRef(session?.user.id),
      (snapshot) => {
        if (snapshot.empty) {
          console.log("User has NO subscription");
          setSubscription(null);
          return;
        } else {
          console.log("User has subscription");
          setSubscription(snapshot.docs[0].data());
        }
      },
      (error) => {
        console.log("Error retrieving document: " + error);
      }
    );
  }, [session, setSubscription]);

  return <>{children}</>;
};

export default SubscriptionProvider;
