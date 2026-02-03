import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform,
    Image,
    TextInput
} from 'react-native';
import {
    Menu,
    Bell,
    Search,
    Star,
    ArrowRight,
    Home,
    BookOpen,
    Pill,
    Crown,
    Settings,
    Languages,
    Heart,
    Share2
} from 'lucide-react-native';
import { API_BASE } from '../api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SUBJECTS = [
    { id: 1, name: 'Abdul Kalam', color: '#1e293b' },
    { id: 2, name: 'Mahatma Gandhi', color: '#b45309' },
    { id: 3, name: 'Jawaharlal', color: '#eab308' },
    { id: 4, name: 'Thomas', color: '#64748b' },
    { id: 5, name: 'China Ac...', color: '#ef4444' },
];

const BOOKS = [
    {
        id: 1,
        title: 'Dark Desire',
        author: 'Vivek Shukla',
        rating: 4,
        price: 'Free',
        imageColor: '#f59e0b',
        isPremium: false
    },
    {
        id: 2,
        title: 'Grave Mistake',
        author: 'Frances Liardet',
        rating: 4,
        price: '$ 499',
        imageColor: '#64748b',
        isPremium: true
    },
    {
        id: 3,
        title: 'The Demon Girl',
        author: 'Bertus Aafjes',
        rating: 5,
        price: '$ 299',
        imageColor: '#ef4444',
        isPremium: true
    },
];

import { useLanguage } from '../context/LanguageContext';

