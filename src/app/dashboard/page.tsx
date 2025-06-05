'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { saveDailyReport } from '@/lib/firestore';
import { getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData
} from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState('');
  const [reports, setReports] = useState<DocumentData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const startEditing = (reportId: string, currentContent: string) => {
    setEditingId(reportId);
    setEditContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleUpdate = async (id: string) => {
    try {
      const docRef = doc(db, "reports", id);
      await updateDoc(docRef, {
        content: editContent,
      });
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error("編集保存失敗:", error);
      alert("編集に失敗しました");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("この日報を削除してもよろしいですか？");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "reports", id));
      console.log("削除成功:", id);
    } catch (error) {
      console.error("削除失敗:", error);
      alert("削除に失敗しました");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "reports"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveDailyReport(date, content);
      alert('日報を保存しました！');
      setContent('');
    } catch (error) {
      alert('保存に失敗しました');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!user) {
    return <p className="text-center mt-10">読み込み中...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">ダッシュボード</h1>
        <p className="mb-6 text-center">
          ようこそ、<span className="font-semibold">{user.email}</span> さん！
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">作業内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={5}
              placeholder="今日の作業内容を記入してください"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            送信する
          </button>
        </form>

        <div>
          <h2 className="text-lg font-bold mb-2">過去の日報</h2>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-sm">まだ日報がありません。</p>
          ) : (
            <ul className="space-y-2">
              {reports.map((report) => (
                <li key={report.id} className="border rounded p-3 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-1">📅 {report.date}</p>
                  {editingId === report.id ? (
                    <>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full border rounded px-3 py-2 mb-2"
                      />
                      <div className="flex gap-2 text-sm">
                        <button
                          onClick={() => handleUpdate(report.id)}
                          className="text-blue-600 hover:underline"
                        >
                          保存
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:underline"
                        >
                          キャンセル
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-800 whitespace-pre-line">{report.content}</p>
                      <div className="flex gap-2 text-sm mt-2">
                        <button
                          onClick={() => startEditing(report.id, report.content)}
                          className="text-blue-600 hover:underline"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 hover:underline"
                        >
                          削除
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}