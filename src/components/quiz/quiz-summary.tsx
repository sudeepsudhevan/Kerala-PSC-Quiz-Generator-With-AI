'use client';

import { Award, RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type QuizSummaryProps = {
  score: number;
  total: number;
  onRestart: () => void;
};

export default function QuizSummary({ score, total, onRestart }: QuizSummaryProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const performanceMessage =
    percentage >= 80 ? 'Excellent work!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!';

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Quiz Completed!</CardTitle>
          <CardDescription>{performanceMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-5xl font-bold text-primary">
            {score} / {total}
          </p>
          <p className="text-xl text-muted-foreground">
            You scored {percentage}%
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={onRestart} className="w-full" size="lg">
            <RotateCw className="mr-2 h-4 w-4" />
            Start a New Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
