import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    Languages,
    CheckCircle2,
    Circle,
    ArrowRightCircle,
    ChevronDown
} from 'lucide-react-native';
import { API_BASE } from '../api';
import { useLanguage, T } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const PLANS = [
    {
        id: 1,
        title: 'Mission Patwari 2025-2026 – Full Test Series + PYP + Mock',
        originalPrice: 1999,
        price: 666,
        duration: '3 Months',
        discount: '67% OFF',
        inclusions: ['Tests', 'PY Papers', 'Test Series', 'Mock Tests'],
        options: [
            { id: '3m', label: '3 Months', price: 666 },
            { id: '6m', label: '6 Months', price: 999 }
        ]
    },
    {
        id: 2,
        title: 'Veterinary Officer Exam - Complete Bundle',
        originalPrice: 1999,
        price: 666,
        duration: '3 Months',
        discount: '67% OFF',
        inclusions: ['Tests', 'PY Papers', 'Test Series', 'Mock Tests'],
        options: [
            { id: '3m', label: '3 Months', price: 666 },
            { id: '6m', label: '6 Months', price: 999 }
        ]
    }
];


export default function Subscription({ onBack, token }) {
    const [activeTab, setActiveTab] = useState('select'); // 'select' or 'my_sub'
    const [selectedOptions, setSelectedOptions] = useState({}); // { planId: optionId }
    const [plans, setPlans] = useState([]);
    const { useTranslation } = useLanguage();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch(`${API_BASE}/store/plans/`);
                const data = await res.json();
                setPlans(data.results || []);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };
        fetchPlans();
    }, []);

    const handleOptionSelect = (planId, optionId) => {
        setSelectedOptions(prev => ({ ...prev, [planId]: optionId }));
    };

    const displayPlans = plans.length > 0 ? plans : PLANS;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <T style={styles.headerTitle}>Subscription</T>
                <TouchableOpacity style={styles.langButton}>
                    <Languages color="#fff" size={20} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'select' && styles.activeTab]}
                    onPress={() => setActiveTab('select')}
                >
                    <T style={[styles.tabText, activeTab === 'select' && styles.activeTabText]}>
                        Select Plan
                    </T>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'my_sub' && styles.activeTab]}
                    onPress={() => setActiveTab('my_sub')}
                >
                    <T style={[styles.tabText, activeTab === 'my_sub' && styles.activeTabText]}>
                        My Subscription
                    </T>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'select' ? (
                    displayPlans.map((plan) => {
                        // For demo/compatibility, if plan.options doesn't exist, we create one
                        const options = plan.options || [{ id: 'default', label: `${plan.duration} months`, price: plan.price }];
                        const currentOptionId = selectedOptions[plan.id] || options[0].id;
                        const currentOption = options.find(o => o.id === currentOptionId);
                        const finalPrice = Math.round(currentOption.price);

                        return (
                            <View key={plan.id} style={styles.planCard}>
                                {/* Card Header */}
                                <View style={styles.cardHeader}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}><T>Hurry!! Today's Price</T> {plan.discount}!</Text>
                                    </View>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.strikethrough}>Rs.{plan.originalPrice}</Text>
                                        <Text style={styles.mainPrice}>
                                            Rs.{finalPrice} / <T>{currentOption.label}</T>
                                        </Text>
                                    </View>
                                </View>

                                {/* Card Body */}
                                <View style={styles.cardBody}>
                                    <T style={styles.planTitle}>{plan.title}</T>
                                    <T style={styles.planDesc}>{plan.description || plan.title}</T>

                                    <View style={styles.divider}>
                                        <T style={styles.dividerLabel}>Inclusions</T>
                                    </View>

                                    <View style={styles.inclusions}>
                                        {plan.inclusions.map((inc, i) => (
                                            <View key={i} style={styles.inclusionItem}>
                                                <CheckCircle2 color="#16a34a" size={16} />
                                                <T style={styles.inclusionText}>{inc}</T>
                                            </View>
                                        ))}
                                    </View>

                                    {/* Options */}
                                    <View style={styles.optionsRow}>
                                        {plan.options.map((opt) => {
                                            const isSelected = currentOptionId === opt.id;
                                            return (
                                                <TouchableOpacity
                                                    key={opt.id}
                                                    style={[styles.optionButton, isSelected && styles.optionSelected]}
                                                    onPress={() => handleOptionSelect(plan.id, opt.id)}
                                                >
                                                    {isSelected ? (
                                                        <View style={styles.radioFilled}>
                                                            <View style={styles.radioDot} />
                                                        </View>
                                                    ) : (
                                                        <Circle color="#94a3b8" size={16} />
                                                    )}
                                                    <Text style={styles.optionLabel}>{opt.label}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    {/* Subscribe Button */}
                                    <TouchableOpacity style={styles.subscribeButton}>
                                        <T style={styles.subscribeText}>Subscribe Now</T>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <T style={styles.emptyText}>No active subscriptions found.</T>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: Platform.OS === 'android' ? 30 : 0,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#16a34a', // Icon color from image
        borderRadius: 20,
    },
    langButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#16a34a',
        borderRadius: 20,
    },
    activeTab: {
        borderBottomColor: '#16a34a',
    },
    activeTabText: {
        color: '#16a34a',
    },
    planCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    cardHeader: {
        backgroundColor: '#16a34a', // Green header
        padding: 20,
        alignItems: 'center',
    },
    badgeText: {
        color: '#16a34a',
        fontSize: 12,
        fontWeight: '700',
    },
    cardBody: {
        padding: 20,
        backgroundColor: '#f0fdf4', // Very light green bg
    },
    optionSelected: {
        borderColor: '#16a34a',
        backgroundColor: '#f0fdf4',
    },
    radioFilled: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#16a34a',
    },
    subscribeButton: {
        backgroundColor: '#16a34a',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    subscribeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 14,
    },
});
