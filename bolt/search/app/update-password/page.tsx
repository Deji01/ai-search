"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            alert('Password updated successfully!');
            router.push('/');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Update Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">Update Password</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}