'use client';

import { useState, useEffect } from 'react';
import { BookOpenCheck, History, LogIn } from 'lucide-react';

import type { Question } from '@/lib/types';
import QuizSetup from '@/components/quiz/quiz-setup';
import QuizView from '@/components/quiz/quiz-view';
import QuizSummary from '@/components/quiz/quiz-summary';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [currentTopic, setCurrentTopic] = useState('');

  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const handleQuizStart = (generatedQuestions: Question[], topic: string) => {
    setQuestions(generatedQuestions);
    setScore(0);
    setCurrentTopic(topic);
    setQuizState('playing');
  };

  const handleQuizFinish = (finalScore: number) => {
    setScore(finalScore);
    setQuizState('finished');
  };

  const handleRestart = () => {
    setQuizState('setup');
    setQuestions([]);
    setScore(0);
    setCurrentTopic('');
  };

  const renderContent = () => {
    if (isUserLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-lg">Please sign in to start the quiz.</p>
          <Button onClick={() => initiateAnonymousSignIn(auth)}>
            <LogIn className="mr-2" />
            Sign In Anonymously
          </Button>
        </div>
      );
    }

    if (quizState === 'setup') {
      return <QuizSetup onQuizStart={handleQuizStart} />;
    }
    if (quizState === 'playing' && questions.length > 0) {
      return <QuizView questions={questions} topic={currentTopic} onQuizFinish={handleQuizFinish} />;
    }
    if (quizState === 'finished') {
      return <QuizSummary score={score} total={questions.length} onRestart={handleRestart} />;
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <BookOpenCheck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">Kerala PSC Genius</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/history">
                <History className="mr-2 h-4 w-4" />
                View History
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-8">{renderContent()}</div>
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
