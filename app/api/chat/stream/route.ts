import { chatEmitter } from '@/lib/chatEmitter';
import type { Message as ChatMessage } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return new Response('Missing userId', { status: 400 });

  let keepAlive: NodeJS.Timeout;
  let send: (msg: ChatMessage) => void;
  const stream = new ReadableStream({
    start(controller) {
      send = (msg: ChatMessage) => {
        if (msg.senderId === userId || msg.recipientId === userId) {
          controller.enqueue(`data: ${JSON.stringify(msg)}\n\n`);
        }
      };
      keepAlive = setInterval(() => {
        controller.enqueue(':keep-alive\n\n');
      }, 20000);
      chatEmitter.on('message', send);
    },
    cancel() {
      clearInterval(keepAlive);
      chatEmitter.off('message', send);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
