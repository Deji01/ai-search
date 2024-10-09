import { SearchResults } from '@/components/search-results';
import { Header } from '@/components/header';

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Search Results for &quot;{query}&quot;</h1>
        <SearchResults query={query} />
      </main>
    </div>
  );
}