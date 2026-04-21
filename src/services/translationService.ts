import { ai } from '../lib/gemini';
import { Language } from '../i18n';

// In-memory cache for translations to avoid redundant API calls
const translationCache: Record<string, Record<string, string>> = {};

/**
 * Translates text into the target language using Gemini AI.
 * Uses a cache to store results and avoid unnecessary token usage.
 */
export async function translateText(text: string, targetLang: Language): Promise<string> {
  if (!text || !targetLang || targetLang === 'en') {
    // Assuming source data in Supabase is roughly English-centric or original
    // For now, if target is English, we just return original or handle as needed
    // But actually, everything MUST be translated, so if origin is unknown, we translate.
    // For simplicity, let's assume if it's already in the target lang or 'en' (if source is 'en'), we return.
  }

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[targetLang]?.[text]) {
    return translationCache[targetLang][text];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text into ${targetLang === 'de' ? 'German' : targetLang === 'tr' ? 'Turkish' : 'English'}. Return ONLY the translated text, no extra commentary.\n\nText: ${text}`,
    });

    const result = response.text || text;
    
    if (!translationCache[targetLang]) {
      translationCache[targetLang] = {};
    }
    translationCache[targetLang][text] = result;
    
    return result;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text
  }
}

/**
 * Translates an array of strings in one go to save API calls.
 */
export async function translateTextBatch(texts: string[], targetLang: Language): Promise<string[]> {
  const filteredTexts = texts.filter(t => t && t.trim().length > 0);
  if (filteredTexts.length === 0) return texts;

  // Check cache first for all texts
  const results: Record<string, string> = {};
  const needed: string[] = [];

  for (const text of texts) {
    if (translationCache[targetLang]?.[text]) {
      results[text] = translationCache[targetLang][text];
    } else {
      needed.push(text);
    }
  }

  if (needed.length === 0) {
    return texts.map(t => results[t] || t);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following list of texts into ${targetLang === 'de' ? 'German' : targetLang === 'tr' ? 'Turkish' : 'English'}. 
      Return a JSON array of strings corresponding to the translations in the same order.
      NO EXTRA TEXT.
      
      Texts:
      ${JSON.stringify(needed, null, 2)}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const translatedArray: string[] = JSON.parse(response.text || "[]");
    
    if (!translationCache[targetLang]) {
      translationCache[targetLang] = {};
    }

    needed.forEach((text, i) => {
      const trans = translatedArray[i] || text;
      translationCache[targetLang][text] = trans;
      results[text] = trans;
    });

    return texts.map(t => results[t] || t);
  } catch (error) {
    console.error("Batch translation error:", error);
    return texts;
  }
}
