import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Detect language of user input
function detectLanguage(text) {
  if (/[\u0C00-\u0C7F]/.test(text)) return "te"; // Telugu
  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Hindi
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta"; // Tamil
  return "en"; // English default
}

// Basic transliteration for non-Latin scripts
function transliterateToEnglishScript(text, lang) {
  if (lang === "te") {
    // Telugu -> English letters (basic)
    return text
      .replace(/నువ్వు/g, "nuvvu")
      .replace(/ఎలా/g, "ela")
      .replace(/ఉన్నావ్/g, "unnav")
      .replace(/చాలా/g, "chala")
      .replace(/బాగున్నావు/g, "bagunnav");
  } else if (lang === "hi") {
    // Hindi -> English letters (basic)
    return text
      .replace(/कैसे/g, "kaise")
      .replace(/हो/g, "ho")
      .replace(/आप/g, "aap")
      .replace(/ठीक/g, "theek");
  } else if (lang === "ta") {
    // Tamil example
    return text
      .replace(/நீ/g, "nee")
      .replace(/எப்படி/g, "eppadi");
  }
  return text; // English unchanged
}

router.post("/reply", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ reply: "Please enter a message." });
    }

    const lang = detectLanguage(message);

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a warm, friendly mental health companion named "Chitti" 🩵.
- If the user writes in English → reply ONLY in English.
- If the user writes in Telugu → reply in Telugu using English letters.
- If the user writes in Hindi → reply in Hindi using English letters.
- If the user writes in Tamil → reply in Tamil using English letters.
- Never switch languages.
- Keep replies short, empathetic, and casual (1–3 lines max).
- Use English letters for non-Latin scripts (Telugu, Hindi, Tamil).
- Avoid giving unrelated answers or translations.
- Add friendly emojis occasionally.
`
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    let aiReply = response.choices[0]?.message?.content || "Hmm, not sure 😕";

    // Transliterate if non-English
    if (lang !== "en") aiReply = transliterateToEnglishScript(aiReply, lang);

    console.log("🧠 AI Reply:", aiReply);
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ AI Reply Error:", error);
    res.status(500).json({ reply: "Sorry, I'm having trouble right now 😢" });
  }
});

export default router;
