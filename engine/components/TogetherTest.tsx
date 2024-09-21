"use client";

import { useState } from "react";

export default function TogetherTest() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [response, setResponse] = useState("");

    const handleTest = async () => {
        if (!query.trim()) {
            setError("Query cannot be empty");
            return;
        }

        setLoading(true);
        setError("");
        setResponse("");

        try {
            const res = await fetch("/api/together", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userMessage: query }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error response:", errorData);
                throw new Error("Failed to generate response");
            }

            const result = await res.json();
            setResponse(result.response);
            console.log("AI response:", result);
        } catch (err) {
            console.error("Error fetching AI response:", err);
            setError("Error generating AI response. Check the console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-2xl font-semibold mb-4">Test Together API</h1>

            <input
                type="text"
                placeholder="Enter query for AI"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full max-w-md p-3 border border-gray-300 rounded mb-4"
            />

            <button
                onClick={handleTest}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                disabled={loading}
            >
                {loading ? "Loading..." : "Test Together API"}
            </button>

            {response && (
                <div className="bg-white p-4 mt-4 rounded shadow-md max-w-md w-full">
                    <h2 className="text-lg font-semibold">AI Response:</h2>
                    <p>{response}</p>
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
