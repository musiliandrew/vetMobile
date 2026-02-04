import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowRight, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE } from '../api';
import { useLanguage, T } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function EmailOTPLogin({ onVerified, onBack }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { useTranslation, t } = useLanguage();
    const emailPlaceholder = useTranslation("Email Address");

    const handleSendOTP = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert(
                await t('Invalid Email'),
                await t('Please enter a valid email address')
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
                    await t('OTP Sent'),
                    await t('Please check your email for the verification code.')
                );
                onVerified({ email, needsOTP: true });
            } else {
                Alert.alert(
                    await t('Error'),
                    data.error || await t('Failed to send OTP')
                );
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            Alert.alert(
                await t('Error'),
                await t('Failed to connect to server')
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
                {onBack && (
                    <TouchableOpacity style={styles.backArrow} onPress={onBack}>
                        <ChevronLeft color="#166534" size={28} />
                    </TouchableOpacity>
                )}

                <View style={styles.content}>
                    <LinearGradient
                        colors={['#dcfce7', '#f0fdf4']}
                        style={styles.iconCircle}
                    >
                        <Mail color="#16a34a" size={48} strokeWidth={1.5} />
                    </LinearGradient>

                    <T style={styles.title}>Email Verification</T>
                    <T style={styles.subtitle}>
                        We'll send a 4-digit code to your inbox to securely verify your identity.
                    </T>

                    <View style={styles.form}>
                        <View style={styles.inputWrapper}>
                            <T style={styles.label}>Email Address</T>
                            <View style={styles.inputContainer}>
                                <Mail color="#94a3b8" size={20} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={emailPlaceholder}
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleSendOTP}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#16a34a', '#15803d']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.sendButton}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <T style={styles.sendButtonText}>Send OTP Code</T>
                                        <ArrowRight color="#fff" size={22} strokeWidth={2.5} />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {onBack && (
                            <TouchableOpacity
                                style={styles.backLink}
                                onPress={onBack}
                                disabled={loading}
                            >
                                <View style={styles.backLinkContent}>
                                    <T style={styles.backLinkPrefix}>Remembered password?</T>
                                    <T style={styles.backLinkText}> Sign In</T>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.footer}>
                    <T style={styles.footerInfo}>Securely encrypted & private</T>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backArrow: {
        marginTop: 10,
        marginLeft: 20,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 40,
        alignItems: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#064e3b',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    form: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 10,
        marginLeft: 4,
    },
    inputContainer: {
        width: '100%',
        height: 56,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#f8fafc',
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
    },
    sendButton: {
        height: 58,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 6,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    backLink: {
        marginTop: 25,
        alignItems: 'center',
        paddingVertical: 10,
    },
    backLinkContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backLinkPrefix: {
        fontSize: 15,
        color: '#64748b',
        fontWeight: '500',
    },
    backLinkText: {
        fontSize: 15,
        color: '#16a34a',
        fontWeight: '800',
    },
    footer: {
        paddingBottom: 25,
        alignItems: 'center',
    },
    footerInfo: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

