export type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

export type UserAnswer = string | null;

export type QuizAttempt = {
  id: string;
  userId: string;
  questions: Question[];
  userAnswers: UserAnswer[];
  score: number;
  total: number;
  completedAt: string;
};
