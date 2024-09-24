"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import LoadingSpinner from "./LoadingSpinner";
import SummarySection from "./SummarySection";
import ErrorMessage from "./ErrorMessage";
import { useAISearch } from "@/hooks/useAISearch";

export default function AISearchLandingPage() {
  const [query, setQuery] = useState("");
  const {
    isSearching,
    isSummarizing,
    searchResults,
    summary,
    error,
    handleSearch
  } = useAISearch(); // Destructure values from hook

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query); // Call the handleSearch function from the hook
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 font-sans">
      <SearchBar query={query} setQuery={setQuery} handleSearch={onSubmitSearch} />

      {isSearching && <LoadingSpinner />}

      {searchResults.length > 0 && <SearchResults searchResults={searchResults} />}

      <SummarySection summary={summary} isSummarizing={isSummarizing} />

      {error && <ErrorMessage error={error} />}
    </div>
  );
}
