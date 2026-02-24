import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();
const router = express.Router();

// Initialize GROQ client
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple transliteration mapping for Telugu/Hindi in English letters
function transliterateToEnglishScript(text, lang) {
  if (lang === "te") {
    return text
      .replace(/నువ్వు/g, "nuvvu")
      .replace(/ఎలా/g, "ela")
      .replace(/ఉన్నావ్/g, "unnav")
      .replace(/చాలా/g, "chala")
      .replace(/బాగున్నావు/g, "bagunnav");
  } else if (lang === "hi") {
    return text
      .replace(/कैसे/g, "kaise")
      .replace(/हो/g, "ho")
      .replace(/आप/g, "aap")
      .replace(/ठीक/g, "theek");
  }
  return text; // English or other languages unchanged
}

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ reply: "Please enter a message." });
    }

    // Detect language
    let lang = "en"; // default
    if (/[\u0C00-\u0C7F]/.test(message)) lang = "te"; // Telugu
    else if (/[\u0900-\u097F]/.test(message)) lang = "hi"; // Hindi
    else if (/[\u0B80-\u0BFF]/.test(message)) lang = "ta"; // Tamil

    // Call GROQ LLM
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are "Chitti" 🩵, a warm, caring friend for mental health support.
Reply in the same language the user speaks.
Keep responses short, casual, empathetic (1–3 lines max).
Use English letters if original text is in Telugu/Hindi/Tamil.
Add friendly emojis sometimes.
          `,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    let aiReply = response.choices[0]?.message?.content || "Hmm, not sure 😕";

    // Transliterate if needed
    if (lang !== "en") aiReply = transliterateToEnglishScript(aiReply, lang);

    console.log("🧠 AI Reply:", aiReply);
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ AI Reply Error:", error);
    res.status(500).json({
      reply: "Sorry, I'm having trouble connecting right now 😢",
    });
  }
});

export default router;
