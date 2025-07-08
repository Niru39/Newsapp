// logUserActivity.js
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";


export const logUserActivity = async (
  userId,
  username,
  type,
  details = {},
  content = null,
  isAdminAction = false,
  targetUserId = null
) => {
  if (!userId) {
    console.error("Missing userId: cannot log activity.");
    return;
  }

  const activity = {
    userId,
    username,
    type,
    details,
    content,
    isAdminAction,
    targetUserId,
    timestamp: serverTimestamp(),
  };

  try {
    console.log("Logging user activity:", activity); // Optional debug log
    await addDoc(collection(db, "userActivities"), activity);
  } catch (err) {
    console.error("Failed to log user activity:", err);
  }
};
