import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    Platform
} from 'react-native';
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
    ChevronRight,
    Facebook,
    Twitter,
    Youtube,
    Instagram,
    Linkedin,
    Send,
    MessageCircle,
    Mail
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SideMenu from './SideMenu';
import { API_BASE } from '../api';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: 1, title: 'Question Bank', color: ['#fff1f2', '#ffe4e6'] },
    { id: 2, title: 'Short Notes', color: ['#ecfdf5', '#d1fae5'] },
    { id: 3, title: 'Ebooks', color: ['#fff7ed', '#ffedd5'] },
    { id: 4, title: 'Drug Center', color: ['#eff6ff', '#dbeafe'] },
    { id: 5, title: 'Audio Learning', color: ['#faf5ff', '#f3e8ff'] },
    { id: 6, title: 'Test & Pyps', color: ['#f0fdfa', '#ccfbf1'] },
    { id: 7, title: 'Flash Cards', color: ['#fdf2f8', '#fce7f3'] },
];

const RECENT_ACTIVITY = [
    {
        id: 1,
        title: 'Question Bank',
        progress: '475/30371 Questions',
        percent: 0.02,
        color: '#e0e7ff',
        barColor: '#6366f1'
    },
    {
        id: 2,
        title: 'Tests & Quizzes',
        progress: '9/65 Quizzes',
        percent: 0.14,
        color: '#ffedd5',
        barColor: '#f97316'
    }
];

const SOCIALS = [
    { id: 1, icon: Facebook, color: '#1877f2', label: 'Facebook' },
    { id: 2, icon: Twitter, color: '#1da1f2', label: 'Twitter' },
    { id: 3, icon: Youtube, color: '#ff0000', label: 'YouTube' },
    { id: 4, icon: Instagram, color: '#e1306c', label: 'Instagram' },
    { id: 5, icon: Linkedin, color: '#0077b5', label: 'LinkedIn' },
    { id: 6, icon: Send, color: '#0088cc', label: 'Telegram' },
    { id: 7, icon: MessageCircle, color: '#25d366', label: 'WhatsApp' },
    { id: 8, icon: Mail, color: '#ea4335', label: 'Email' },
];

