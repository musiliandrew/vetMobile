import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Languages, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const LANGUAGES = [
    { id: 'en', label: 'English', subLabel: 'English' },
    { id: 'hi', label: 'हिंदी', subLabel: 'Hindi' },
];

// Translations for the language selection screen itself
const SCREEN_TRANSLATIONS = {
    en: {
        title: 'Choose App Language',
        subtitle: 'Select your preferred language to continue using the app in the way that feels most comfortable to you. You can change the language anytime later in the app settings.',
        continue: 'Continue'
    },
    hi: {
        title: 'ऐप भाषा चुनें',
        subtitle: 'अपनी पसंदीदा भाषा चुनें और ऐप का उपयोग उस तरीके से जारी रखें जो आपके लिए सबसे आरामदायक हो। आप बाद में ऐप सेटिंग्स में कभी भी भाषा बदल सकते हैं।',
        continue: 'जारी रखें'
    }
};

export default function LanguageSelection({ onContinue }) {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    // Get current translations based on selected language
    const t = SCREEN_TRANSLATIONS[selectedLanguage];

    const handleLanguageSelect = (langId) => {
        setSelectedLanguage(langId);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{t.title}</Text>
                <Text style={styles.subtitle}>
                    {t.subtitle}
                </Text>

                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Languages color="#fff" size={40} />
                    </View>
                </View>

                <View style={styles.optionsContainer}>
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang.id}
                            style={[
                                styles.option,
                                selectedLanguage === lang.id && styles.selectedOption
                            ]}
                            onPress={() => handleLanguageSelect(lang.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionLabel}>{lang.label}</Text>
                                <Text style={styles.optionSubLabel}>{lang.subLabel}</Text>
                            </View>
                            {selectedLanguage === lang.id && (
                                <CheckCircle2 color="#16a34a" size={24} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={[styles.continueButton, !selectedLanguage && styles.disabledButton]}
                onPress={() => onContinue(selectedLanguage)}
                disabled={!selectedLanguage}
            >
                <Text style={styles.continueText}>{t.continue}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    iconContainer: {
        marginBottom: 30,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowRadius: 15,
        elevation: 8,
    },
    optionsContainer: {
        width: '100%',
        gap: 16, // Space between language cards
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        backgroundColor: '#fff',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    optionSubLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    selectedOption: {
        borderColor: '#16a34a',
        backgroundColor: '#f0fdf4',
    },
    continueButton: {
        backgroundColor: '#16a34a',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: '#94a3b8',
    },
    continueText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
