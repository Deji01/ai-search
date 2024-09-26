"use client";

import { useState } from "react";
import { useExaSearch } from "@/hooks/useExaSearch";
import { useSummary } from "@/hooks/useSummary";
import { Search, Brain } from "lucide-react";

export default function AISearchLandingPage() {
  const [query, setQuery] = useState("");
  const { isSearching, searchResults, error: searchError, searchExa } = useExaSearch();
  const { isSummarizing, summary, error: summaryError, generateSummary } = useSummary();

  // Handle search for Exa
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    searchExa(query);
    setQuery(""); // Clear input field after search
  };

  // Handle summary generation
  const handleGenerateSummary = () => {
    generateSummary(query, searchResults);
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

      {/* Error messages */}
      {searchError && <div className="error-box"><strong>Error: </strong>{searchError}</div>}
      {summaryError && <div className="error-box"><strong>Error: </strong>{summaryError}</div>}

      {/* Exa search loading spinner */}
      {isSearching && <div className="loading-spinner">Searching Exa...</div>}

      {/* Exa search results */}
      {searchResults.length > 0 && (
        <div className="results-container">
          {searchResults.map((result, index) => (
            <div key={index} className="result-item">
              <h3>{result.title}</h3>
              <p>{result.snippet}</p>
            </div>
          ))}
          <button
            onClick={handleGenerateSummary}
            className="mt-4 p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
          >
            <Brain className="w-8 h-8 inline-block mr-2" /> Generate AI Summary
          </button>
        </div>
      )}

      {/* Summary generation loading spinner */}
      {isSummarizing && <div className="loading-spinner">Generating summary...</div>}

      {/* AI Summary */}
      {summary && (
        <div className="summary-box">
          <h2>AI Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
