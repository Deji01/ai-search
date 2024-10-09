import { Header } from '@/components/header';
import { SearchHistory } from '@/components/search-history';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Search History</h1>
        <SearchHistory />
      </main>
    </div>
  );
}