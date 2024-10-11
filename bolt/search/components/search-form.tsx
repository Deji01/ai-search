"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchForm() {
    const [query, setQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (query.trim()) {
            try {
                // Save search query to history
                const response = await fetch('/api/history', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: query.trim() }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save search history');
                }

                router.push(`/search?q=${encodeURIComponent(query)}`);
            } catch (error: any) {
                console.error('Error saving search history:', error);
                setError(error.message || 'An error occurred while processing your search');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-2xl mx-auto">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex">
                <Input
                    type="text"
                    placeholder="Enter your search query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow"
                />
                <Button type="submit" className="ml-2">
                    <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </div>
        </form>
    );
}