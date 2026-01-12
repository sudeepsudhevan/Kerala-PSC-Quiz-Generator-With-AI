'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { collection, query, orderBy } from 'firebase/firestore';
import { History, BookOpenCheck, Home } from 'lucide-react';
import { format } from 'date-fns';

import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { QuizAttempt } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/loader';

export default function HistoryPage() {
  const { firestore, user, isUserLoading } = useFirebase();

  const historyQuery = useMemoFirebase(
    () => (user && firestore ? query(collection(firestore, 'users', user.uid, 'quizAttempts'), orderBy('completedAt', 'desc')) : null),
    [firestore, user]
  );
  
  const { data: attempts, isLoading, error } = useCollection<QuizAttempt>(historyQuery);

  const renderContent = () => {
    if (isUserLoading || isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8" />
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500">Error loading quiz history: {error.message}</div>;
    }

    if (!user) {
      return (
        <div className="text-center">
          <p className="mb-4">Please sign in to see your quiz history.</p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Go to Homepage
            </Link>
          </Button>
        </div>
      );
    }
    
    if (!attempts || attempts.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          <p className="mb-4">You haven't completed any quizzes yet.</p>
          <Button asChild>
            <Link href="/">Start a New Quiz</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {attempts.map(attempt => (
          <Card key={attempt.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-xl">
                    Quiz from {format(new Date(attempt.completedAt), "MMMM d, yyyy 'at' h:mm a")}
                  </CardTitle>
                  <CardDescription>
                    Score: {attempt.score} / {attempt.total}
                  </CardDescription>
                </div>
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/history/${attempt.id}`}>View Details</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <BookOpenCheck className="h-8 w-8 text-primary" />
             <h1 className="text-2xl font-bold font-headline text-primary">
              <Link href="/">Kerala PSC Genius</Link>
            </h1>
          </div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <History className="h-6 w-6" />
                Quiz History
            </h2>
        </div>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-8">
            {renderContent()}
        </div>
      </main>
       <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built by AI. Powered by Genkit and Next.js.
          </p>
        </div>
      </footer>
    </div>
  );
}
