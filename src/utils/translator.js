import axios from 'axios';

// Public instance of LibreTranslate - NOTE: This is for development/testing.
// For production, you should host your own instance or use a paid API to avoid rate limits/downtime.
const TRANSLATE_API = 'https://libretranslate.com/translate';

// Cache translations to avoid repeated requests
const translationCache = {};

export const translateText = async (text, targetLang) => {
    if (!text) return '';
    if (targetLang === 'en') return text; // No need to translate to English

    // Check cache first
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    try {
        const response = await axios.post(TRANSLATE_API, {
            q: text,
            source: 'en',
            target: targetLang,
            format: 'text',
            api_key: "" // Leave empty for free mirrors, or add key if you have one
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const translatedText = response.data.translatedText;
        translationCache[cacheKey] = translatedText;
        return translatedText;
    } catch (error) {
        console.warn(`Translation failed for "${text}":`, error.message);
        // Fallback to original text if translation fails
        return text;
    }
};

// Helper hook for React components could be added here if needed
