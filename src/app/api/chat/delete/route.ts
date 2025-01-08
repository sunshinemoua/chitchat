import { NextResponse } from "next/server";
import { adminDb } from "../../../../../firebase-admin";

// Delete request
export async function DELETE(req: Request) {
  const { chatId } = await req.json();

  // Reference to current chat
  const ref = adminDb.collection("chats").doc(chatId);

  // Allow delete quests in bulk -- top level collections
  const bulkWriter = adminDb.bulkWriter();
  const MAX_RETRY_ATTEMPTS = 5;

  // Error handler
  bulkWriter.onWriteError((error) => {
    if (error.failedAttempts < MAX_RETRY_ATTEMPTS) {
      return true;
    } else {
      console.log("Failed write at documents: ", error.documentRef.path);
      return false;
    }
  });

  try {
    // Delete documents in firestore and all nested subcollections
    await adminDb.recursiveDelete(ref, bulkWriter);
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Promise rejected: ", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
