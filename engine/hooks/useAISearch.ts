import { useState } from "react";
import { SearchResult } from "@/types/search";

export const useAISearch = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [summary, setSummary] = useState("");
    const [error, setError] = useState("");

    const handleSearch = async (query: string) => {
        if (query.trim()) {
            setIsSearching(true);
            setSearchResults([]);
            setSummary("");
            setError("");

            try {
                // Fetch Exa results
                const exaResponse = await fetch("/api/exa", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query }),
                });

                if (!exaResponse.ok) throw new Error("Failed to fetch Exa results");

                const exaResults = await exaResponse.json();
                setSearchResults(exaResults); // Display Exa results
                setIsSearching(false); // Stop loading spinner for Exa

                // Start generating summary using Exa results
                setIsSummarizing(true); // Show summary loading spinner

                const summaryResponse = await fetch("/api/summary", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query,
                        results: exaResults, // Pass Exa results to the summary API
                    }),
                });

                if (!summaryResponse.ok) throw new Error("Failed to generate summary");

                const { summary } = await summaryResponse.json();
                setSummary(summary);
            } catch (error) {
                console.error("Search failed:", error);
                setError("Failed to fetch search results or generate summary. Please try again.");
            } finally {
                setIsSearching(false);
                setIsSummarizing(false);
            }
        }
    };

    return {
        isSearching,
        isSummarizing,
        searchResults,
        summary,
        error,
        handleSearch,
    };
};
