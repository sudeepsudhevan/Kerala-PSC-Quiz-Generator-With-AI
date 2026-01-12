'use server';

import { generateKeralaPscQuestions } from '@/ai/flows/generate-kerala-psc-questions';
import type { GenerateKeralaPscQuestionsOutput } from '@/ai/flows/generate-kerala-psc-questions';

export async function getQuestionsForTopic(
  topic: string,
  numQuestions: number
): Promise<GenerateKeralaPscQuestionsOutput> {
  try {
    const result = await generateKeralaPscQuestions({ topic, numQuestions });
    return result;
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return an empty structure or throw a more specific error
    return { questions: [] };
  }
}
