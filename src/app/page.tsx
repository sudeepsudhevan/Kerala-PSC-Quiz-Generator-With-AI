'use client';

import { useState } from 'react';
import { BookOpenCheck } from 'lucide-react';

import type { Question } from '@/lib/types';
import QuizSetup from '@/components/quiz/quiz-setup';
import QuizView from '@/components/quiz/quiz-view';
import QuizSummary from '@/components/quiz/quiz-summary';

export default function Home() {
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);

  const handleQuizStart = (generatedQuestions: Question[]) => {
    setQuestions(generatedQuestions);
    setScore(0);
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
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-6">
          <BookOpenCheck className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Kerala PSC Genius</h1>
        </div>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-8">
          {quizState === 'setup' && <QuizSetup onQuizStart={handleQuizStart} />}
          {quizState === 'playing' && questions.length > 0 && (
            <QuizView questions={questions} onQuizFinish={handleQuizFinish} />
          )}
          {quizState === 'finished' && (
            <QuizSummary score={score} total={questions.length} onRestart={handleRestart} />
          )}
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
