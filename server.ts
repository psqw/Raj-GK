import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Proxy
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  app.post("/api/generate-questions", async (req, res) => {
    const { category, subTopic } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured in environment variables." });
    }

    const prompt = `Generate 15 advanced, tricky multiple-choice questions about Rajasthan GK in Hindi.
Category: ${category}
Sub-topic: ${subTopic}

The questions should be challenging and suitable for competitive exams like RAS, REET, or RPSC.
Each question must include:
1. Question text (q)
2. 4 options (options)
3. Index of the correct answer (correct, 0-3)
4. Difficulty (Easy, Medium, Hard)
5. A short hint in Hindi (hint)
6. A detailed explanation in Hindi (explanation)
7. A short memory trick or mnemonic in Hindi to remember the fact (trick)

Return only the JSON array of objects.`;

    try {
      const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                q: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4
                },
                correct: { type: Type.INTEGER },
                difficulty: { type: Type.STRING },
                hint: { type: Type.STRING },
                explanation: { type: Type.STRING },
                trick: { type: Type.STRING }
              },
              required: ["q", "options", "correct", "difficulty", "hint", "explanation", "trick"]
            }
          }
        }
      });

      const responseText = result.response.text();
      res.json(JSON.parse(responseText));
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate questions" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
