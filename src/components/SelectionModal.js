import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Modal,
    Platform
} from 'react-native';
import {
    X,
    History,
    Coins
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

import { useLanguage, T } from '../context/LanguageContext';

export default function SelectionModal({ visible, onClose, onSelectCoins, onSelectSubscription }) {
    const { useTranslation } = useLanguage();
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <T style={styles.modalTitle}>Choose An Option Below</T>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <X color="#0f172a" size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsContainer}>
                        {/* Drug Coins Option */}
                        <TouchableOpacity
                            style={styles.optionCard}
                            onPress={() => {
                                onClose();
                                onSelectCoins();
                            }}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#fff7ed', '#ffedd5']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.iconCircleCoin}>
                                    <Coins color="#f59e0b" size={32} />
                                </View>
                                <T style={styles.optionTitle}>Drug Coins</T>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Subscription Option */}
                        <TouchableOpacity
                            style={styles.optionCard}
                            onPress={() => {
                                onClose();
                                onSelectSubscription();
                            }}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#f1f5f9', '#e2e8f0']} // Grey gradient
                                style={styles.cardGradient}
                            >
                                <View style={styles.iconCircleSub}>
                                    <History color="#1e293b" size={32} strokeWidth={2.5} />
                                </View>
                                <T style={styles.optionTitle}>Subscription</T>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: width - 40,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
    },
    optionCard: {
        flex: 1,
        height: 140,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    iconCircleCoin: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fbbf24', // Gold bg
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#f59e0b',
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    iconCircleSub: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#1e293b', // Dark border
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
});
