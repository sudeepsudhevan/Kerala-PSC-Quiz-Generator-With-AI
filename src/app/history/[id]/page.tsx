'use client';

import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpenCheck, CheckCircle2, Home, XCircle } from 'lucide-react';
import { format } from 'date-fns';

import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import type { QuizAttempt, Question } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function AttemptDetailPage() {
  const { id: attemptId } = useParams<{ id: string }>();
  const { firestore, user, isUserLoading } = useFirebase();

  const attemptDocRef = useMemoFirebase(
    () => (user && firestore && attemptId ? doc(firestore, 'users', user.uid, 'quizAttempts', attemptId) : null),
    [firestore, user, attemptId]
  );
  
  const { data: attempt, isLoading, error } = useDoc<QuizAttempt>(attemptDocRef);

  const renderContent = () => {
    if (isLoading || isUserLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8" />
        </div>
      );
    }
    
    if (error) {
        return <div className="text-center text-red-500">Error loading quiz details: {error.message}</div>;
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

    if (!attempt) {
      return <div className="text-center text-muted-foreground">Quiz attempt not found.</div>;
    }

    const percentage = attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0;

    return (
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Quiz Review</CardTitle>
                <CardDescription>
                    Taken on {format(new Date(attempt.completedAt), "MMMM d, yyyy 'at' h:mm a")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className='space-y-1'>
                        <p className="text-sm font-medium">Final Score</p>
                        <p className="text-2xl font-bold">{attempt.score} / {attempt.total}</p>
                    </div>
                    <div className='space-y-1 text-right'>
                        <p className="text-sm font-medium">Percentage</p>
                        <p className="text-2xl font-bold">{percentage}%</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {attempt.questions.map((question: Question, index: number) => {
          const userAnswer = attempt.userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl leading-relaxed">{index + 1}. {question.question}</CardTitle>
                    {isCorrect ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">Correct</Badge>
                    ) : (
                        <Badge variant="destructive">Incorrect</Badge>
                    )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {question.options.map((option, optionIndex) => {
                  const isUserSelected = userAnswer === option;
                  const isCorrectAnswer = question.correctAnswer === option;
                  
                  let state: 'correct' | 'incorrect' | 'default' = 'default';
                  if (isCorrectAnswer) state = 'correct';
                  else if(isUserSelected && !isCorrectAnswer) state = 'incorrect';

                  return (
                    <div
                      key={optionIndex}
                      className={cn(
                        'flex items-center space-x-4 rounded-md border p-4',
                        state === 'correct' && 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400',
                        state === 'incorrect' && 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400'
                      )}
                    >
                      {state === 'correct' && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />}
                      {state === 'incorrect' && <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />}
                      {state === 'default' && <div className="h-5 w-5" />}
                      
                      <span className="flex-1">{option}</span>
                    </div>
                  );
                })}

                <Alert className={cn(
                    'mt-4',
                    isCorrect ? 'border-green-500 bg-green-50/50' : 'border-amber-500 bg-amber-50/50'
                )}>
                  <AlertTitle className={cn(isCorrect ? 'text-green-700' : 'text-amber-700')}>Explanation</AlertTitle>
                  <AlertDescription className={cn(isCorrect ? 'text-green-800' : 'text-amber-800')}>
                    {question.explanation || 'No explanation provided.'}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          );
        })}
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
          <Button asChild variant="outline">
            <Link href="/history">Back to History</Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
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
