# 📘 daily-report-app（Firebase × Next.js）

このアプリは、**Firebase認証とFirestore** を活用して、ユーザーが「日報」を投稿・一覧・編集・削除できる**フルスタックWebアプリケーション**です。

## 🔧 主な機能

- 🔐 Firebase認証（メール / パスワード）
- 📝 日報投稿フォーム
- 📂 Firestoreへの保存
- 📋 日報一覧表示（自動更新）
- ✏️ 編集機能
- 🗑️ 削除機能
- 🌙 Tailwindで簡易ダークモード対応
- 🚀 Vercelデプロイ対応

## 🚀 デプロイURL

https://daily-report-app-psi.vercel.app

## 🛠️ 使用技術スタック

- [Next.js](https://nextjs.org/) (App Router / TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://console.firebase.google.com/u/0/)（Auth / Firestore）
- [Vercel](https://vercel.com/)（自動デプロイ）

## 🧪 ローカル開発環境のセットアップ

```bash
git clone https://github.com/YanHengGo/daily-report-app.git
cd daily-report-app
npm install
npm run dev
