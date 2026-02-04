import React, { createContext, useState, useContext, useEffect } from 'react';
import { Text } from 'react-native';
import { translateText } from '../utils/translator';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Default language is English ('en')
    const [language, setLanguage] = useState('en');
    // Store translations: keys are original English text, values are translated text
    const [translations, setTranslations] = useState({});

    // Function to translate a specific text string
    const t = async (text) => {
        if (!text) return '';
        if (language === 'en') return text;

        // Check if we already have this translation in context state
        // (Note: The utility also has a cache, but this state drives React updates)
        const cacheKey = `${text}_${language}`;
        if (translations[cacheKey]) {
            return translations[cacheKey];
        }

        // If not, fetch it
        // We return the original text initially to avoid blocking, 
        // then update state when translation arrives
        try {
            const translated = await translateText(text, language);
            setTranslations(prev => ({ ...prev, [cacheKey]: translated }));
            return translated;
        } catch (error) {
            return text;
        }
    };

    // A hook version that returns the translated text and automatically updates
    // when the language changes or the translation is fetched.
    const useTranslation = (text) => {
        // Handle array of children (e.g. ["Welcome ", name])
        const textKey = Array.isArray(text) ? text.join('') : text;
        const [translatedText, setTranslatedText] = useState(textKey);

        useEffect(() => {
            let mounted = true;

            const fetchTranslation = async () => {
                if (!textKey) return;

                // If English, just set original
                if (language === 'en') {
                    if (mounted) setTranslatedText(textKey);
                    return;
                }

                // Check cache first
                const cacheKey = `${textKey}_${language}`;
                if (translations[cacheKey]) {
                    if (mounted) setTranslatedText(translations[cacheKey]);
                    return;
                }

                // Fetch from API
                try {
                    const result = await translateText(textKey, language);
                    if (mounted) {
                        setTranslatedText(result);
                        setTranslations(prev => ({ ...prev, [cacheKey]: result }));
                    }
                } catch (e) {
                    console.warn('Translation error:', e);
                    if (mounted) setTranslatedText(textKey);
                }
            };

            fetchTranslation();

            return () => { mounted = false; };
        }, [textKey, language]); // Only depend on join-computed text and language

        return translatedText;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, useTranslation }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Shorthand component for translating text in JSX
// Safe to use inside loops/map functions
export const T = ({ children, style, ...props }) => {
    const { useTranslation } = useLanguage();
    const translatedText = useTranslation(children);
    return <Text style={style} {...props}>{translatedText}</Text>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};



