"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';

export default function ProfilePage() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const getProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', user.id)
                        .single();

                    if (error) throw error;
                    if (data) {
                        setUsername(data.username || '');
                    }
                } else {
                    throw new Error('No user found');
                }
            } catch (error: any) {
                console.error('Error fetching profile:', error);
                setError(error.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [supabase]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user logged in');

            const { error } = await supabase
                .from('profiles')
                .upsert({ id: user.id, username });

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setError(error.message || 'Failed to update profile. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">User Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Button type="submit" className="w-full">Update Profile</Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}