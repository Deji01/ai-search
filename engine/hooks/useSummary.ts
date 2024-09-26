import { useState } from "react";
import { SearchResult } from "@/types/search";

export const useSummary = () => {
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState("");
    const [error, setError] = useState("");

    const generateSummary = async (query: string, exaResults: SearchResult[]) => {
        if (!exaResults || exaResults.length === 0) {
            setError("No Exa results to summarize.");
            return;
        }

        setIsSummarizing(true);
        setSummary("");
        setError("");

        try {
            // Send Exa results to Together summary API
            const response = await fetch("/api/summary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                    results: exaResults,
                }),
            });

            if (!response.ok) throw new Error("Failed to generate summary");

            const { summary } = await response.json();
            setSummary(summary);
        } catch (error: any) {
            console.error("Summary generation failed:", error);
            setError(error.message || "Failed to generate summary. Please try again.");
        } finally {
            setIsSummarizing(false);
        }
    };

    return {
        isSummarizing,
        summary,
        error,
        generateSummary,
    };
};
