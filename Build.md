# How It's Built

This document provides a technical overview of the Kerala PSC Genius application, detailing its architecture, key components, and data flow.

## 1. Frontend Architecture

The application is built with **Next.js** using the **App Router**, which enables a modern, server-centric architecture.

-   **React Server Components (RSC)**: Most pages and components are initially rendered on the server, reducing the amount of JavaScript sent to the client and improving initial load times.
-   **Client Components**: Components requiring interactivity, state, and lifecycle effects (like the quiz setup form and the quiz view) are marked with the `'use client'` directive. This allows them to run in the browser.
-   **Styling**: The UI is styled with **Tailwind CSS**, and components are sourced from the **ShadCN UI** library, providing a consistent and modern look and feel. The base theme and colors are configured in `src/app/globals.css`.

## 2. Backend & AI Integration

The backend is powered by a combination of Firebase and Genkit for AI functionality.

### Firebase

-   **Authentication**: The app uses **Firebase Authentication** in anonymous mode. When a user first visits, they are automatically signed in anonymously. This creates a unique user ID (`uid`) which is used to store their quiz history without requiring them to create an account.
-   **Firestore Database**: Quiz attempts are stored in a **Firestore** NoSQL database. The data is structured to be user-centric:
    -   `/users/{userId}/quizAttempts/{attemptId}`
    -   This structure ensures that a user's data is isolated and can only be accessed by them, which is enforced by the security rules in `firestore.rules`.
-   **Firebase SDK**: The frontend interacts with Firebase using the client-side SDK. We use custom hooks (`useCollection`, `useDoc`) to subscribe to real-time data from Firestore. Writes to the database are "non-blocking" to keep the UI responsive.

### Genkit & AI

-   **Genkit**: The AI-powered question generation is managed by **Genkit**, a framework for building production-ready AI applications.
-   **AI Flow**: The core logic is in `src/ai/flows/generate-kerala-psc-questions.ts`. This file defines a **Genkit Flow**, which is an instrumented function that calls the Google Gemini model.
-   **Prompt Engineering**: The flow uses a carefully crafted prompt to instruct the Gemini model to generate a specific number of multiple-choice questions on a given topic. It also includes logic to prevent the AI from generating questions that the user has already seen.
-   **Server Actions**: The frontend triggers the AI flow via a Next.js **Server Action** (`getQuestionsForTopic` in `src/app/actions.ts`). This allows the client to call server-side code securely without needing to create a separate API endpoint.

## 3. Data Flow: Generating a Quiz

Here is the step-by-step data flow when a user starts a new quiz:

1.  **User Interaction**: The user selects a topic and the number of questions in the `QuizSetup` component on the homepage.
2.  **Server Action Trigger**: Clicking "Start Quiz" calls the `getQuestionsForTopic` Server Action.
3.  **Fetch Previous Questions**: The Server Action first queries Firestore to get a list of all questions the user has previously answered for the selected topic.
4.  **Invoke AI Flow**: The action then calls the `generateKeralaPscQuestions` Genkit flow, passing the topic, number of questions, and the list of questions to exclude.
5.  **Call Gemini Model**: The Genkit flow sends a formatted prompt to the Google Gemini model. The model returns a list of new, unique questions in a structured JSON format.
6.  **Return to Client**: The Server Action returns the generated questions to the `QuizSetup` component.
7.  **Start Quiz**: The component receives the questions and transitions the UI to the `QuizView` component, starting the quiz.

## 4. Saving Quiz Results

1.  **Quiz Completion**: As the user answers questions, their answers are stored in the state of the `QuizView` component.
2.  **Non-Blocking Write**: When the quiz is finished, the component creates a `quizAttempt` object containing the topic, questions, user's answers, score, and a timestamp.
3.  **Save to Firestore**: This object is saved to the user's `quizAttempts` sub-collection in Firestore using a non-blocking `addDoc` operation. This ensures the UI remains fast and the user can immediately see their summary without waiting for the database write to complete.
4.  **History Page**: The `HistoryPage` (`src/app/history/page.tsx`) uses the `useCollection` hook to subscribe to the `quizAttempts` collection in real-time, displaying a list of all completed quizzes.
