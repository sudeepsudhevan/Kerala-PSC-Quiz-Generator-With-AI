'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import { getQuestionsForTopic } from '@/app/actions';
import type { Question } from '@/lib/types';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { PSC_TOPICS } from '@/lib/psc-topics';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
});

type QuizSetupProps = {
  onQuizStart: (questions: Question[]) => void;
};

export default function QuizSetup({ onQuizStart }: QuizSetupProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
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
              <CardDescription>Select or type a topic from the Kerala PSC syllabus to start.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Quiz Topic</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value
                              ? PSC_TOPICS.find(topic => topic.value === field.value)?.label ?? field.value
                              : 'Select a topic'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search topic or type your own..."
                            onInput={e => {
                              form.setValue('topic', e.currentTarget.value);
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>No topic found.</CommandEmpty>
                            <CommandGroup>
                              {PSC_TOPICS.map(topic => (
                                <CommandItem
                                  value={topic.label}
                                  key={topic.value}
                                  onSelect={() => {
                                    form.setValue('topic', topic.value);
                                    setPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      topic.value === field.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {topic.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
