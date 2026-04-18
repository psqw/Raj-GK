import { type Question } from "../data/quizData";

export async function generateAIQuestions(category: string, subTopic: string): Promise<Question[]> {
  try {
    const response = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, subTopic }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch questions");
    }

    const questionsData = await response.json();
    
    // Map to our Question interface
    return questionsData.map((q: any, index: number) => ({
      id: Date.now() + index,
      q: q.q,
      options: q.options,
      correct: q.correct,
      difficulty: q.difficulty,
      category: category as any,
      subTopic: subTopic,
      hint: q.hint,
      explanation: q.explanation,
      trick: q.trick
    }));
  } catch (error) {
    console.error("Error generating AI questions:", error);
    throw error;
  }
}
