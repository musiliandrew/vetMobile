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
    Image,
    ScrollView
} from 'react-native';
import { Eye, EyeOff, Facebook, Chrome, Smartphone, ArrowRight } from 'lucide-react-native';
import { Alert, ActivityIndicator } from 'react-native';
import { API_BASE } from '../api';

const { width } = Dimensions.get('window');

export default function SignIn({ onSignIn, onSignUp, onForgotPassword }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password: password })
            });
            const data = await res.json();

            if (res.ok) {
                onSignIn(data.user, data.token);
            } else {
                Alert.alert('Login Failed', data.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert('Error', 'Failed to connect to server');
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
                    <Text style={styles.headerTitle}>Sign In</Text>

                    <Text style={styles.subtext}>
                        By signing in to VetPathshala, users agree to abide by our sign-in policy.
                    </Text>

                    <View style={styles.illustrationContainer}>
                        <View style={styles.illustrationCircle}>
                            <Smartphone color="#6366f1" size={60} strokeWidth={1.5} />
                        </View>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email / Phone"
                                placeholderTextColor="#94a3b8"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff color="#64748b" size={20} />
                                ) : (
                                    <Eye color="#64748b" size={20} />
                                )}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword} onPress={onForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.signInButton}
                            onPress={handleSignIn}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signInButtonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Chrome size={24} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Facebook size={24} color="#1877f2" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={onSignUp}>
                                <Text style={styles.signUpLinkText}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    illustrationCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f5f3ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e7ff',
    },
    form: {
        width: '100%',
        marginTop: 10,
    },
    inputContainer: {
        width: '100%',
        height: 52,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: '600',
    },
    signInButton: {
        backgroundColor: '#6366f1',
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '500',
        marginHorizontal: 10,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 25,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
    },
    signUpLinkText: {
        fontSize: 15,
        color: '#6366f1',
        fontWeight: '700',
    },
});
