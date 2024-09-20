"use client"

import { useState, useRef } from "react"
import { Search, Brain } from "lucide-react"
import { motion } from "framer-motion"
import { fetchExaResults, generateStreamingSummary } from "@/actions/search-actions"
import { SearchResult } from "@/types/search"

export default function AISearchLandingPage() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")
  const scrollRef = useRef(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsSearching(true)
      setSearchResults([])
      setSummary("")
      setError("")

      try {
        const results = await fetchExaResults(query)
        setSearchResults(results)
        setIsSearching(false)
        setIsSummarizing(true)

        const response = await generateStreamingSummary(results)
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            setSummary(prev => prev + chunk)
          }
        }
      } catch (error) {
        console.error("Search failed:", error)
        setError("Failed to fetch search results. Please try again.")
      } finally {
        setIsSearching(false)
        setIsSummarizing(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 font-sans">
      <form onSubmit={handleSearch}>
        <div className="flex justify-center items-center">
          <input
            type="text"
            placeholder="Enter your query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field"
          />
          <button type="submit">
            <Search className="icon" />
          </button>
        </div>
      </form>

      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="loading-spinner"
        ></motion.div>
      )}

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

      {isSummarizing && (
        <div className="summary-container">
          <Brain className="summary-icon animate-pulse" />
          <h2>Generating AI Summary...</h2>
        </div>
      )}

      {summary && (
        <div className="summary-box">
          <Brain className="summary-icon" />
          <h2>AI Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {error && (
        <div className="error-box">
          <strong>Error: </strong> {error}
        </div>
      )}
    </div>
  )
}

