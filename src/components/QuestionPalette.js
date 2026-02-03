import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Modal,
    Image
} from 'react-native';
import {
    Lock,
    ArrowDown
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.85;

export default function QuestionPalette({ visible, onClose, currentQuestion = 1, totalQuestions = 100 }) {
    // Generate numbers 1 to 50 for the demo grid as per screenshot
    const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

                <View style={styles.drawer}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Stats Header */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <View style={[styles.statBox, { backgroundColor: '#4d7c0f' }]}>
                                        <Text style={styles.statNumber}>1</Text>
                                    </View>
                                    <Text style={styles.statLabel}>सुलझा</Text>
                                </View>
                                <View style={[styles.statItem, { justifyContent: 'flex-end' }]}>
                                    <Text style={styles.statLabel}>अनहल</Text>
                                    <View style={[styles.statBox, { backgroundColor: '#b91c1c' }]}>
                                        <Text style={styles.statNumber}>99</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.statRow, { marginTop: 12 }]}>
                                <View style={styles.statItem}>
                                    <View style={[styles.statBox, { backgroundColor: '#bbf7d0' }]}>
                                        <Text style={[styles.statNumber, { color: '#15803d' }]}>0</Text>
                                    </View>
                                    <Text style={styles.statLabel}>सही</Text>
                                </View>
                                <View style={[styles.statItem, { justifyContent: 'flex-end' }]}>
                                    <Text style={styles.statLabel}>गलत</Text>
                                    <View style={[styles.statBox, { backgroundColor: '#fecaca' }]}>
                                        <Text style={[styles.statNumber, { color: '#b91c1c' }]}>1</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Grid */}
                        <View style={styles.gridContainer}>
                            {numbers.map((num) => {
                                const isCurrent = num === currentQuestion;
                                // Add lock icon to numbers > 5 as per screenshot pattern roughly
                                const isLocked = num > 5;

                                return (
                                    <TouchableOpacity
                                        key={num}
                                        style={[
                                            styles.gridItem,
                                            isCurrent && styles.gridItemActive
                                        ]}
                                    >
                                        <Text style={[styles.gridText, isCurrent && styles.gridTextActive]}>{num}</Text>
                                        {isLocked && (
                                            <View style={styles.lockIcon}>
                                                <Lock size={8} color="#f59e0b" fill="#f59e0b" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* Bottom Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.arrowButton}>
                            <ArrowDown color="#15803d" size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.questionButton}>
                            <Text style={styles.questionButtonText}>प्रश्न</Text>
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
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
    },
    drawer: {
        width: DRAWER_WIDTH,
        height: '100%',
        backgroundColor: '#fff',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    statsContainer: {
        marginBottom: 24,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '48%',
    },
    statBox: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    statNumber: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    statLabel: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '700',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'space-between', // Try to distribute evenly
    },
    gridItem: {
        width: (DRAWER_WIDTH - 40 - 40) / 5, // 5 cols roughly
        height: (DRAWER_WIDTH - 40 - 40) / 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 6,
        backgroundColor: '#f8fafc',
        position: 'relative',
    },
    gridItemActive: {
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
    },
    gridText: {
        color: '#0f172a',
        fontWeight: '700',
        fontSize: 14,
    },
    gridTextActive: {
        color: '#fff',
    },
    lockIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 12,
    },
    arrowButton: {
        width: 48,
        height: 48,
        backgroundColor: '#dcfce7',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#86efac',
    },
    questionButton: {
        flex: 1,
        backgroundColor: '#000',
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
