import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { API_BASE } from '../api';

const { width } = Dimensions.get('window');

import { useLanguage, T } from '../context/LanguageContext';

export default function OTPVerification({ email = '', onVerify, onBack }) {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    const { useTranslation, t } = useLanguage();

    /* 
    useEffect(() => {
        // Auto-send OTP on mount - Disabled to avoid double sending from EmailOTPLogin
        if (email) {
            sendOtp();
        }
    }, []);
    */

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
                    await t('OTP Sent'),
                    await t('Please check your email for the verification code.')
                );
            } else {
                Alert.alert(
                    await t('Error'),
                    data.error || await t('Failed to send OTP')
                );
            }
        } catch (err) {
            console.log('Error sending OTP:', err);
            Alert.alert(
                await t('Error'),
                await t('Failed to connect to server')
            );
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 4) {
            Alert.alert(
                await t('Invalid Code'),
                await t('Please enter a 4-digit code.')
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
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
            }

            if (res.ok && data.verified) {
                Alert.alert(
                    await t('Success'),
                    await t('Email verified successfully!')
                );
                onVerify(data);
            } else {
                Alert.alert(
                    await t('Verification Failed'),
                    data.error || await t('Invalid OTP. Please try again.')
                );
                setOtp(['', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            console.error('Verification error:', err);
            Alert.alert(
                await t('Error'),
                await t('Failed to verify OTP')
            );
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (text, index) => {
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

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        setTimer(60);
        sendOtp();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <ChevronLeft color="#1e293b" size={24} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <Image
                        source={require('../../assets/splash_logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <T style={styles.title}>Verification</T>
                    <T style={styles.subtitle}>
                        We've sent a 4-digit code to
                    </T>
                    <Text style={styles.emailText}>{email}</Text>

                    <View style={styles.form}>
                        <T style={styles.label}>Enter OTP</T>

                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => inputRefs.current[index] = ref}
                                    style={styles.otpInput}
                                    value={digit}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>

                        <View style={styles.resendContainer}>
                            <T style={styles.resendText}>Didn't receive code? </T>
                            <TouchableOpacity
                                disabled={timer > 0}
                                onPress={handleResend}
                            >
                                <T style={[styles.resendLink, timer > 0 && styles.resendDisabled]}>
                                    Resend{timer > 0 ? ` (${timer}s)` : ''}
                                </T>
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
                                <T style={styles.verifyButtonText}>Verify Now</T>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footerTextContainer}>
                    <T style={styles.footerText}>Learning is fun! 📚✨</T>
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
