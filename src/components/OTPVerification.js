import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { API_BASE } from '../api';

const { width } = Dimensions.get('window');

import { useLanguage } from '../context/LanguageContext';

export default function OTPVerification({ email = '', onVerify, onBack }) {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    const { useTranslation } = useLanguage();

    useEffect(() => {
        // Auto-send OTP on mount
        if (email) {
            sendOtp();
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const sendOtp = async () => {
        try {
            console.log('Sending OTP to:', email);
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
            } else {
                Alert.alert(
                    useTranslation('Error'),
                    data.error || useTranslation('Failed to send OTP')
                );
            }
        } catch (err) {
            console.log('Error sending OTP:', err);
            Alert.alert(
                useTranslation('Error'),
                useTranslation('Failed to connect to server')
            );
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 4) {
            Alert.alert(
                useTranslation('Invalid Code'),
                useTranslation('Please enter a 4-digit code.')
            );
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/verify-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp: code
                })
            });
            const data = await res.json();

            if (res.ok && data.verified) {
                Alert.alert(
                    useTranslation('Success'),
                    useTranslation('Email verified successfully!')
                );
                onVerify(data);
            } else {
                Alert.alert(
                    useTranslation('Verification Failed'),
                    data.error || useTranslation('Invalid OTP. Please try again.')
                );
                setOtp(['', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            console.error('Verification error:', err);
            Alert.alert(
                useTranslation('Error'),
                useTranslation('Failed to verify OTP')
            );
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (text, index) => {
        if (text.length > 1) {
            text = text.charAt(0);
        }

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <ChevronLeft color="#166534" size={24} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <Image
                        source={require('../../assets/splash_logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>{useTranslation('Verification')}</Text>
                    <Text style={styles.subtitle}>
                        {useTranslation("We've sent a 4-digit code to")}
                    </Text>
                    <Text style={styles.emailText}>{email}</Text>

                    <View style={styles.card}>
                        <Text style={styles.label}>{useTranslation('Enter OTP')}</Text>

                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => inputRefs.current[index] = ref}
                                    style={[styles.otpInput, digit && styles.otpInputFilled]}
                                    value={digit}
                                    onChangeText={(text) => handleChange(text, index)}
                                    onKeyPress={(e) => handleBackspace(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                    editable={!loading}
                                />
                            ))}
                        </View>

                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>{useTranslation("Didn't receive code?")} </Text>
                            <TouchableOpacity
                                disabled={timer > 0 || loading}
                                onPress={() => {
                                    setTimer(60);
                                    sendOtp();
                                }}
                            >
                                <Text style={[styles.resendLink, timer === 0 && styles.resendActive]}>
                                    {useTranslation('Resend')}{timer > 0 ? ` (${timer}s)` : ''}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
                            onPress={handleVerify}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.verifyButtonText}>{useTranslation('Verify Now')}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>{useTranslation('Learning is fun! 📚✨')}</Text>
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
    backButton: {
        marginLeft: 20,
        marginTop: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#166534',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 8,
        maxWidth: '85%',
        lineHeight: 20,
    },
    emailText: {
        fontSize: 15,
        color: '#16a34a',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 25,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 20,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        width: 54,
        height: 54,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        backgroundColor: '#f8fafc',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '700',
        color: '#1e293b',
    },
    otpInputFilled: {
        borderColor: '#16a34a',
        backgroundColor: '#dcfce7',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    resendText: {
        fontSize: 14,
        color: '#64748b',
    },
    resendLink: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
    },
    resendActive: {
        color: '#16a34a',
    },
    verifyButton: {
        backgroundColor: '#16a34a',
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButtonDisabled: {
        opacity: 0.7,
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    footerTextContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '600',
    },
});
