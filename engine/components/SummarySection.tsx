import { Brain } from "lucide-react";

interface SummarySectionProps {
    summary: string;
    isSummarizing: boolean;
}

export default function SummarySection({ summary, isSummarizing }: SummarySectionProps) {
    return (
        <div className="summary-container">
            {isSummarizing && (
                <>
                    <Brain className="summary-icon animate-pulse" />
                    <h2>Generating AI Summary...</h2>
                </>
            )}

            {!isSummarizing && summary && (
                <>
                    <Brain className="summary-icon" />
                    <h2>AI Summary</h2>
                    <p>{summary}</p>
                </>
            )}
        </div>
    );
}
