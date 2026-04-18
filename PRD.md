# Product Requirements Document (PRD): राजस्थान GK मास्टर

## 1. Project Overview
"राजस्थान GK मास्टर" is a comprehensive, AI-powered quiz application designed for students preparing for Rajasthan competitive exams (RAS, RPSC, REET, Patwar, etc.). The app leverages advanced AI to provide dynamic, challenging, and localized content in Hindi, moving beyond static question banks.

## 2. Target Audience
- Aspirants of Rajasthan State Government exams.
- Students interested in Rajasthan's history, geography, and culture.
- Serious learners looking for high-quality, "tricky" questions with detailed explanations.

## 3. Core Modules & Features

### A. Dashboard & Topic Management
- **Category Selection**: Users can choose from four core subjects: 
    - इतिहास (History)
    - भूगोल (Geography)
    - राजव्यवस्था (Polity)
    - कला एवं संस्कृति (Art & Culture)
- **Topic Browser**: Each category opens into a detailed list of sub-topics specific to Rajasthan's curriculum.
- **Comprehensive Test (सम्पूर्ण अभ्यास)**: A mode to test knowledge across all categories simultaneously.

### B. AI-Powered Question Engine (`geminiService.ts`)
- **Dynamic Generation**: Every quiz generates 15 high-quality, advanced MCQs in real-time using Google's Gemini AI.
- **Contextual Prompting**: Questions are tailored to the selected sub-topic to ensure relevance.
- **Localized Content**: All questions, hints, and explanations are strictly in Hindi.
- **Fallback Mechanism**: Integrated local database (`quizData.ts`) ensures the app works even if the AI service is unavailable.

### C. Interactive Quiz Interface
- **Timer**: 30 seconds per question to simulate exam pressure.
- **Progress Tracking**: 15 distinct progress dots at the top that color-code (Green/Red) based on the user's answers.
- **Hint System**: Strategic hints to help users bridge knowledge gaps.

### D. Result Analysis & Learning
- **Performance Summary**: Visual representation of the final score and accuracy.
- **Deep Learning Component**: For every incorrect answer, the app provides:
    - **Detailed Explanation**: Clear reasoning behind the correct answer.
    - **Memory Tricks (याद रखने की ट्रिक)**: Mnemonics or simple logic to help users never forget the fact again.

### E. Gamification & Retention
- **Daily Targets**: A list of 10 daily suggested topics. Completion requires an 80% score, encouraging mastery.
- **Daily Streak**: Visual indicator of consecutive active days.
- **Mandana Aesthetic**: Custom Rajasthan-themed UI elements (Mandana patterns, saffron colors) for an immersive experience.

### F. Statistics & Analytics (`recharts`)
- **Performance Trends**: Line charts showing accuracy growth over the last 10 quizzes.
- **Knowledge Gaps**: Bar charts identifying the "Most Missed Topics," allowing users to focus their revision.

## 4. Technical Stack

### Frontend
- **Framework**: React 18+ with Vite (TypeScript).
- **Styling**: Tailwind CSS for responsive and modern UI.
- **Animations**: Framer Motion (motion/react) for smooth view transitions.
- **Icons**: Lucide React.
- **Visualizations**: Recharts for performance analytics.

### AI Integration
- **SDK**: `@google/genai` (Google AI SDK).
- **Model**: `gemini-3-flash-preview` for rapid, high-quality question generation.

### Persistence
- **Storage**: `localStorage` used for tracking seen question IDs, completed daily targets, and quiz history.

## 5. User Journey
1. **Entry**: User sees the dashboard with categories and daily targets.
2. **Selection**: User picks a sub-topic (e.g., '1857 की क्रांति').
3. **Execution**: User answers 15 AI-generated tricky questions under a timer.
4. **Review**: User analyzes incorrect answers through AI explanations and tricks.
5. **Growth**: User checks the 'Stats' page to see long-term improvement.
