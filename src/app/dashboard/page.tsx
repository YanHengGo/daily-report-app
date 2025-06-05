'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { saveDailyReport } from '@/lib/firestore';
import { getDocs } from 'firebase/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
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
  const [reports, setReports] = useState<DocumentData[]>([]); // 一覧データ
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
// ✅ [1] ユーザー認証を監視する useEffect
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
  
  // ✅ [2] user がセットされたら Firestore を監視開始
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

  // Firestoreから日報を取得
  const fetchReports = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'reports'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(docs);
    } catch (error) {
      console.error('一覧取得エラー:', error);
    }
  };

  // 投稿処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveDailyReport(date, content);
      alert('日報を保存しました！');
      setContent('');
      fetchReports(user!.uid); // 再読み込み
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

        {/* 投稿フォーム */}
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

        {/* 日報一覧 */}
        <div>
          <h2 className="text-lg font-bold mb-2">過去の日報</h2>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-sm">まだ日報がありません。</p>
          ) : (
            <ul className="space-y-2">
              {reports.map((report) => (
                <li key={report.id} className="border rounded p-3 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-1">📅 {report.date}</p>
                  <p className="text-gray-800 whitespace-pre-line mb-2">{report.content}</p>

                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => handleEdit(report.id, report.content)}
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
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ログアウト */}
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