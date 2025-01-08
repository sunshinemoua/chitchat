// Responsible for how we push and pull data into db

import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { User } from "next-auth";

// Converts user obj to and from Firestore docs
const userConverter: FirestoreDataConverter<User> = {
  // Push data to Firestore db -- convert user obj to Firestore doc
  toFirestore: (customer: User): DocumentData => {
    return {
      name: customer.name,
      email: customer.email,
      image: customer.image,
    };
  },

  // Pull data from Firestore db
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User => {
    // Convert Firestore doc snapshot to user obj
    const data = snapshot.data(options);

    const customer: User = {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      image: data.image,
    };

    return customer;
  },
};

// Firestore references for type safety
// Query to return email that matches
export const getUserByEmailRef = (email: string) =>
  query(collection(db, "users"), where("email", "==", email)).withConverter(
    userConverter
  );
