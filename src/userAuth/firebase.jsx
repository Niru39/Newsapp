// src/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCROVlzaqMZB8KIakFWdv0jmtUH_uHV-R8",
  authDomain: "newsapp-9b4d3.firebaseapp.com",
  projectId: "newsapp-9b4d3",
  storageBucket: "newsapp-9b4d3.appspot.com",
  messagingSenderId: "985419046219",
  appId: "1:985419046219:web:3e560170a5059070dc1cce",
  measurementId: "G-SR45B3J0BS",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);


export async function logUserActivity(userId, activityType, details = {}) {
  if (!userId) return;

  try {
    await addDoc(collection(db, "userActivities"), {
      userId,
      activityType,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
}

export function logAnalyticsEvent(eventName, params = {}) {
  logEvent(analytics, eventName, params);
}
