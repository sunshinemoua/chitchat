// Responsible for how we push and pull data into db

import {
  collection,
  collectionGroup,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";

export interface ChatMembers {
  userId: string;
  email: string;
  timestamp: Date | null;
  isAdmin: boolean;
  chatId: string;
  image: string;
}

// Converts chat members obj to and from Firestore docs
const chatMembersConverter: FirestoreDataConverter<ChatMembers> = {
  // Push data to Firestore db -- convert chat members obj to Firestore doc
  toFirestore: (member: ChatMembers): DocumentData => {
    return {
      userId: member.userId,
      email: member.email,
      timestamp: member.timestamp,
      isAdmin: !!member.isAdmin,
      chatId: member.chatId,
      image: member.image,
    };
  },

  // Pull data from Firestore db
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ChatMembers => {
    // Convert Firestore doc snapshot to chat members obj
    const data = snapshot.data(options);

    const member: ChatMembers = {
      userId: snapshot.id,
      email: data.email,
      timestamp: data.timestamp,
      isAdmin: !!data.isAdmin,
      chatId: data.chatId,
      image: data.image,
    };

    return member;
  },
};

// Firestore references for type safety
export const addChatRef = (chatId: string, userId: string) =>
  doc(db, "chats", chatId, "members", userId).withConverter(
    chatMembersConverter
  );

export const chatMembersRef = (chatId: string) =>
  collection(db, "chats", chatId, "members").withConverter(
    chatMembersConverter
  );
// Check all members in specific chat and return the admin user
export const chatMemberAdminRef = (chatId: string) =>
  query(
    collection(db, "chats", chatId, "members"),
    where("isAdmin", "==", true)
  ).withConverter(chatMembersConverter);

// Query all members to return which chats user is in
export const chatMembersCollectionGroupRef = (userId: string) =>
  query(
    collectionGroup(db, "members"),
    where("userId", "==", userId)
  ).withConverter(chatMembersConverter);
