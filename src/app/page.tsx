// src/app/page.tsx

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard"); // ✅ トップページを開いたら /dashboard へ自動遷移
}