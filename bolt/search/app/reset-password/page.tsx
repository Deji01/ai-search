"use client"

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const supabase = createClientComponentClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            if (error) throw error;
            alert('Password reset email sent. Check your inbox.');
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Failed to send reset email. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">Send Reset Email</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}