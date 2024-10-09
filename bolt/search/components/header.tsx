import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
    return (
        <header className="bg-background border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    AI Search & Chat
                </Link>
                <nav className="flex items-center space-x-4">
                    <Link href="/history">
                        <Button variant="ghost">History</Button>
                    </Link>
                    <ModeToggle />
                </nav>
            </div>
        </header>
    );
}