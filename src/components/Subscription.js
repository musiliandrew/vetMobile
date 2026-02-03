import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform
} from 'react-native';
import {
    ChevronLeft,
    Languages,
    CheckCircle2,
    Circle,
    ArrowRightCircle,
    ChevronDown
} from 'lucide-react-native';
import { API_BASE } from '../api';

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
                <Text style={styles.headerTitle}>Subscription</Text>
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
                    <Text style={[styles.tabText, activeTab === 'select' && styles.activeTabText]}>
                        Select Plan
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'my_sub' && styles.activeTab]}
                    onPress={() => setActiveTab('my_sub')}
                >
                    <Text style={[styles.tabText, activeTab === 'my_sub' && styles.activeTabText]}>
                        My Subscription
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'select' ? (
                    displayPlans.map((plan) => {
                        // For demo/compatibility, if plan.options doesn't exist, we create one
                        const options = plan.options || [{ id: 'default', label: `${plan.duration_months} Months`, price: plan.base_price * (1 - plan.discount_percentage / 100) }];
                        const currentOptionId = selectedOptions[plan.id] || options[0].id;
                        const currentOption = options.find(o => o.id === currentOptionId);
                        const finalPrice = Math.round(currentOption.price);

                        return (
                            <View key={plan.id} style={styles.planCard}>
                                {/* Card Header */}
                                <View style={styles.cardHeader}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Hurry!! Today's Price {plan.discount_percentage}% OFF!</Text>
                                    </View>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.strikethrough}>Rs.{plan.base_price}</Text>
                                        <Text style={styles.mainPrice}>
                                            Rs.{finalPrice} / {currentOption.label}
                                        </Text>
                                    </View>
                                </View>

                                {/* Card Body */}
                                <View style={styles.cardBody}>
                                    <Text style={styles.planTitle}>{plan.title}</Text>
                                    <Text style={styles.planDesc}>{plan.title}</Text>

                                    {/* Inclusions */}
                                    <View style={styles.dividerRow}>
                                        <Text style={styles.dividerLabel}>Inclusions</Text>
                                        <View style={styles.dividerLine} />
                                    </View>

                                    <View style={styles.inclusionsGrid}>
                                        {plan.inclusions.map((inc, index) => (
                                            <View key={index} style={styles.inclusionItem}>
                                                <CheckCircle2 color="#16a34a" size={18} fill="#dcfce7" />
                                                <Text style={styles.inclusionText}>{inc}</Text>
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
                                                        <Circle color="#6366f1" size={16} />
                                                    )}
                                                    <Text style={styles.optionLabel}>{opt.label}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    {/* Subscribe Button */}
                                    <TouchableOpacity style={styles.subscribeButton}>
                                        <Text style={styles.subscribeText}>Subscribe Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No active subscriptions found.</Text>
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
        backgroundColor: '#4f46e5', // Icon color from image
        borderRadius: 20,
    },
    langButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4f46e5',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#16a34a', // Green title
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#4f46e5',
    },
    tabText: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#4f46e5',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    planCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e7ff',
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    cardHeader: {
        backgroundColor: '#6366f1', // Purple header
        padding: 20,
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 10,
    },
    badgeText: {
        color: '#4f46e5',
        fontSize: 12,
        fontWeight: '700',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    strikethrough: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textDecorationLine: 'line-through',
    },
    mainPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    cardBody: {
        padding: 20,
        backgroundColor: '#f5f3ff', // Very light purple/gray bg
    },
    planTitle: {
        fontSize: 16,
        fontWeight: '800', // Bold
        color: '#000',
        marginBottom: 8,
        lineHeight: 22,
    },
    planDesc: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 12,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    dividerLabel: {
        fontSize: 12,
        color: '#64748b',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    inclusionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
    },
    inclusionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '45%',
        gap: 6,
    },
    inclusionText: {
        fontSize: 12,
        color: '#1e293b',
        fontWeight: '500',
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e0e7ff',
        borderRadius: 8,
        backgroundColor: '#fff',
        gap: 6,
    },
    optionSelected: {
        borderColor: '#6366f1',
        backgroundColor: '#eef2ff',
    },
    optionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1e293b',
    },
    radioFilled: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6366f1',
    },
    subscribeButton: {
        backgroundColor: '#6366f1',
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
