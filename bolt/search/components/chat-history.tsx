"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ChatHistoryItem {
    id: string;
    title: string;
    timestamp: string;
}

export function ChatHistory({ period }: { period: string }) {
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                const response = await fetch(`/api/history/chat?period=${period}`);
                const data = await response.json();
                setHistory(data.history);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [router, supabase, period]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-8">
                <p>No chat history found for this period.</p>
            </div>
        );
    }

    return (
        <div>
            {history.map((item) => (
                <Card key={item.id} className="mb-4">
                    <CardHeader>
                        <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                        <div className="mt-2">
                            <Link href={`/chat/${item.id}`}>
                                <Button variant="outline" size="sm">Continue Chat</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}