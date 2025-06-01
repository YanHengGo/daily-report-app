import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">日報投稿</h1>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">日付</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">作業内容</label>
            <textarea
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
      </div>
    </div>
  );
}
