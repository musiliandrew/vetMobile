import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stethoscope, Pill, Sprout, ArrowRight, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ROLES = [
    {
        id: 'veterinarian',
        title: 'Veterinarian',
        description: 'Animal health professionals & veterinary doctors',
        icon: Stethoscope,
        iconBg: '#fef3f2',
        iconColor: '#f43f5e',
    },
    {
        id: 'pharmacist',
        title: 'Pharmacist',
        description: 'Veterinary pharmacy & medication specialists',
        icon: Pill,
        iconBg: '#f0fdf4',
        iconColor: '#10b981',
    },
    {
        id: 'farmer',
        title: 'Farmer',
        description: 'Livestock & animal husbandry professionals',
        icon: Sprout,
        iconBg: '#fffbeb',
        iconColor: '#f59e0b',
    },
];

import { useLanguage, T } from '../context/LanguageContext';

export default function RoleSelection({ onContinue }) {
    const [selectedRole, setSelectedRole] = useState('pharmacist');
    const { useTranslation } = useLanguage();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerBar} />
                    <T style={styles.title}>Choose Your Role</T>
                    <T style={styles.subtitle}>
                        Select your profession to get personalized content
                    </T>
                </View>

                <View style={styles.optionsContainer}>
                    {ROLES.map((role) => {
                        const isSelected = selectedRole === role.id;
                        const Icon = role.icon;

                        return (
                            <TouchableOpacity
                                key={role.id}
                                style={[
                                    styles.roleCard,
                                    isSelected && styles.selectedCard
                                ]}
                                onPress={() => setSelectedRole(role.id)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.iconBox, { backgroundColor: role.iconBg }]}>
                                    <Icon color={role.iconColor} size={24} />
                                </View>

                                <View style={styles.roleInfo}>
                                    <T style={[styles.roleTitle, isSelected && styles.selectedText]}>
                                        {role.title}
                                    </T>
                                    <T style={styles.roleDescription} numberOfLines={1}>
                                        {role.description}
                                    </T>
                                </View>

                                <View style={[styles.radioCircle, isSelected && styles.radioSelected]}>
                                    {isSelected && <Check color="#fff" size={12} strokeWidth={4} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => onContinue(selectedRole)}
                >
                    <T style={styles.continueText}>Continue</T>
                    <ArrowRight color="#fff" size={20} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7f7f2', // Matching the light mint green from image
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 30,
    },
    headerBar: {
        width: 4,
        height: 30,
        backgroundColor: '#10b981',
        borderRadius: 2,
        position: 'absolute',
        left: -15,
        top: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#064e3b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 20,
        opacity: 0.8,
    },
    optionsContainer: {
        gap: 15,
    },
    roleCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: '#10b981',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    roleInfo: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    selectedText: {
        color: '#059669', // Selected pharmacist color
    },
    roleDescription: {
        fontSize: 13,
        color: '#64748b',
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    radioSelected: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    footer: {
        padding: 24,
        backgroundColor: '#e7f7f2',
    },
    continueButton: {
        backgroundColor: '#16a34a', // Brand Green
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    continueText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
