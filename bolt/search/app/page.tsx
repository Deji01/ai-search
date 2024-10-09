import { SearchForm } from '@/components/search-form';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">AI Search & Chat</h1>
        <SearchForm />
      </main>
    </div>
  );
}