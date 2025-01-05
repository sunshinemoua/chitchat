// Responsible for how we push and pull data into db

import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { Subscription } from "../../../types/Subscription";
import { db } from "../../../firebase";

// Converts Subscription obj to and from Firestore docs
const subscriptionConverter: FirestoreDataConverter<Subscription> = {
  // Push data to Firestore db -- convert Subscription obj to Firestore doc
  toFirestore: (subscription: Subscription): DocumentData => {
    return {
      ...subscription,
    };
  },

  // Pull data from Firestore db
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Subscription => {
    // Convert Firestore doc snapshot to Subscription obj
    const data = snapshot.data(options);

    const sub: Subscription = {
      id: snapshot.id,
      metadata: data.metadata ?? {},
      stripeLink: data.stripeLink,
      role: data.role,
      quantity: data.quantity,
      items: data.items ?? [],
      product: data.product,
      price: data.price,
      prices: data.prices ?? [],
      payment_method: data.payment_method,
      latest_invoice: data.latest_invoice,
      status: data.status,
      cancel_at_period_end: data.cancel_at_period_end,
      created: data.created,
      current_period_start: data.current_period_start,
      current_period_end: data.current_period_end,
      ended_at: data.ended_at,
      cancel_at: data.cancel_at,
      canceled_at: data.canceled_at,
      trial_start: data.trial_start,
      trial_end: data.trial_end,
    };

    return sub;
  },
};

// Firestore reference for type safety
export const subscriptionRef = (userId: string) =>
  collection(db, "customers", userId, "subscriptions").withConverter(
    subscriptionConverter
  );
