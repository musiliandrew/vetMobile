import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    TextInput,
    Platform
} from 'react-native';
import {
    ChevronLeft,
    Languages,
    Search,
    Filter,
    Bookmark,
    ThumbsUp,
    Eye,
    Flag,
    FileEdit,
    Square,
    CheckSquare
} from 'lucide-react-native';
import { API_BASE } from '../api';
import ReportModal from './ReportModal';
import FilterModal from './FilterModal';

const { width } = Dimensions.get('window');

const QUESTIONS = [
    {
        id: 1,
        qNo: 'Q.01',
        text: 'मेरा भाई इतना ............ है कि सामान कहीं भी रखकर भूल जाता है। इस रिक्त स्थान के लिए सही भाववाचक संज्ञा वाला विकल्प चुनें:',
        likes: 0,
        views: 0,
        reports: 0,
        notes: 0,
        isBookmarked: true
    },
    {
        id: 2,
        qNo: 'Q.02',
        text: 'संज्ञा के भेदों में इनमें से कौन-सा शामिल नहीं है?',
        likes: 0,
        views: 0,
        reports: 0,
        notes: 0,
        isBookmarked: true
    },
    {
        id: 3,
        qNo: 'Q.03',
        text: 'लहर शब्द किस प्रकार की संज्ञा का उदाहरण है?',
        likes: 0,
        views: 0,
        reports: 0,
        notes: 0,
        isBookmarked: true
    },
    {
        id: 4,
        qNo: 'Q.04',
        text: 'पशुता शब्द किस प्रकार की संज्ञा का उदाहरण है?',
        likes: 0,
        views: 0,
        reports: 0,
        notes: 0,
        isBookmarked: true
    },
    {
        id: 5,
        qNo: 'Q.05',
        text: '"इतिहास में कई चन्द्रगुप्त मिलते हैं।" - इस वाक्य में रेखांकित शब्द (चन्द्रगुप्त) की संज्ञा का भेद चुनिये।',
        likes: 0,
        views: 0,
        reports: 0,
        notes: 0,
        isBookmarked: true
    }
];

import { useLanguage } from '../context/LanguageContext';

export default function QuestionList({ onBack, onNavigate, chapterId, chapterName, token, title }) {
    const { useTranslation, language, setLanguage } = useLanguage();
    const [questions, setQuestions] = useState([]);
    const [bookmarkedFilter, setBookmarkedFilter] = useState(false);
    const [pyqFilter, setPyqFilter] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);

    React.useEffect(() => {
        const fetchQuestions = async () => {
            if (!chapterId) return;
            try {
                let url = `${API_BASE}/qbank/questions/?chapter=${chapterId}`;
                if (bookmarkedFilter) url += '&bookmarked=true';
                if (pyqFilter) url += '&pyq=true';

                const res = await fetch(url, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                const data = await res.json();
                setQuestions(data.results || []);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };
        fetchQuestions();
    }, [chapterId, bookmarkedFilter, pyqFilter, token]);

    const toggleLang = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    const displayQuestions = questions.length > 0 ? questions : QUESTIONS;
    const displayTitle = title || chapterName || useTranslation("Questions");

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{displayTitle}</Text>
                <TouchableOpacity style={styles.iconButton} onPress={toggleLang}>
                    <Languages color="#fff" size={24} />
                    {language === 'hi' && <View style={styles.langIndicator} />}
                </TouchableOpacity>
            </View>

            {/* Breadcrumb - Fixed at top */}
            <View style={styles.breadcrumbContainer}>
                <Text style={styles.breadcrumb}>
                    {useTranslation('Himachal Pradesh')} / {useTranslation('Question Bank')} / {displayTitle}
                </Text>
            </View>

            <View style={styles.searchFilterContainer}>
                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <TextInput
                        placeholder={useTranslation("Search")}
                        style={styles.searchInput}
                        placeholderTextColor="#94a3b8"
                    />
                    <Search color="#94a3b8" size={20} />
                </View>

                {/* Filters Row */}
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setBookmarkedFilter(!bookmarkedFilter)}
                    >
                        {bookmarkedFilter ? (
                            <CheckSquare color="#16a34a" size={20} />
                        ) : (
                            <Square color="#94a3b8" size={20} />
                        )}
                        <Text style={styles.filterLabel}>{useTranslation('Bookmarked')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setPyqFilter(!pyqFilter)}
                    >
                        {pyqFilter ? (
                            <CheckSquare color="#16a34a" size={20} />
                        ) : (
                            <Square color="#94a3b8" size={20} />
                        )}
                        <Text style={styles.filterLabel}>PYQ's</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
                        <Filter color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Results Header */}
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsText}>
                        {displayQuestions.length} {useTranslation('Results Found')}
                    </Text>
                    <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>
                            {useTranslation('Guess Score')}: 100%
                        </Text>
                    </View>
                </View>

                {/* Questions List */}
                <View style={styles.listContainer}>
                    {displayQuestions.map((q, index) => (
                        <TouchableOpacity
                            key={q.id}
                            style={styles.questionCard}
                            activeOpacity={0.9}
                            onPress={() => onNavigate && onNavigate('quiz_page', {
                                questionId: q.id,
                                questions: displayQuestions,
                                currentIndex: index,
                                token
                            })}
                        >
                            <View style={styles.cardTopRow}>
                                <Text style={styles.qNo}>Q.{(index + 1).toString().padStart(2, '0')}</Text>
                                <TouchableOpacity>
                                    <Bookmark
                                        color="#000"
                                        size={20}
                                        fill={q.interaction?.is_bookmarked ? "#000" : "transparent"}
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.questionText}>{q.text}</Text>

                            <View style={styles.divider} />

                            <View style={styles.actionsRow}>
                                <TouchableOpacity style={styles.actionItem}>
                                    <ThumbsUp color={q.interaction?.is_liked ? "#16a34a" : "#94a3b8"} size={16} />
                                    <Text style={styles.actionText}>
                                        {useTranslation('Like')} {q.likes || 0}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem}>
                                    <Eye color="#16a34a" size={16} />
                                    <Text style={styles.actionText}>
                                        {useTranslation('View')} {q.views || 0}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem} onPress={() => setReportVisible(true)}>
                                    <Flag color={q.interaction?.is_reported ? "#ef4444" : "#16a34a"} size={16} />
                                    <Text style={styles.actionText}>
                                        {useTranslation('Report')} {q.reports || 0}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem}>
                                    <FileEdit color="#16a34a" size={16} />
                                    <Text style={styles.actionText}>
                                        {useTranslation('Notes')} {q.notes || 0}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <ReportModal
                visible={reportVisible}
                onClose={() => setReportVisible(false)}
            />
            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
            />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: Platform.OS === 'android' ? 30 : 0,
        backgroundColor: '#fff',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        backgroundColor: '#16a34a', // Green
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    langIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#facc15',
        borderWidth: 1.5,
        borderColor: '#16a34a',
    },
    filterButton: {
        width: 40,
        height: 36,
        backgroundColor: '#16a34a',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreBadge: {
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    scoreText: {
        color: '#16a34a',
        fontSize: 12,
        fontWeight: '600',
    },
    listContainer: {
        gap: 16,
    },
    questionCard: {
        backgroundColor: '#fff', // White card
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    qNo: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
    questionText: {
        fontSize: 15,
        color: '#0f172a',
        lineHeight: 22,
        fontWeight: '500',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginBottom: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
    },
});
