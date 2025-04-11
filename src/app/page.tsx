'use client';

import { useState } from 'react';

export default function Home() {
  const [chunks, setChunks] = useState<string[]>([]);

  const fetchCodeUnitHandler = async () => {
    try {
      const response = await fetch('/api/stream');

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('処理が完了しました。');
          break;
        }
        const chunkText = decoder.decode(value, { stream: true });
        setChunks((prev) => [...prev, chunkText]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="py-10 px-20">
      <h1 className="text-2xl font-bold">ストリーム体験サイト</h1>
      <div className="flex gap-10 mt-6">
        <div className="flex-1">
          <button
            onClick={fetchCodeUnitHandler}
            className="py-2 px-8 text-lg  bg-blue-600 rounded-full text-white"
          >
            実行
          </button>
          <h1 className="text-center text-2xl">
            {chunks.map((chunk) => {
              return <span key={chunk}>{chunk}</span>;
            })}
          </h1>
        </div>
      </div>
    </div>
  );
}
