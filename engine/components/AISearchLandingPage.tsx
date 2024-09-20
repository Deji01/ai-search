"use client";

import { useState, useRef } from "react";
import { Search, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { SearchResult } from "@/types/search";

export default function AISearchLandingPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      setSearchResults([]);
      setSummary("");
      setError("");

      // Start Exa API request
      try {
        // Call the Exa API route
        const response = await fetch("/api/exa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error("Failed to fetch Exa results");

        const results = await response.json();
        setSearchResults(results); // Display Exa results as they arrive
        setIsSearching(false);     // Stop showing loading spinner for Exa

        // Start generating summary asynchronously after Exa results are displayed
        setIsSummarizing(true); // Show summary loading spinner

        const summaryResponse = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!summaryResponse.ok) throw new Error("Failed to generate summary");

        const { summary } = await summaryResponse.json();
        setSummary(summary);
      } catch (error) {
        console.error("Search failed:", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsSearching(false);
        setIsSummarizing(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 font-sans">
      <form onSubmit={handleSearch} className="w-full max-w-lg">
        <div className="flex justify-center items-center space-x-2">
          <input
            type="text"
            placeholder="Enter your query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 px-6 text-xl rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-lg transition-all duration-300"
          />
          <button type="submit" className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">
            <Search className="w-8 h-8" />
          </button>
        </div>
      </form>

      {/* Show a loading spinner while searching for Exa results */}
      {isSearching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-spinner"></motion.div>
      )}

      {/* Show Exa results as soon as they are ready */}
      {searchResults.length > 0 && (
        <div className="results-container">
          {searchResults.map((result, index) => (
            <div key={index} className="result-item">
              <h3>{result.title}</h3>
              <p>{result.snippet}</p>
            </div>
          ))}
        </div>
      )}

      {/* Show summary generation spinner while waiting for summary */}
      {isSummarizing && (
        <div className="summary-container">
          <Brain className="summary-icon animate-pulse" />
          <h2>Generating AI Summary...</h2>
        </div>
      )}

      {/* Show summary when it is ready */}
      {summary && (
        <div className="summary-box">
          <Brain className="summary-icon" />
          <h2>AI Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {/* Show error message if any */}
      {error && (
        <div className="error-box">
          <strong>Error: </strong> {error}
        </div>
      )}
    </div>
  );
}
