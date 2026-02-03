import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput,
    ScrollView
} from 'react-native';
import {
    Flag,
    X,
    AlertTriangle,
    Info,
    Ban,
    Copyright,
    Bug
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const REPORT_REASONS = [
    {
        id: 'inappropriate',
        label: 'Inappropriate Content',
        desc: 'Contains offensive, harmful, or inappropriate material',
        icon: AlertTriangle
    },
    {
        id: 'incorrect',
        label: 'Incorrect Information',
        desc: 'Contains factually incorrect or misleading information',
        icon: Info
    },
    {
        id: 'spam',
        label: 'Spam',
        desc: 'Unwanted or repetitive content',
        icon: Ban
    },
    {
        id: 'copyright',
        label: 'Copyright Violation',
        desc: 'Unauthorized use of copyrighted material',
        icon: Copyright
    },
    {
        id: 'technical',
        label: 'Technical Issue',
        desc: 'Content has formatting, display, or functionality problems',
        icon: Bug
    }
];

export default function ReportModal({ visible, onClose, contentPreview = "According to ācharya charaka,..." }) {
    const [selectedReason, setSelectedReason] = useState(null);
    const [comment, setComment] = useState('');

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
                        <View style={styles.headerLeft}>
                            <Flag color="#b91c1c" size={20} fill="#b91c1c" />
                            <View style={styles.headerTexts}>
                                <Text style={styles.headerTitle}>Report Content</Text>
                                <Text style={styles.headerSubtitle} numberOfLines={1}>{contentPreview}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X color="#b91c1c" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.promptText}>Why are you reporting this question?</Text>

                        <View style={styles.reasonsList}>
                            {REPORT_REASONS.map((item) => {
                                const Icon = item.icon;
                                const isSelected = selectedReason === item.id;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.reasonCard, isSelected && styles.reasonCardSelected]}
                                        onPress={() => setSelectedReason(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.iconContainer}>
                                            <Icon size={20} color={isSelected ? "#b91c1c" : "#94a3b8"} />
                                        </View>
                                        <View style={styles.reasonTextContainer}>
                                            <Text style={[styles.reasonLabel, isSelected && styles.reasonLabelSelected]}>{item.label}</Text>
                                            <Text style={styles.reasonDesc}>{item.desc}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Report This Question"
                            placeholderTextColor="#94a3b8"
                            multiline
                            numberOfLines={4}
                            value={comment}
                            onChangeText={setComment}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </ScrollView>
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
        overflow: 'hidden',
        maxHeight: height * 0.85,
    },
    header: {
        backgroundColor: '#fef2f2', // Light red
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
    },
    headerTexts: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#b91c1c', // Dark red
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#ef4444',
    },
    scrollContent: {
        padding: 20,
    },
    promptText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 20,
    },
    reasonsList: {
        gap: 12,
        marginBottom: 20,
    },
    reasonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#fff',
    },
    reasonCardSelected: {
        borderColor: '#b91c1c',
        backgroundColor: '#fef2f2',
    },
    iconContainer: {
        marginRight: 16,
    },
    reasonTextContainer: {
        flex: 1,
    },
    reasonLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    reasonLabelSelected: {
        color: '#b91c1c',
    },
    reasonDesc: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 16,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#94a3b8',
        borderRadius: 12,
        padding: 16,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
        fontSize: 14,
        color: '#0f172a',
    },
    saveButton: {
        backgroundColor: '#dc2626', // Red
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
