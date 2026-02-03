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

const { width, height } = Dimensions.get('window');

const FILTERS = [
    { id: 'status', label: '', placeholder: 'Solved/Unsolved' }, // Top one has no label in mockup
    { id: 'importance', label: 'Question Importance', placeholder: 'Question Importance' },
    { id: 'level', label: 'Question Level', placeholder: 'Question Level' },
    { id: 'type', label: 'Question Type', placeholder: 'Question Type' },
    { id: 'media', label: 'Text/Pic', placeholder: 'Text/Pic' },
    { id: 'cost', label: 'Free/Paid', placeholder: 'Free/Paid' },
    { id: 'language', label: 'Language', placeholder: 'Language' },
    { id: 'notes', label: 'Personal Notes', placeholder: 'Personal Notes' },
    { id: 'accuracy', label: 'Correct/Incorrect', placeholder: 'Correct/Incorrect' },
    { id: 'guess', label: 'Guess', placeholder: 'Guess' },
];

export default function FilterModal({ visible, onClose }) {
    // We won't implement actual dropdown logic for all, just the UI representation

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
                        <Text style={styles.headerTitle}>Filter Questions</Text>
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
                            <Text style={styles.applyText}>Apply</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.resetButton}>
                            <RefreshCw color="#fff" size={18} />
                            <Text style={styles.resetText}>Reset</Text>
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
        backgroundColor: '#f3e8ff', // Light purple
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    dropdownText: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    applyButton: {
        flex: 1,
        backgroundColor: '#6366f1',
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
