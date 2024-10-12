"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { SearchHistory } from '@/components/search-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SearchHistoryPage() {
  const [activeTab, setActiveTab] = useState('today');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Search History</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
            <TabsTrigger value="lastWeek">Last Week</TabsTrigger>
            <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <SearchHistory period="today" />
          </TabsContent>
          <TabsContent value="yesterday">
            <SearchHistory period="yesterday" />
          </TabsContent>
          <TabsContent value="lastWeek">
            <SearchHistory period="lastWeek" />
          </TabsContent>
          <TabsContent value="lastMonth">
            <SearchHistory period="lastMonth" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}