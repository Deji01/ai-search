import { Header } from '@/components/header';
import { ChatInterface } from '@/components/chat-interface';

export default function ChatPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">AI Chat</h1>
        <ChatInterface initialQuery={query} />
      </main>
    </div>
  );
}