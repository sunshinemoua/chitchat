"use client";

import { signInWithCustomToken } from "firebase/auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { auth } from "../../../firebase";
import { Session } from "next-auth";

// If session is active and firebaseToken exists, sign in with custom token, else sign out
const syncFirebaseAuth = async (session: Session) => {
  if (session && session?.firebaseToken) {
    try {
      await signInWithCustomToken(auth, session.firebaseToken);
    } catch (error) {
      console.error("Error", error);
    }
  } else if (auth.currentUser) {
    auth.signOut();
  }
};
const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const previousTokenRef = useRef<string | null | undefined>(null);
  // Run syncFirebaseAuth if session is active
  useEffect(() => {
    if (!session || session.firebaseToken === previousTokenRef.current) return;

    previousTokenRef.current = session.firebaseToken;
    syncFirebaseAuth(session);
  }, [session]);

  return <>{children}</>;
};

export default FirebaseAuthProvider;
