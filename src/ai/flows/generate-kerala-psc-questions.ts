// use server'

/**
 * @fileOverview Generates Kerala PSC multiple-choice questions.
 *
 * - generateKeralaPscQuestions - A function that generates Kerala PSC questions.
 * - GenerateKeralaPscQuestionsInput - The input type for the generateKeralaPscQuestions function.
 * - GenerateKeralaPscQuestionsOutput - The return type for the generateKeralaPscQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateKeralaPscQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate questions.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateKeralaPscQuestionsInput = z.infer<typeof GenerateKeralaPscQuestionsInputSchema>;

const GenerateKeralaPscQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.string(),
      explanation: z.string().optional(),
    })
  ),
});
export type GenerateKeralaPscQuestionsOutput = z.infer<typeof GenerateKeralaPscQuestionsOutputSchema>;

export async function generateKeralaPscQuestions(
  input: GenerateKeralaPscQuestionsInput
): Promise<GenerateKeralaPscQuestionsOutput> {
  return generateKeralaPscQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateKeralaPscQuestionsPrompt',
  input: {schema: GenerateKeralaPscQuestionsInputSchema},
  output: {schema: GenerateKeralaPscQuestionsOutputSchema},
  prompt: `You are an expert in Kerala Public Service Commission (PSC) exams. Generate multiple-choice questions based on the given topic.  Each question should have 4 options, one of which is the correct answer. The questions should be diverse and cover different aspects of the topic.

Topic: {{{topic}}}
Number of Questions: {{{numQuestions}}}

Output the questions in JSON format, including the question text, options, correct answer, and a brief explanation for each question.  Make sure that the correct answer is one of the options provided.  Explanations are optional.

Example:
{
  "questions": [
    {
      "question": "What is the capital of Kerala?",
      "options": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
      "correctAnswer": "Thiruvananthapuram",
      "explanation": "Thiruvananthapuram is the capital city of Kerala located in the southern part of the state."
    },
    {
      "question": "Which river is known as the 'Lifeline of Kerala'?",
      "options": ["Periyar", "Bharathapuzha", "Pamba", "Chaliyar"],
      "correctAnswer": "Periyar",
      "explanation": "The Periyar River is the longest river in Kerala and is known as the 'Lifeline of Kerala' due to its importance as a source of water and irrigation."
    }
  ]
}
`,
});

const generateKeralaPscQuestionsFlow = ai.defineFlow(
  {
    name: 'generateKeralaPscQuestionsFlow',
    inputSchema: GenerateKeralaPscQuestionsInputSchema,
    outputSchema: GenerateKeralaPscQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
