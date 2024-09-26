import { useState } from "react";
import { SearchResult } from "@/types/search";

export const useExaSearch = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [error, setError] = useState("");

    const searchExa = async (query: string) => {
        if (!query.trim()) {
            setError("Please enter a valid query.");
            return;
        }

        setIsSearching(true);
        setSearchResults([]);
        setError("");

        try {
            // Send query to Exa search API
            const response = await fetch("/api/exa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) throw new Error("Failed to fetch Exa results");

            const results = await response.json();

            if (results.length === 0) {
                throw new Error("No results found.");
            }

            setSearchResults(results); // Set Exa results
        } catch (error: any) {
            console.error("Exa search failed:", error);
            setError(error.message || "Failed to fetch search results. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    return {
        isSearching,
        searchResults,
        error,
        searchExa,
    };
};
