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

export default function OTPVerification({ phone = '+919876543210', onVerify, onBack }) {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(22);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    // Auto-send OTP on mount for demo
    useEffect(() => {
        sendOtp();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const sendOtp = async () => {
        try {
            console.log('Sending OTP to:', phone);
            const res = await axios.post(`${API_BASE}/send-otp/`, { phone });
            if (res.data.otp) {
                Alert.alert('Demo Mode', `Your OTP is: ${res.data.otp}`);
            }
        } catch (err) {
            console.log('Error sending OTP:', err);
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 4) {
            Alert.alert('Invalid Code', 'Please enter a 4-digit code.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/verify-otp/`, {
                phone,
                otp: code
            });

            if (res.data.verified) {
                onVerify(code);
            }
        } catch (err) {
            Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
            setOtp(['', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (text, index) => {
        if (text.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
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

                    <Text style={styles.title}>Verification</Text>
                    <Text style={styles.subtitle}>
                        We've sent a 4-digit code to your mobile number
                    </Text>

                    <View style={styles.card}>
                        <Text style={styles.label}>Enter OTP</Text>

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
                            <Text style={styles.resendText}>Didn't receive code? </Text>
                            <TouchableOpacity
                                disabled={timer > 0 || loading}
                                onPress={() => {
                                    setTimer(22);
                                    sendOtp();
                                }}
                            >
                                <Text style={[styles.resendLink, timer === 0 && styles.resendActive]}>
                                    Resend{timer > 0 ? ` (${timer}s)` : ''}
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
                                <Text style={styles.verifyButtonText}>Verify Now</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>Learning is fun! 📚✨</Text>
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
        marginBottom: 25,
        maxWidth: '85%',
        lineHeight: 20,
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
        borderColor: '#10b981',
        backgroundColor: '#ecfdf5',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
    },
    resendText: {
        fontSize: 14,
        color: '#64748b',
    },
    resendLink: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '600',
    },
    resendActive: {
        textDecorationLine: 'underline',
    },
    verifyButton: {
        backgroundColor: '#10b981',
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#10b981',
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
