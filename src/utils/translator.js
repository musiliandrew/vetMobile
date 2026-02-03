import axios from 'axios';

// Public instance of LibreTranslate - NOTE: This is for development/testing.
// For production, you should host your own instance or use a paid API to avoid rate limits/downtime.
const TRANSLATE_API = 'https://libretranslate.com/translate';

// Cache translations to avoid repeated requests
const translationCache = {};

// Common translations for frequently used phrases (fallback when API fails)
const commonTranslations = {
    'en_hi': {
        // Auth & Onboarding
        'Choose App Language': 'ऐप भाषा चुनें',
        'Choose Your Role': 'अपनी भूमिका चुनें',
        'Select your profession to get personalized content': 'व्यक्तिगत सामग्री प्राप्त करने के लिए अपना पेशा चुनें',
        'Continue': 'जारी रखें',
        'Student': 'छात्र',
        'Veterinarian': 'पशु चिकित्सक',
        'Animal health professionals & veterinary doctors': 'पशु स्वास्थ्य पेशेवर और पशु चिकित्सक',
        'Pharmacist': 'फार्मासिस्ट',
        'Veterinary pharmacy & medication specialists': 'पशु चिकित्सा फार्मेसी और दवा विशेषज्ञ',
        'Farmer': 'किसान',
        'Livestock & animal husbandry professionals': 'पशुधन और पशुपालन पेशेवर',
        'Sign In': 'साइन इन करें',
        'Sign UP': 'साइन अप करें',
        'Sign Up': 'साइन अप करें',
        'Register': 'पंजीकरण करें',
        'Email': 'ईमेल',
        'Password': 'पासवर्ड',
        'Verify Password': 'पासवर्ड सत्यापित करें',
        'Full Name': 'पूरा नाम',
        'Phone': 'फ़ोन',
        'Forgot Password?': 'पासवर्ड भूल गए?',
        'Already have an account?': 'पहले से खाता है?',
        "Don't have an account?": 'खाता नहीं है?',
        'Create Account': 'खाता बनाएं',

        // Common UI
        'Search': 'खोजें',
        'Filter': 'फ़िल्टर',
        'Save': 'सहेजें',
        'Cancel': 'रद्द करें',
        'Delete': 'हटाएं',
        'Edit': 'संपादित करें',
        'Back': 'वापस',
        'Next': 'अगला',
        'Previous': 'पिछला',
        'Submit': 'जमा करें',
        'Close': 'बंद करें',
        'Error': 'त्रुटि',
        'Success': 'सफलता',
        'Loading': 'लोड हो रहा है',

        // Dashboard
        'Dashboard': 'डैशबोर्ड',
        'Question Bank': 'प्रश्न बैंक',
        'Drug Center': 'ड्रग सेंटर',
        'E-Books': 'ई-पुस्तकें',
        'Profile': 'प्रोफ़ाइल',
        'Settings': 'सेटिंग्स',
        'Logout': 'लॉग आउट',
    }
};

export const translateText = async (text, targetLang) => {
    if (!text) return '';
    if (targetLang === 'en') return text; // No need to translate to English

    // Check cache first
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    // Check common translations
    const commonKey = `en_${targetLang}`;
    if (commonTranslations[commonKey] && commonTranslations[commonKey][text]) {
        const translation = commonTranslations[commonKey][text];
        translationCache[cacheKey] = translation;
        return translation;
    }

    // Try API translation
    try {
        const response = await axios.post(TRANSLATE_API, {
            q: text,
            source: 'en',
            target: targetLang,
            format: 'text',
            api_key: "" // Leave empty for free mirrors, or add key if you have one
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000 // 5 second timeout
        });

        const translatedText = response.data.translatedText;
        translationCache[cacheKey] = translatedText;
        return translatedText;
    } catch (error) {
        console.warn(`Translation failed for "${text}":`, error.response?.status || error.message);
        // Fallback to original text if translation fails
        translationCache[cacheKey] = text;
        return text;
    }
};

// Helper hook for React components could be added here if needed
