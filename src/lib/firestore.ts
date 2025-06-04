// src/lib/firestore.ts
import { db, auth } from "./firebase"; // 相対パスに修正！
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// 日報保存関数
export const saveDailyReport = async (date: string, content: string) => {
  if (!auth.currentUser) {
    throw new Error("ログインしていません");
  }

  const docRef = await addDoc(collection(db, "reports"), {
    uid: auth.currentUser.uid,
    date,
    content,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};