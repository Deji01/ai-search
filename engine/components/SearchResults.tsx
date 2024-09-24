import { SearchResult } from "@/types/search";

interface SearchResultsProps {
    searchResults: SearchResult[];
}

export default function SearchResults({ searchResults }: SearchResultsProps) {
    return (
        <div className="results-container">
            {searchResults.map((result, index) => (
                <div key={index} className="result-item">
                    <h3>{result.title}</h3>
                    <p>{result.snippet}</p>
                </div>
            ))}
        </div>
    );
}
