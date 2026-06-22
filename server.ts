import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini SDK initialized successfully on backend server.");
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined.");
  }
} catch (e) {
  console.error("Failed to initialize Gemini SDK:", e);
}

// REST API Endpoints for AI Assistance
app.post("/api/generate-news", async (req: express.Request, res: express.Response) => {
  if (!ai) {
    res.status(500).json({ error: "Gemini API has not been initialized. Please configure process.env.GEMINI_API_KEY." });
    return;
  }
  const { topic, category } = req.body;
  if (!topic || !category) {
    res.status(400).json({ error: "Missing required fields: topic and category." });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a professional and authentic newsletter article for Multee International School System (MISS) in Liberia. Topic: "${topic}". Category: "${category}". Ensure it conveys a sense of strong leadership, academic excellence, regional wins in quiz bowl/debate, and career readiness in TVET options like Tailoring, Hair Dressing, Beauty Care, Journalism, Computer Science, and Pastry. Format standard journalistic/friendly text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A compelling newsletter title." },
            content: { type: Type.STRING, description: "The full text of the article (approx 150-250 words)." },
            summary: { type: Type.STRING, description: "A very brief one-sentence preview." }
          },
          required: ["title", "content", "summary"]
        }
      }
    });

    const textOutput = response.text?.trim() || "{}";
    const data = JSON.parse(textOutput);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini News Generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate news" });
  }
});

app.post("/api/generate-quiz", async (req: express.Request, res: express.Response) => {
  if (!ai) {
    res.status(500).json({ error: "Gemini API has not been initialized." });
    return;
  }
  const { subject } = req.body;
  if (!subject) {
    res.status(400).json({ error: "Missing required field: subject." });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a challenging academic quiz bowl question tailored for senior high school level. Subject category: "${subject}". 
      Ideal for regional debate and quiz bowl prep in Liberia. Give 4 plausible options, make sure the correct answer matches one of the options perfectly. Include an educational explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "The multiple choice trivia question text." },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exactly 4 choices."
            },
            answer: { type: Type.STRING, description: "The correct choice. Must match one of the items in the options array exactly." },
            explanation: { type: Type.STRING, description: "A detailed educational breakdown of the answer." }
          },
          required: ["question", "options", "answer", "explanation"]
        }
      }
    });

    const textOutput = response.text?.trim() || "{}";
    const data = JSON.parse(textOutput);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Quiz question Generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz question" });
  }
});

// Setup Vite Dev Server / Static Middleware
async function startAppServer() {
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
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startAppServer().catch((error) => {
  console.error("Error setting up fullstack server entry point:", error);
});
