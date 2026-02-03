import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Modal,
    ScrollView
} from 'react-native';
import {
    X,
    ChevronDown,
    RefreshCw,
    Send
} from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

export default function FilterModal({ visible, onClose }) {
    const { useTranslation } = useLanguage();

    // We won't implement actual dropdown logic for all, just the UI representation
    const FILTERS = [
        { id: 'status', label: '', placeholder: useTranslation('Solved/Unsolved') }, // Top one has no label in mockup
        { id: 'importance', label: useTranslation('Question Importance'), placeholder: useTranslation('Question Importance') },
        { id: 'level', label: useTranslation('Question Level'), placeholder: useTranslation('Question Level') },
        { id: 'type', label: useTranslation('Question Type'), placeholder: useTranslation('Question Type') },
        { id: 'media', label: useTranslation('Text/Pic'), placeholder: useTranslation('Text/Pic') },
        { id: 'cost', label: useTranslation('Free/Paid'), placeholder: useTranslation('Free/Paid') },
        { id: 'language', label: useTranslation('Language'), placeholder: useTranslation('Language') },
        { id: 'notes', label: useTranslation('Personal Notes'), placeholder: useTranslation('Personal Notes') },
        { id: 'accuracy', label: useTranslation('Correct/Incorrect'), placeholder: useTranslation('Correct/Incorrect') },
        { id: 'guess', label: useTranslation('Guess'), placeholder: useTranslation('Guess') },
    ];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{useTranslation('Filter Questions')}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color="#000" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {FILTERS.map((filter, index) => (
                            <View key={filter.id} style={styles.filterGroup}>
                                {filter.label ? <Text style={styles.label}>{filter.label}</Text> : null}
                                <TouchableOpacity style={styles.dropdown}>
                                    <Text style={styles.dropdownText}>{filter.placeholder}</Text>
                                    <ChevronDown size={20} color="#0f172a" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                            <Send color="#fff" size={18} style={{ transform: [{ rotate: '45deg' }] }} />
                            <Text style={styles.applyText}>{useTranslation('Apply')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.resetButton}>
                            <RefreshCw color="#fff" size={18} />
                            <Text style={styles.resetText}>{useTranslation('Reset')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        maxHeight: height * 0.9,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    scrollContent: {
        padding: 20,
    },
    filterGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0fdf4', // Light green dropdown
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    applyButton: {
        flex: 1,
        backgroundColor: '#16a34a',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    applyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    resetButton: {
        flex: 1,
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    resetText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
