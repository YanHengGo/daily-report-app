'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from "@/lib/firebase";
import { saveDailyReport } from '@/lib/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe(); // クリーンアップ
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("投稿開始:", { date, content });
  
    try {
      const docId = await saveDailyReport(date, content);
      console.log("Firestore保存成功: ", docId);
      alert("日報を保存しました！");
      setContent('');
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました。");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">読み込み中...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">ダッシュボード</h1>
        <p className="mb-6 text-center">
          ようこそ、<span className="font-semibold">{user.email}</span> さん！
        </p>

        {/* 日報投稿フォーム */}
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

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}