"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SearchResult {
    title: string;
    snippet: string;
    url: string;
}

export function SearchResults({ query }: { query: string }) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data.results.slice(0, 5));
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleChatClick = () => {
        router.push(`/chat?q=${encodeURIComponent(query)}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {results.map((result, index) => (
                <Card key={index} className="mb-4">
                    <CardHeader>
                        <CardTitle>{result.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{result.snippet}</p>
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {result.url}
                        </a>
                    </CardContent>
                </Card>
            ))}
            <div className="mt-8 text-center">
                <Button onClick={handleChatClick}>Start AI Chat</Button>
            </div>
        </div>
    );
}