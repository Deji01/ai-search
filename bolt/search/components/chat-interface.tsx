"use client"

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import { nanoid } from 'nanoid';

export function ChatInterface({ initialQuery }: { initialQuery: string }) {
    const [query, setQuery] = useState(initialQuery);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        initialMessages: [{ id: nanoid(), role: 'user', content: initialQuery }],
    });

    const handleQuerySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(e);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)]">
            <ScrollArea className="flex-grow mb-4">
                {messages.map((message) => (
                    <Card key={message.id} className="mb-4">
                        <CardContent className="p-4">
                            <p className="font-semibold">{message.role === 'user' ? 'You' : 'AI'}:</p>
                            <p>{message.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </ScrollArea>
            <form onSubmit={handleQuerySubmit} className="flex space-x-2">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-grow"
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
}