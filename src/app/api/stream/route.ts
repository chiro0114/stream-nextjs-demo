export const runtime = 'nodejs';

export async function GET() {
  const text = '株式会社コードユニット';
  let index = 0;

  const stream = new ReadableStream({
    start(controller) {
      const intervalId = setInterval(() => {
        if (index >= text.length) {
          clearInterval(intervalId);
          controller.close();
          return;
        }

        const chunk = text[index];
        const encoded = new TextEncoder().encode(chunk);
        controller.enqueue(encoded);
        index++;
      }, 500);
    },
  });

  // 返却時にレスポンスヘッダを設定
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
