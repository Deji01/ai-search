import { NextResponse } from 'next/server';

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export function handleError(error: unknown) {
    console.error('Error:', error);

    if (error instanceof AppError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}