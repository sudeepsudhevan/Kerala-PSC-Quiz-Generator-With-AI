'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

import type { Question } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type QuizViewProps = {
  questions: Question[];
  onQuizFinish: (score: number) => void;
};

export default function QuizView({ questions, onQuizFinish }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSubmit = () => {
    if (!selectedOption) return;

    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      onQuizFinish(score);
    }
  };

  const getOptionState = (option: string) => {
    if (!isSubmitted) return 'default';
    if (option === currentQuestion.correctAnswer) return 'correct';
    if (option === selectedOption && option !== currentQuestion.correctAnswer) return 'incorrect';
    return 'default';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedOption ?? ''}
            onValueChange={setSelectedOption}
            disabled={isSubmitted}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => {
              const state = getOptionState(option);
              return (
                <Label
                  key={index}
                  className={cn(
                    'flex items-center space-x-4 rounded-md border p-4 transition-all',
                    'hover:bg-muted/50',
                    isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer',
                    state === 'correct' && 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400',
                    state === 'incorrect' && 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400'
                  )}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} className="shrink-0" />
                  <span className="flex-1">{option}</span>
                  {isSubmitted && state === 'correct' && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />}
                  {isSubmitted && state === 'incorrect' && <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />}
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          {isSubmitted && (
            <Alert className="border-accent bg-accent/10">
              <Lightbulb className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent font-bold">Explanation</AlertTitle>
              <AlertDescription className="text-foreground/80">
                {currentQuestion.explanation || 'No explanation available.'}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={isSubmitted ? handleNext : handleSubmit} size="lg">
            {isSubmitted ? (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz') : 'Submit Answer'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
