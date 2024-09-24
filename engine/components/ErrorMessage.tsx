interface ErrorMessageProps {
    error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
    return (
        <div className="error-box">
            <strong>Error: </strong> {error}
        </div>
    );
}
