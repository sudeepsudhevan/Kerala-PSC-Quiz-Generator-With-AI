# Kerala PSC Genius

Kerala PSC Genius is a web application designed to help users prepare for the Kerala Public Service Commission (PSC) exams. It leverages the power of AI to generate dynamic, multiple-choice quizzes on a wide range of topics relevant to the PSC syllabus. The app provides instant feedback, explanations, and tracks user performance over time, offering a personalized and effective learning experience.

## ✨ Features

- **Dynamic Quiz Generation**: Uses AI to create unique quizzes on demand.
- **Comprehensive Topic Selection**: Users can choose from an extensive list of pre-defined PSC topics or enter their own custom topic.
- **Customizable Quiz Length**: Select the number of questions (10, 25, or 50) for each quiz.
- **Smart Question History**: The app remembers questions you've already answered on a specific topic and generates new ones to ensure you're always learning.
- **Persistent Quiz History**: All quiz attempts are saved to a Firestore database, allowing you to review your performance and past answers at any time.
- **Interactive Quiz Interface**: A clean and intuitive UI for taking quizzes, with progress tracking and immediate feedback.
- **Detailed Review Page**: After completing a quiz, you can review each question, your answer, the correct answer, and a detailed explanation.
- **Anonymous Authentication**: Users can start practicing immediately without creating an account, with all their data tied to an anonymous session.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI & Generative Backend**: [Google Gemini](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore and Firebase Authentication)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation

## 🏁 Getting Started

To run the application locally, follow these steps:

1.  **Install Dependencies**:
    Open your terminal and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    Once the dependencies are installed, start the Next.js development server:
    ```bash
    npm run dev
    ```

3.  **Open the App**:
    Open your web browser and navigate to [http://localhost:9002](http://localhost:9002) to see the application in action.

## 📂 Project Structure

-   `src/app/`: Contains the main pages of the application, including the home page (`/`), quiz history (`/history`), and detailed review pages.
-   `src/components/`: Reusable React components used throughout the application, such as the quiz setup form, quiz view, and UI elements from ShadCN.
-   `src/ai/`: Holds the AI-related logic, including the Genkit flows for generating questions.
-   `src/firebase/`: Configuration and helper hooks for interacting with Firebase services (Firestore, Auth).
-   `src/lib/`: Shared utilities, type definitions, and constant data like the list of PSC topics.
-   `firestore.rules`: Security rules for the Firestore database.
