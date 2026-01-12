'use server';

import { generateKeralaPscQuestions } from '@/ai/flows/generate-kerala-psc-questions';
import type { GenerateKeralaPscQuestionsOutput } from '@/ai/flows/generate-kerala-psc-questions';
import { getFirebaseAdmin } from '@/firebase/admin';
import type { QuizAttempt } from '@/lib/types';
import { headers } from 'next/headers';

async function getAuthenticatedUser() {
  const admin = getFirebaseAdmin();
  const authorization = headers().get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
  return null;
}

export async function getQuestionsForTopic(
  topic: string,
  numQuestions: number
): Promise<GenerateKeralaPscQuestionsOutput> {
  const user = await getAuthenticatedUser();
  let excludeQuestions: string[] = [];

  if (user) {
    try {
      const admin = getFirebaseAdmin();
      const attemptsSnapshot = await admin.firestore
        .collection('users')
        .doc(user.uid)
        .collection('quizAttempts')
        .where('topic', '==', topic)
        .get();

      if (!attemptsSnapshot.empty) {
        const previousQuestions = attemptsSnapshot.docs.flatMap(
          doc => (doc.data() as QuizAttempt).questions.map(q => q.question)
        );
        excludeQuestions = [...new Set(previousQuestions)]; // Remove duplicates
      }
    } catch (error) {
      console.error('Error fetching previous questions:', error);
      // Proceed without exclusion if Firestore fetch fails
    }
  }

  try {
    const result = await generateKeralaPscQuestions({ topic, numQuestions, excludeQuestions });
    return result;
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return an empty structure or throw a more specific error
    return { questions: [] };
  }
}
