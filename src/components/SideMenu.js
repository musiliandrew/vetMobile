import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Home,
    BookOpen,
    FileText,
    Pill,
    GraduationCap,
    Layers,
    Bookmark,
    StickyNote,
    Wallet,
    Lock,
    UserCog,
    Crown,
    RefreshCcw,
    Globe,
    Languages,
    Info,
    Phone,
    Star,
    FileCheck,
    Shield,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Globe2,
    Bell,
    Trash2,
    LogOut,
    ChevronRight,
    User
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.82;

const MENU_SECTIONS = [
    {
        title: 'Main Menu',
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: Home, color: '#16a34a', navigateTo: 'dashboard' },
            { id: 'qbank', label: 'Question Bank', navigateTo: 'ebook' }, // Mapping for demo
            { id: 'ebooks', label: 'Ebooks', navigateTo: 'ebook' },
            { id: 'shortnotes', label: 'Short Notes' },
            { id: 'drugcenter', label: 'Drug Center', navigateTo: 'drug_center' },
            { id: 'tests', label: 'Test & PYPs' },
            { id: 'flashcards', label: 'Flash Cards' },
        ]
    },
    {
        title: 'Personal',
        items: [
            { id: 'bookmark', label: 'Bookmarked Content', icon: Bookmark, hideIcon: true },
            { id: 'notes', label: 'Sticky Notes', icon: StickyNote, hideIcon: true },
            { id: 'wallet', label: 'Referral Wallet', icon: Wallet, hideIcon: true },
        ]
    },
    {
        title: 'General',
        items: [
            { id: 'password', label: 'Change Password', icon: Lock, color: '#0ea5e9' },
            { id: 'profile', label: 'Edit Profile', icon: UserCog, color: '#0f766e' },
            { id: 'premium', label: 'Premium', icon: Crown, color: '#f59e0b', navigateTo: 'subscription' },
            { id: 'restore', label: 'Restore Plan', icon: RefreshCcw, color: '#22c55e' },
            { id: 'contentLang', label: 'Content Language', icon: FileText, color: '#3b82f6' },
            { id: 'appLang', label: 'App Language', icon: Languages, color: '#84cc16' },
        ]
    },
    {
        title: 'About',
        items: [
            { id: 'about', label: 'About US', icon: Info, color: '#f97316' },
            { id: 'contact', label: 'Contact US', icon: Phone, color: '#0ea5e9' },
            { id: 'reviews', label: 'Reviews', icon: Star, color: '#eab308' },
            { id: 'terms', label: 'Terms & Conditions', icon: FileCheck, color: '#4f46e5' },
            { id: 'privacy', label: 'Privacy Policy', icon: Shield, color: '#ef4444' },
        ]
    },
    {
        title: 'Suggested Link',
        items: [
            { id: 'ig', label: 'VK Instagram', icon: Instagram, color: '#d946ef' },
            { id: 'fb', label: 'VK Facebook', icon: Facebook, color: '#3b82f6' },
            { id: 'li', label: 'VK Linkedin', icon: Linkedin, color: '#0284c7' },
            { id: 'x', label: 'VK X (Twitter)', icon: Twitter, color: '#000000' },
            { id: 'web', label: 'VK Website', icon: Globe2, color: '#22c55e' },
        ]
    },
    {
        title: 'Miscellaneous',
        items: [
            { id: 'notif', label: 'Notification', icon: Bell, color: '#eab308' },
            { id: 'delete', label: 'Delete Profile', icon: Trash2, color: '#ef4444' },
            { id: 'logout', label: 'Log Out', icon: LogOut, color: '#dc2626' },
        ]
    }
];

import { useLanguage, T } from '../context/LanguageContext';

export default function SideMenu({ visible, onClose, userName = "Rohan Rai", email = "vetstudywithnk@gmail.com", onNavigate }) {
    const { useTranslation } = useLanguage();

    if (!visible) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

                <View style={styles.sidebar}>
                    {/* Profile Header */}
                    <View style={styles.profileHeader}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/60' }}
                            style={styles.avatar}
                        />
                        {/* Fallback avatar if Image fails or for demo */}
                        <View style={[styles.avatar, styles.fallbackAvatar]}>
                            <User size={30} color="#fff" />
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName} numberOfLines={1}>{userName}</Text>
                            <Text style={styles.profileEmail} numberOfLines={1}>{email}</Text>
                            <TouchableOpacity>
                                <T style={styles.viewProfile}>View Profile</T>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.menuContainer}
                    >
                        {MENU_SECTIONS.map((section, index) => (
                            <View key={index} style={styles.section}>
                                <T style={styles.sectionTitle}>{section.title}</T>
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.menuItem}
                                            onPress={() => {
                                                onClose();
                                                if (item.navigateTo && onNavigate) {
                                                    onNavigate(item.navigateTo);
                                                } else if (item.id === 'logout' && onNavigate) {
                                                    onNavigate('signin');
                                                }
                                            }}
                                        >
                                            <View style={styles.menuItemLeft}>
                                                {Icon && !item.hideIcon && (
                                                    <View style={styles.iconContainer}>
                                                        <Icon size={20} color={item.color || '#334155'} />
                                                    </View>
                                                )}
                                                <T style={[
                                                    styles.menuItemLabel,
                                                    item.id === 'dashboard' && styles.activeLabel,
                                                    !Icon && styles.indentedLabel
                                                ]}>
                                                    {item.label}
                                                </T>
                                            </View>
                                            <ChevronRight size={16} color="#94a3b8" />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))}
                        <View style={{ height: 40 }} />
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
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
    },
    sidebar: {
        width: SIDEBAR_WIDTH,
        height: '100%',
        backgroundColor: '#fff',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    profileHeader: {
        backgroundColor: '#16a34a', // Brand Green Header
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 0,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
        marginRight: 15,
    },
    fallbackAvatar: {
        position: 'absolute',
        left: 20,
        top: 50,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    profileEmail: {
        color: '#94a3b8',
        fontSize: 12,
        marginBottom: 4,
    },
    viewProfile: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    menuContainer: {
        paddingVertical: 10,
    },
    section: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 24,
        marginRight: 12,
        alignItems: 'center',
    },
    menuItemLabel: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '600',
    },
    activeLabel: {
        color: '#16a34a',
    },
    indentedLabel: {
        marginLeft: 36, // Align with items that have icons if current item has no icon
    },
});
