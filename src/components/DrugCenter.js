import React from 'react';
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
    Menu,
    Bell,
    Languages,
    DollarSign,
    Home,
    BookOpen,
    Pill,
    Crown,
    Settings,
    Star
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

import { useLanguage, T } from '../context/LanguageContext';

export default function DrugCenter({ onNavigate, onOpenStore, coinBalance = 0, userName = "User" }) {
    const { useTranslation } = useLanguage();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.menuButton}>
                                <Menu color="#fff" size={24} />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerTitle}>VetPathshala Education</Text>
                                <Text style={styles.headerSubtitle}><T>Welcome Back</T> {userName}</Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            {/* Circle Icon Placeholder matching previous screen */}
                            <TouchableOpacity style={styles.iconButton}>
                                <View style={styles.circleIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Languages color="#fff" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Bell color="#fff" size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <T style={styles.pageTitle}>Drug Center</T>

                {/* Balance Card */}
                <LinearGradient
                    colors={['#3b82f6', '#7c3aed']} // Blue to Purple gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <View style={styles.balanceContent}>
                        <T style={styles.balanceLabel}>Current Balance</T>
                        <Text style={styles.balanceAmount}>{coinBalance} <T>Coins</T></Text>
                        <TouchableOpacity
                            style={styles.depositButton}
                            onPress={onOpenStore}
                        >
                            <T style={styles.depositText}>Deposit</T>
                        </TouchableOpacity>
                    </View>
                    {/* Coin Icon on right */}
                    <View style={styles.coinContainer}>
                        <View style={styles.coinCircleExternal}>
                            <View style={styles.coinCircleInternal}>
                                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Menu Cards */}
                <TouchableOpacity style={styles.menuCard} activeOpacity={0.9}>
                    <LinearGradient
                        colors={['#d6d3d1', '#a8a29e']} // Placeholder gradient simulating image
                        style={styles.menuCardImage}
                    />
                    <View style={styles.menuCardContent}>
                        <T style={styles.menuCardTitle}>Drug Calculator</T>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuCard} activeOpacity={0.9}>
                    <LinearGradient
                        colors={['#d6d3d1', '#a8a29e']} // Placeholder gradient simulating image
                        style={styles.menuCardImage}
                    />
                    <View style={styles.menuCardContent}>
                        <T style={styles.menuCardTitle}>Drug Index</T>
                    </View>
                </TouchableOpacity>

            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('dashboard')}>
                    <Home color="#64748b" size={24} />
                    <T style={styles.navLabel}>Home</T>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('ebook')}>
                    <BookOpen color="#64748b" size={24} />
                    <T style={styles.navLabel}>Ebook</T>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => { }}>
                    <Pill color="#16a34a" size={24} />
                    <T style={[styles.navLabel, { color: '#16a34a' }]}>Drug Index</T>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={onOpenStore}>
                    <Crown color="#f59e0b" size={24} />
                    <T style={styles.navLabel}>Store</T>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Settings color="#64748b" size={24} />
                    <T style={styles.navLabel}>Settings</T>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#16a34a',
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: '#dcfce7',
        fontSize: 12,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        width: 36,
        height: 36,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#86efac',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#15803d', // Dark green
        marginBottom: 20,
        marginTop: 10,
    },
    balanceCard: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
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
        fontSize: 32,
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
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinCircleInternal: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f59e0b', // Gold
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fbbf24',
    },
    menuCard: {
        width: '100%',
        height: 180,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    menuCardImage: {
        flex: 1,
        width: '100%',
    },
    menuCardContent: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    menuCardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#15803d',
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
    },
    navLabel: {
        fontSize: 10,
        color: '#64748b',
    },
});
