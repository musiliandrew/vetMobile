import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Mail, ArrowRight } from 'lucide-react-native';
import { API_BASE } from '../api';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

/**
 * EmailOTPLogin Component
 * This component handles email-based OTP authentication
 * It can be used as an alternative login method
 */
export default function EmailOTPLogin({ onVerified, onBack }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { useTranslation } = useLanguage();

    const handleSendOTP = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert(
                useTranslation('Invalid Email'),
                useTranslation('Please enter a valid email address')
            );
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/send-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                Alert.alert(
                    useTranslation('OTP Sent'),
                    useTranslation('Please check your email for the verification code.')
                );
                // Navigate to OTP verification screen
                onVerified({ email, needsOTP: true });
            } else {
                Alert.alert(
                    useTranslation('Error'),
                    data.error || useTranslation('Failed to send OTP')
                );
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            Alert.alert(
                useTranslation('Error'),
                useTranslation('Failed to connect to server')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.content}>
                    <View style={styles.iconCircle}>
                        <Mail color="#16a34a" size={48} />
                    </View>

                    <Text style={styles.title}>{useTranslation('Email Verification')}</Text>
                    <Text style={styles.subtitle}>
                        {useTranslation('Enter your email to receive a verification code')}
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Mail color="#94a3b8" size={20} />
                            <TextInput
                                style={styles.input}
                                placeholder={useTranslation("Email Address")}
                                placeholderTextColor="#94a3b8"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                            onPress={handleSendOTP}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.sendButtonText}>
                                        {useTranslation('Send OTP')}
                                    </Text>
                                    <ArrowRight color="#fff" size={20} />
                                </>
                            )}
                        </TouchableOpacity>

                        {onBack && (
                            <TouchableOpacity style={styles.backLink} onPress={onBack}>
                                <Text style={styles.backLinkText}>
                                    {useTranslation('Back to Sign In')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        alignItems: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#dcfce7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#16a34a',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#166534',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 40,
        maxWidth: '85%',
        lineHeight: 20,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        height: 56,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
    },
    sendButton: {
        backgroundColor: '#16a34a',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
    },
    sendButtonDisabled: {
        opacity: 0.7,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    backLink: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    backLinkText: {
        fontSize: 15,
        color: '#16a34a',
        fontWeight: '600',
    },
});