export default function EbookPage({ onNavigate }) {
    const [categories, setCategories] = useState([]);
    const [books, setBooks] = useState([]);
    const [featuredBook, setFeaturedBook] = useState(null);
    const { useTranslation } = useLanguage();

    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const [catRes, bookRes] = await Promise.all([
                    fetch(`${API_BASE}/content/ebook-categories/`).then(res => res.json()),
                    fetch(`${API_BASE}/content/books/`).then(res => res.json())
                ]);

                setCategories(catRes.results || []);
                const fetchedBooks = bookRes.results || [];
                setBooks(fetchedBooks);
                if (fetchedBooks.length > 0) setFeaturedBook(fetchedBooks[0]);
            } catch (error) {
                console.error("Error fetching ebooks:", error);
            }
        };
        fetchEbooks();
    }, []);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={12}
                fill={i < rating ? "#f59e0b" : "transparent"}
                color={i < rating ? "#f59e0b" : "#cbd5e1"}
            />
        ));
    };

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
                                <Text style={styles.headerSubtitle}>{useTranslation('Welcome Back')} Nikhil</Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconButton}>
                                <View style={styles.circleIcon} />
                                {/* Placeholder for coin/circle icon in screenshot */}
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
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search color="#94a3b8" size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={useTranslation("Search book here..")}
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {/* Featured Banner */}
                {featuredBook && (
                    <LinearGradient
                        colors={['#ffe4e6', '#fce7f3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.banner}
                    >
                        <View style={styles.bannerImageContainer}>
                            <View style={[styles.bookCover, { backgroundColor: featuredBook.cover_color || '#1e1b4b' }]} />
                        </View>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>{featuredBook.title}</Text>
                            <Text style={styles.bannerAuthor}>by {featuredBook.author}</Text>
                            <TouchableOpacity style={styles.exploreButton}>
                                <Text style={styles.exploreText}>{useTranslation('Explore Now')}</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                )}

                {/* Choose Subject */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{useTranslation('Choose Subject.')}</Text>
                    <ArrowRight color="#faa935" size={20} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
                    {categories.map((sub) => (
                        <TouchableOpacity key={sub.id} style={styles.subjectItem}>
                            <View style={styles.subjectImageContainer}>
                                <View style={[styles.subjectImage, { backgroundColor: sub.color_code }]} />
                            </View>
                            <Text style={styles.subjectName} numberOfLines={1}>{sub.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Continue Reading */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{useTranslation('Continue Reading')}</Text>
                    <ArrowRight color="#faa935" size={20} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookScroll}>
                    {books.map((book) => (
                        <TouchableOpacity key={book.id} style={styles.continueCard}>
                            <View style={[styles.continueCover, { backgroundColor: book.cover_color || '#fb7185' }]}>
                                <Text style={styles.coverText}>{book.title.split(' ')[0]}</Text>
                            </View>
                            <Text style={styles.bookTitleSmall} numberOfLines={1}>{book.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Trending Books */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{useTranslation('Trending Books')}</Text>
                    <ArrowRight color="#faa935" size={20} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookScroll}>
                    {books.map((book) => (
                        <TouchableOpacity key={book.id} style={styles.trendingCard}>
                            <View style={[styles.trendingCover, { backgroundColor: book.cover_color || '#6366f1' }]}>
                                {book.is_premium && (
                                    <View style={styles.premiumBadge}>
                                        <Crown color="#fff" size={10} />
                                        <Text style={styles.premiumText}>{useTranslation('Premium')}</Text>
                                    </View>
                                )}
                                <Text style={styles.coverTitleLarge}>{book.title}</Text>
                            </View>
                            <View style={styles.bookInfo}>
                                <Text style={styles.bookTitle}>{book.title}</Text>
                                <Text style={styles.bookAuthor}>by {book.author}</Text>
                                <View style={styles.ratingRow}>
                                    <View style={styles.stars}>{renderStars(book.rating)}</View>
                                    <Text style={styles.ratingText}>{book.rating}</Text>
                                    <View style={[styles.priceTag, parseFloat(book.price) === 0 ? styles.freeTag : styles.paidTag]}>
                                        <Text style={[styles.priceText, parseFloat(book.price) === 0 ? styles.freeText : styles.paidText]}>
                                            {parseFloat(book.price) === 0 ? useTranslation('Free') : `Rs.${book.price}`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Popular Books */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{useTranslation('Popular Books')}</Text>
                    <ArrowRight color="#faa935" size={20} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookScroll}>
                    {BOOKS.map((book) => (
                        <TouchableOpacity key={book.id} style={styles.trendingCard}>
                            <View style={[styles.trendingCover, { backgroundColor: book.imageColor }]}>
                                {book.isPremium && (
                                    <View style={styles.premiumBadge}>
                                        <Crown color="#fff" size={10} />
                                        <Text style={styles.premiumText}>{useTranslation('Premium')}</Text>
                                    </View>
                                )}
                                <Text style={styles.coverTitleLarge}>{book.title}</Text>
                            </View>
                            <View style={styles.bookInfo}>
                                <Text style={styles.bookTitle}>{book.title}</Text>
                                <Text style={styles.bookAuthor}>by {book.author}</Text>
                                <View style={styles.ratingRow}>
                                    <View style={styles.stars}>{renderStars(book.rating)}</View>
                                    <Text style={styles.ratingText}>{book.rating}</Text>
                                    <View style={[styles.priceTag, book.price === 'Free' ? styles.freeTag : styles.paidTag]}>
                                        <Text style={[styles.priceText, book.price === 'Free' ? styles.freeText : styles.paidText]}>
                                            {book.price === 'Free' ? useTranslation('Free') : book.price}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('dashboard')}>
                    <Home color="#64748b" size={24} />
                    <Text style={styles.navLabel}>{useTranslation('Home')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <BookOpen color="#16a34a" size={24} fill="#16a34a" />
                    <Text style={[styles.navLabel, { color: '#16a34a', fontWeight: '700' }]}>{useTranslation('Ebook')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Pill color="#64748b" size={24} />
                    <Text style={styles.navLabel}>{useTranslation('Drug Index')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Crown color="#f59e0b" size={24} />
                    <Text style={styles.navLabel}>{useTranslation('Store')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Settings color="#64748b" size={24} />
                    <Text style={styles.navLabel}>{useTranslation('Settings')}</Text>
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
        paddingBottom: 100,
    },
    searchContainer: {
        margin: 20,
        marginTop: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#1e293b',
    },
    banner: {
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerImageContainer: {
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    bookCover: {
        width: 80,
        height: 110,
        borderRadius: 6,
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 4,
    },
    bannerAuthor: {
        fontSize: 14,
        color: '#be123c',
        marginBottom: 16,
        fontWeight: '600',
    },
    exploreButton: {
        backgroundColor: '#fb7185',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    exploreText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    subjectScroll: {
        paddingLeft: 20,
        marginBottom: 24,
    },
    subjectItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 70,
    },
    subjectImageContainer: {
        padding: 3,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 8,
    },
    subjectImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    subjectName: {
        fontSize: 11,
        color: '#475569',
        textAlign: 'center',
        fontWeight: '600',
    },
    bookScroll: {
        paddingLeft: 20,
        marginBottom: 24,
    },
    continueCard: {
        marginRight: 16,
        width: 100,
    },
    continueCover: {
        width: 100,
        height: 140,
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverText: {
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '800',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    bookTitleSmall: {
        fontSize: 12,
        color: '#334155',
        fontWeight: '600',
    },
    trendingCard: {
        marginRight: 16,
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    trendingCover: {
        width: '100%',
        height: 160,
        borderRadius: 8,
        marginBottom: 8,
        padding: 10,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverTitleLarge: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    coverAuthorLarge: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 4,
    },
    premiumBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#f59e0b', // Gold/Orange
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        gap: 4,
    },
    premiumText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '700',
    },
    bookInfo: {
        paddingHorizontal: 4,
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    bookAuthor: {
        fontSize: 11,
        color: '#64748b',
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stars: {
        flexDirection: 'row',
        gap: 1,
    },
    ratingText: {
        fontSize: 11,
        color: '#64748b',
        marginLeft: 4,
        flex: 1,
    },
    priceTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    freeTag: {
        backgroundColor: '#e2e8f0',
    },
    paidTag: {
        backgroundColor: '#fb7185',
    },
    priceText: {
        fontSize: 11,
        fontWeight: '700',
    },
    freeText: {
        color: '#475569',
    },
    paidText: {
        color: '#fff',
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