export default function Dashboard({ userRole, userName = "Nikhil", onNavigate, onOpenStore }) {
    const [menuVisible, setMenuVisible] = React.useState(false);
    const [banners, setBanners] = React.useState([]);
    const [testimonials, setTestimonials] = React.useState([]);
    const [subjects, setSubjects] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {

                const [bannerRes, testimonialRes, subjectRes] = await Promise.all([
                    fetch(`${API_BASE}/content/banners/`).then(res => res.json()),
                    fetch(`${API_BASE}/content/testimonials/`).then(res => res.json()),
                    fetch(`${API_BASE}/qbank/subjects/`).then(res => res.json())
                ]);

                setBanners(bannerRes.results || []);
                setTestimonials(testimonialRes.results || []);
                setSubjects(subjectRes.results || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <SideMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                userName={userName}
                onNavigate={onNavigate}
            />
            {/* Header */}
            <View style={styles.header}>
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
                                <Menu color="#fff" size={24} />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerTitle}>VetPathshala Education</Text>
                                <Text style={styles.headerSubtitle}>Welcome Back {userName}</Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconButton}>
                                <DollarSign color="#fff" size={20} />
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
                {/* Banner */}
                {banners.length > 0 ? (
                    <LinearGradient
                        colors={['#fdf4ff', '#fae8ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.banner}
                    >
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>{banners[0].title}</Text>
                            <Text style={styles.bannerText}>{banners[0].description}</Text>
                        </View>
                        <View style={styles.bannerIllustration}>
                            <View style={[styles.coin, { top: 0, right: 0 }]} />
                            <View style={[styles.coin, { bottom: 10, right: 30, backgroundColor: '#fbbf24' }]} />
                            <View style={[styles.coin, { top: 20, right: 50, width: 20, height: 20 }]} />
                        </View>
                    </LinearGradient>
                ) : (
                    <LinearGradient
                        colors={['#fdf4ff', '#fae8ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.banner}
                    >
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>Invite Friends & Earn Big!</Text>
                            <Text style={styles.bannerText}>
                                You get 100 Coins + 10% Cash Commission.
                            </Text>
                            <Text style={styles.bannerText}>Your friend gets 50 Coins.</Text>
                        </View>
                        <View style={styles.bannerIllustration}>
                            <View style={[styles.coin, { top: 0, right: 0 }]} />
                            <View style={[styles.coin, { bottom: 10, right: 30, backgroundColor: '#fbbf24' }]} />
                            <View style={[styles.coin, { top: 20, right: 50, width: 20, height: 20 }]} />
                        </View>
                    </LinearGradient>
                )}

                {/* Categories */}
                <Text style={styles.sectionTitle}>Choose Category</Text>
                <View style={styles.grid}>
                    {subjects.length > 0 ? subjects.map((sub) => (
                        <TouchableOpacity
                            key={sub.id}
                            style={styles.categoryCard}
                            onPress={() => {
                                onNavigate('question_bank', { subjectId: sub.id });
                            }}
                        >
                            <LinearGradient
                                colors={['#eff6ff', '#dbeafe']}
                                style={styles.categoryGradient}
                            >
                                <View style={[styles.categoryImagePlaceholder, { backgroundColor: 'rgba(0,0,0,0.05)' }]} />
                            </LinearGradient>
                            <Text style={styles.categoryTitle}>{sub.title_en}</Text>
                            <View style={styles.categoryBorder} />
                        </TouchableOpacity>
                    )) : CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.categoryCard}
                            onPress={() => {
                                if (cat.title === 'Ebooks') {
                                    onNavigate('ebook');
                                } else if (cat.title === 'Drug Center') {
                                    onNavigate('drug_center');
                                } else if (cat.title === 'Question Bank') {
                                    onNavigate('question_bank');
                                }
                            }}
                        >
                            <LinearGradient
                                colors={cat.color}
                                style={styles.categoryGradient}
                            >
                                {/* Placeholder for category image */}
                                <View style={[styles.categoryImagePlaceholder, { backgroundColor: 'rgba(0,0,0,0.05)' }]} />
                            </LinearGradient>
                            <Text style={styles.categoryTitle}>{cat.title}</Text>
                            <View style={styles.categoryBorder} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Activity */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recent Activity</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityScroll}>
                    {RECENT_ACTIVITY.map((activity) => (
                        <View key={activity.id} style={[styles.activityCard, { backgroundColor: activity.color }]}>
                            <Text style={styles.activityTitle}>{activity.title}</Text>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${activity.percent * 100}%`, backgroundColor: activity.barColor }]} />
                            </View>
                            <Text style={[styles.activityProgress, { color: activity.barColor }]}>{activity.progress}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Success Stories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Success Stories</Text>
                    <TouchableOpacity style={styles.seeAllBtn}>
                        <Text style={styles.seeAllText}>See All</Text>
                        <ChevronRight size={16} color="#3b82f6" />
                    </TouchableOpacity>
                </View>

                <View style={styles.testimonialCard}>
                    {testimonials.length > 0 ? (
                        <>
                            <Text style={styles.testimonialText}>
                                "{testimonials[0].content}"
                            </Text>
                            <View style={styles.testimonialUser}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {testimonials[0].user_name.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>{testimonials[0].user_name}</Text>
                                    <Text style={styles.userRole}>{testimonials[0].user_role}</Text>
                                </View>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={styles.testimonialText}>
                                "VetPathshala helped me pass my exams with flying colors. The Q Bank and lectures were incredibly helpful for my preparation."
                            </Text>
                            <View style={styles.testimonialUser}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>DR</Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>Dr. Rajesh Kumar</Text>
                                    <Text style={styles.userRole}>BVSc, MVSc</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* Connect With Us */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Connect With Us</Text>
                </View>
                <View style={styles.socialGrid}>
                    {SOCIALS.map((social) => {
                        const Icon = social.icon;
                        return (
                            <TouchableOpacity key={social.id} style={styles.socialItem}>
                                <View style={[styles.socialCircle, { backgroundColor: social.color }]}>
                                    <Icon color="#fff" size={20} />
                                </View>
                                <Text style={styles.socialLabel}>{social.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('dashboard')}>
                    <Home color="#16a34a" size={24} />
                    <Text style={[styles.navLabel, { color: '#16a34a' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('ebook')}>
                    <BookOpen color="#64748b" size={24} />
                    <Text style={styles.navLabel}>Ebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('drug_center')}>
                    <Pill color="#64748b" size={24} />
                    <Text style={styles.navLabel}>Drug Index</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={onOpenStore}>
                    <Crown color="#f59e0b" size={24} />
                    <Text style={styles.navLabel}>Store</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Settings color="#64748b" size={24} />
                    <Text style={styles.navLabel}>Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#16a34a', // Green header
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    banner: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0abfc',
    },
    bannerContent: {
        flex: 1,
        zIndex: 1,
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 8,
    },
    bannerText: {
        fontSize: 12,
        color: '#475569',
        marginBottom: 2,
    },
    bannerIllustration: {
        position: 'absolute',
        right: -10,
        top: 0,
        bottom: 0,
        width: 100,
    },
    coin: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fbbf24',
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#f59e0b',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: (width - 52) / 2, // 2 column layout taking into account padding
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    categoryGradient: {
        height: 80,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryImagePlaceholder: {
        width: '100%',
        height: '100%',
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#166534',
        textAlign: 'center',
        paddingVertical: 10,
    },
    categoryBorder: {
        height: 3,
        backgroundColor: 'transparent',
    },
    activityScroll: {
        marginBottom: 24,
    },
    activityCard: {
        width: 200,
        padding: 16,
        borderRadius: 12,
        marginRight: 12,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 12,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    activityProgress: {
        fontSize: 12,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 10,
    },
    seeAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        color: '#3b82f6',
        fontSize: 12,
        fontWeight: '600',
    },
    testimonialCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 24,
    },
    testimonialText: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 20,
        fontStyle: 'italic',
        marginBottom: 16,
    },
    testimonialUser: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
    },
    userName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
    },
    userRole: {
        fontSize: 12,
        color: '#64748b',
    },
    socialGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'center',
        marginBottom: 20,
    },
    socialItem: {
        alignItems: 'center',
        width: 70,
    },
    socialCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    socialLabel: {
        fontSize: 10,
        color: '#64748b',
        textAlign: 'center',
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
