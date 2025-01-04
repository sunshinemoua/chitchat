"use client";

import { signInWithCustomToken } from "firebase/auth";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { auth } from "../../../firebase";
import { Session } from "next-auth";

// If session is active and firebaseToken exists, sign in with custom token, else sign out
const syncFirebaseAuth = async (session: Session) => {
  if (session && session.firebaseToken) {
    try {
      await signInWithCustomToken(auth, session.firebaseToken);
    } catch (error) {
      console.error("Error", error);
    }
  } else {
    auth.signOut();
  }
};
const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  // Run syncFirebaseAuth if session is active
  useEffect(() => {
    if (!session) return;

    syncFirebaseAuth(session);
  }, [session]);

  return <>{children}</>;
};

export default FirebaseAuthProvider;
