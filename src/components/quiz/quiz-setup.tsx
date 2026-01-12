'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getQuestionsForTopic } from '@/app/actions';
import type { Question } from '@/lib/types';
import { Loader } from '@/components/loader';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
});

type QuizSetupProps = {
  onQuizStart: (questions: Question[]) => void;
};

export default function QuizSetup({ onQuizStart }: QuizSetupProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'History of Kerala',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const result = await getQuestionsForTopic(values.topic);
      if (result.questions && result.questions.length > 0) {
        onQuizStart(result.questions);
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'The AI could not generate questions for this topic. Please try another one.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Something went wrong while generating the quiz. Please try again.',
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Generate Your Quiz</CardTitle>
              <CardDescription>Enter a topic from the Kerala PSC syllabus to start.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Indian Constitution" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4" />
                    Generating Quiz...
                  </>
                ) : (
                  'Start Quiz'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
