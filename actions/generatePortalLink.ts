"use server";

import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "../auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminDb } from "../firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const generatePortalLink = async () => {
  const session = await getServerSession(authOptions);

  // Get current host from request headers for return URL
  const host = (await headers()).get("host");

  if (!session?.user.id) return console.error("No user ID found");

  // If session exists, retrieve user ID
  const {
    user: { id },
  } = session;

  const returnUrl =
    process.env.NODE_ENV === "development"
      ? `http://${host}/register`
      : `https://${host}/register`;

  // Fetch user data from firestore
  const doc = await adminDb.collection("customers").doc(id).get();

  if (!doc.data) return console.error("No data found with user ID: " + id);

  // Fetch customer ID from Stripe
  const stripeId = doc.data()!.stripeId;

  // Create Stripe billing portal session and redirect customer to returnUrl after interaction
  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: returnUrl,
  });

  redirect(stripeSession.url);
};
