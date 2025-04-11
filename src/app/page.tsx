'use client';

import React, { useState } from 'react';

export default function Home() {
  const [chunks, setChunks] = useState<string[]>([]);

  const fetchCodeUnitHandler = async () => {
    if (chunks) {
      setChunks([]);
    }

    try {
      const response = await fetch('/api/stream');

      if (!response.body) return;

      // getReaderを実行詩readerを取得
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // whileループで/api/streamの処理が実行するまでデータを取得し続ける
      while (true) {
        // 処理が完了するまではvalueが返却され処理が完了したらvalueはundefinedになり、doneがtrueになる
        const { done, value } = await reader.read();
        if (done) {
          console.log('処理が完了しました。');
          break;
        }
        // valueはUint8Array型で取得されるので、TextDecoderを使用して文字列に変換する
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
            {chunks.map((chunk, i) => {
              return <React.Fragment key={i}>{chunk}</React.Fragment>;
            })}
          </h1>
        </div>
      </div>
    </div>
  );
}
