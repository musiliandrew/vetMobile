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
    ScrollView,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Smartphone, User, Mail, ArrowRight, ChevronDown } from 'lucide-react-native';
import { Alert, ActivityIndicator } from 'react-native';
import { API_BASE } from '../api';

const { width } = Dimensions.get('window');

import { useLanguage, T } from '../context/LanguageContext';

export default function SignUp({ onSignUp, onSignIn }) {
    const [formData, setFormData] = useState({
        title: 'Mr.',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { useTranslation, t } = useLanguage();
    const namePlaceholder = useTranslation("Full Name");
    const emailPlaceholder = useTranslation("Email");
    const passwordPlaceholder = useTranslation("Password");
    const verifyPasswordPlaceholder = useTranslation("Verify Password");
    const phonePlaceholder = useTranslation("Phone");

    const handleSignUp = async () => {
        const { fullName, email, password } = formData;
        if (!fullName || !email || !password) {
            Alert.alert(await t('Error'), await t('All fields are required'));
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: fullName.toLowerCase().replace(/\s/g, ''),
                    email: email,
                    password: password,
                    role: 'STUDENT'
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

            if (res.ok) {
                Alert.alert(await t('Success'), await t('Account created! Logging you in...'));
                onSignUp(data.user, data.token);
            } else {
                Alert.alert(await t('Signup Failed'), JSON.stringify(data));
            }
        } catch (error) {
            console.error("Signup error:", error);
            Alert.alert(await t('Error'), await t('Failed to connect to server'));
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <T style={styles.headerTitle}>Sign UP</T>

                    <T style={styles.subtext}>
                        Fill in your details to create an account.
                    </T>

                    <View style={styles.form}>
                        {/* Name Row */}
                        <View style={styles.rowContainer}>
                            <TouchableOpacity
                                style={styles.titleDropdown}
                                onPress={() => {
                                    const titles = ['Mr.', 'Ms.', 'Dr.'];
                                    const currentIndex = titles.indexOf(formData.title);
                                    const nextIndex = (currentIndex + 1) % titles.length;
                                    updateField('title', titles[nextIndex]);
                                }}
                            >
                                <Text style={styles.titleText}>{formData.title}</Text>
                                <ChevronDown size={14} color="#1e293b" />
                            </TouchableOpacity>

                            <View style={[styles.inputContainer, styles.flexInput]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={namePlaceholder}
                                    placeholderTextColor="#94a3b8"
                                    value={formData.fullName}
                                    onChangeText={(text) => updateField('fullName', text)}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={emailPlaceholder}
                                placeholderTextColor="#94a3b8"
                                value={formData.email}
                                onChangeText={(text) => updateField('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={passwordPlaceholder}
                                placeholderTextColor="#94a3b8"
                                value={formData.password}
                                onChangeText={(text) => updateField('password', text)}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff color="#64748b" size={18} />
                                ) : (
                                    <Eye color="#64748b" size={18} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={verifyPasswordPlaceholder}
                                placeholderTextColor="#94a3b8"
                                value={formData.confirmPassword}
                                onChangeText={(text) => updateField('confirmPassword', text)}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff color="#64748b" size={18} />
                                ) : (
                                    <Eye color="#64748b" size={18} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Phone Row */}
                        <View style={styles.rowContainer}>
                            <View style={styles.countryCodeContainer}>
                                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                            </View>

                            <View style={[styles.inputContainer, styles.flexInput]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={phonePlaceholder}
                                    placeholderTextColor="#94a3b8"
                                    value={formData.phone}
                                    onChangeText={(text) => updateField('phone', text)}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <T style={styles.signUpButtonText}>Register</T>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <T style={styles.footerText}>Already have an account? </T>
                            <TouchableOpacity onPress={onSignIn}>
                                <T style={styles.signInLinkText}>Sign In</T>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 20,
        flexGrow: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtext: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 20,
    },
    form: {
        width: '100%',
    },
    rowContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    titleDropdown: {
        width: 70,
        height: 48,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    titleText: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
    },
    inputContainer: {
        width: '100%',
        height: 48,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    flexInput: {
        flex: 1,
        marginBottom: 0,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1e293b',
    },
    countryCodeContainer: {
        width: 80,
        height: 48,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countryCodeText: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
    },
    signUpButton: {
        backgroundColor: '#16a34a',
        height: 52,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 16,
    },
    signInLinkText: {
        fontSize: 14,
        color: '#16a34a',
        fontWeight: '700',
    },
});
