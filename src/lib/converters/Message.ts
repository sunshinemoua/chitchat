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
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { LanguagesSupported } from "../../../types/Languages";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface Message {
  id?: string;
  input: string;
  timestamp: Date;
  user: User;
  translated?: {
    [K in LanguagesSupported]?: string;
  };
}

// Converts chat members obj to and from Firestore docs
const messageConverter: FirestoreDataConverter<Message> = {
  // Push data to Firestore db -- convert chat members obj to Firestore doc
  toFirestore: (message: Message): DocumentData => {
    return {
      input: message.input,
      timestamp: message.timestamp,
      user: message.user,
    };
  },

  // Pull data from Firestore db
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Message => {
    // Convert Firestore doc snapshot to chat members obj
    const data = snapshot.data(options);

    const message: Message = {
      id: snapshot.id,
      input: data.input,
      timestamp: data.timestamp?.toDate(),
      user: data.user,
      translated: data.translated,
    };

    return message;
  },
};

// Firestore references for type safety

// Direct reference to chats
export const messagesRef = (chatId: string) =>
  collection(db, "chats", chatId, "messages").withConverter(messageConverter);

// Reference to first 25 messages
export const limitedMessagesRef = (chatId: string) =>
  query(messagesRef(chatId), limit(25));

// Reference to all messages based on timestamp
export const sortedMessagesRef = (chatId: string) =>
  query(messagesRef(chatId), orderBy("timestamp", "asc"));

// Reference to last message sent or received
export const lastMessageRef = (chatId: string) =>
  query(query(messagesRef(chatId), limit(1)), orderBy("timestamp", "desc"));
