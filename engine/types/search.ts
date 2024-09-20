export interface SearchResult {
    title: string
    url: string
    snippet: string
    published_date?: string
    author?: string
}

export interface SearchResponse {
    results: SearchResult[]
    summary: string
}