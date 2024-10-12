"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Search, MessageCircle, User } from 'lucide-react';

export function Header() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="bg-background border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    AI Search & Chat
                </Link>
                <nav className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Collapsible>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost">
                                        History <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="absolute mt-2 p-2 bg-background border rounded-md shadow-md">
                                    <Link href="/history/search">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Search className="mr-2 h-4 w-4" /> Search History
                                        </Button>
                                    </Link>
                                    <Link href="/history/chat">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <MessageCircle className="mr-2 h-4 w-4" /> Chat History
                                        </Button>
                                    </Link>
                                </CollapsibleContent>
                            </Collapsible>
                            <Link href="/profile">
                                <Button variant="ghost">
                                    <User className="mr-2 h-4 w-4" /> Profile
                                </Button>
                            </Link>
                            <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                    )}
                    <ModeToggle />
                </nav>
            </div>
        </header>
    );
}