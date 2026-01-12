'use server';

import { generateKeralaPscQuestions } from '@/ai/flows/generate-kerala-psc-questions';
import type { GenerateKeralaPscQuestionsOutput } from '@/ai/flows/generate-kerala-psc-questions';

export async function getQuestionsForTopic(
  topic: string
): Promise<GenerateKeralaPscQuestionsOutput> {
  try {
    // We use 10 questions for a better user experience, as 100 can be slow.
    const result = await generateKeralaPscQuestions({ topic, numQuestions: 10 });
    return result;
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return an empty structure or throw a more specific error
    return { questions: [] };
  }
}
