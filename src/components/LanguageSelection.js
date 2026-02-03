import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Languages, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const LANGUAGES = [
    { id: 'en', label: 'English', subLabel: 'English' },
    { id: 'hi', label: 'हिंदी', subLabel: 'Hindi' },
];

export default function LanguageSelection({ onContinue }) {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Choose App Language</Text>
                <Text style={styles.subtitle}>
                    Select your preferred language to continue using the app in the way that feels most comfortable to you. You can change the language anytime later in the app settings.
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
                            onPress={() => setSelectedLanguage(lang.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionLabel}>{lang.label}</Text>
                                <Text style={styles.optionSubLabel}>{lang.subLabel}</Text>
                            </View>
                            {selectedLanguage === lang.id && (
                                <CheckCircle2 color="#6366f1" size={24} />
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
                <Text style={styles.continueText}>Continue</Text>
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
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    optionsContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 20,
    },
    option: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        backgroundColor: '#f8fafc',
    },
    selectedOption: {
        borderColor: '#6366f1',
        backgroundColor: '#f5f3ff',
    },
    optionTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    optionSubLabel: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
    continueButton: {
        backgroundColor: '#6366f1',
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
