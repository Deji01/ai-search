import { Search } from "lucide-react";

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: (e: React.FormEvent) => void;
}

export default function SearchBar({ query, setQuery, handleSearch }: SearchBarProps) {
    return (
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
    );
}
