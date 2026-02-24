// backend/utils/lang.js
import franc from "franc";
import { Translate } from "@google-cloud/translate";

// initialize Google Translate
const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

// Detect language
export function detectLanguage(text) {
  const langCode = franc(text);
  return langCode === "und" ? "en" : langCode; // default to English if unknown
}

// Translate text to target language
export async function translateText(text, targetLang) {
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
}
