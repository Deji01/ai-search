"use client";

import { useState, useRef, useEffect } from 'react';
import { performSearch } from '@/actions/exa-actions';
import { generateAIResponse } from '@/actions/together-actions';
import ReactMarkdown from 'react-markdown';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [summary, setSummary] = useState('');
    const [messages, setMessages] = useState<{ type: 'search' | 'summary', content: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            console.log(`Searching for: ${query}`);
            const results = await performSearch(query);
            console.log("Search results:", results);
            setSearchResults(results.results);
            setMessages(prev => [...prev, { type: 'search', content: query }]);

            const topFiveSources = results.results.slice(0, 5).map(result => result.text).join("\n\n");
            console.log("Generating summary...");
            const aiSummary = await generateAIResponse(`Summarize the following information about ${query}:\n\n${topFiveSources}`);
            console.log("AI Summary:", aiSummary);
            setSummary(aiSummary);
            setMessages(prev => [...prev, { type: 'summary', content: aiSummary }]);
            setQuery('');
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow overflow-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Search Engine</h1>

                {messages.map((message, index) => (
                    <div key={index} className="mb-6">
                        {message.type === 'search' && (
                            <>
                                <h2 className="text-xl font-semibold mb-2">Search: {message.content}</h2>
                                <div className="overflow-x-auto">
                                    <div className="flex space-x-4 pb-4">
                                        {searchResults.map((result, idx) => (
                                            <a
                                                key={idx}
                                                href={result.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 w-64 p-4 border rounded-lg hover:shadow-lg transition-shadow duration-200"
                                            >
                                                <h3 className="font-semibold mb-2 line-clamp-2">{result.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-3">{result.text}</p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        {message.type === 'summary' && (
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold mb-2">AI Summary:</h2>
                                <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                                    <ReactMarkdown className="prose max-w-none">
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white shadow-md z-10">
                <div className="flex">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask follow-up question"
                        className="flex-grow border border-gray-300 rounded-l px-4 py-2"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}