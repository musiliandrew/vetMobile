import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Star,
    ChevronLeft
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE } from '../api';
import { T } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const STATIC_COIN_PACKAGES = [
    { id: 1, coins_amount: 50, original_price: 250, price: 25 },
    { id: 2, coins_amount: 100, original_price: 500, price: 50 },
    { id: 3, coins_amount: 150, original_price: 750, price: 70 },
    { id: 4, coins_amount: 200, original_price: 1000, price: 90 },
    { id: 5, coins_amount: 300, original_price: 1500, price: 130 },
    { id: 6, coins_amount: 400, original_price: 2000, price: 160 },
    { id: 7, coins_amount: 500, original_price: 2500, price: 200 },
    { id: 8, coins_amount: 1000, original_price: 5000, price: 350 },
    { id: 9, coins_amount: 1500, original_price: 7500, price: 500 },
    { id: 10, coins_amount: 2000, original_price: 10000, price: 650 },
];

export default function DrugCoins({ onNavigate, onBack }) {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(`${API_BASE}/store/packages/`);
                const data = await res.json();
                setPackages(data.results || []);
            } catch (error) {
                console.error("Error fetching coin packages:", error);
            }
        };
        fetchPackages();
    }, []);

    const displayPackages = packages.length > 0 ? packages : STATIC_COIN_PACKAGES;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <ChevronLeft color="#1e293b" size={28} />
                </TouchableOpacity>
                <T style={styles.headerTitle}>Drug Coins</T>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Balance Card */}
                <LinearGradient
                    colors={['#3b82f6', '#7c3aed']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <View style={styles.balanceContent}>
                        <T style={styles.balanceLabel}>Current Balance</T>
                        <Text style={styles.balanceAmount}>422000 <T>Coins</T></Text>
                        <TouchableOpacity style={styles.depositButton}>
                            <T style={styles.depositText}>Deposit</T>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.coinContainer}>
                        <View style={styles.coinCircleExternal}>
                            <View style={styles.coinCircleInternal}>
                                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Coin Packages Grid */}
                <View style={styles.grid}>
                    {displayPackages.map((pkg) => (
                        <View key={pkg.id} style={styles.packageCard}>
                            <View style={styles.packageHeader}>
                                <View>
                                    <Text style={styles.coinCount}>{pkg.coins_amount} <T>Coins</T></Text>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.originalPrice}>Rs.{pkg.original_price}</Text>
                                        <Text style={styles.currentPrice}>Rs.{pkg.price}</Text>
                                    </View>
                                </View>
                                {/* Coin Stack Illustration Visualization */}
                                <View style={styles.coinStack}>
                                    <View style={[styles.miniCoin, { bottom: 0 }]} />
                                    <View style={[styles.miniCoin, { bottom: 4 }]} />
                                    <View style={[styles.miniCoin, { bottom: 8 }]} />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.plusButton}>
                                <T style={styles.plusText}>+</T>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buyButton}>
                                <T style={styles.buyText}>Buy</T>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: Platform.OS === 'android' ? 30 : 0,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#15803d', // Green
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    balanceCard: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    balanceContent: {
        flex: 1,
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 28, // Slightly smaller to fit if needed
        fontWeight: '800',
        marginBottom: 16,
    },
    depositButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 25,
        alignSelf: 'flex-start',
    },
    depositText: {
        color: '#7c3aed',
        fontWeight: '700',
        fontSize: 14,
    },
    coinContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinCircleExternal: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinCircleInternal: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f59e0b',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fbbf24',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    packageCard: {
        width: (width - 52) / 2,
        backgroundColor: '#f0fdf4', // Light green background
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        marginBottom: 8,
    },
    buyButton: {
        backgroundColor: '#16a34a', // Green button
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buyText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});
