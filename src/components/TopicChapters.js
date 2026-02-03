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
    Shield
} from 'lucide-react-native';
import { API_BASE } from '../api';

const { width } = Dimensions.get('window');

const CHAPTERS = [
    {
        id: 1,
        number: '01',
        title: 'Noun',
        description: 'A noun is a word that names a person, place, thing, or idea.',
        score: '0.00%',
        questions: '0/100 Questions',
        progress: 0
    },
    {
        id: 2,
        number: '02',
        title: 'Pronoun',
        description: 'A pronoun is a word used in place of a noun to avoid repetition.',
        score: '0.00%',
        questions: '0/104 Questions',
        progress: 0
    },
    {
        id: 3,
        number: '03',
        title: 'Verb',
        description: 'A verb is a word that expresses an action, event, or state of being.',
        score: '0.00%',
        questions: '1/96 Questions',
        progress: 0.015
    },
    {
        id: 4,
        number: '04',
        title: 'Adjective & Noun Qualified',
        description: 'An adjective is a word that describes or qualifies a noun or pronoun (the qualified ..',
        score: '0.00%',
        questions: '2/282 Questions',
        progress: 0.01
    }
];

export default function TopicChapters({ onBack, onNavigate, subTopicId, subTopicName = "General Hindi", title }) {
    const [lang, setLang] = useState('en');
    const [chapters, setChapters] = useState([]);

    React.useEffect(() => {
        const fetchChapters = async () => {
            if (!subTopicId) return;
            try {
                const res = await fetch(`${API_BASE}/qbank/chapters/?subtopic=${subTopicId}`);
                const data = await res.json();
                setChapters(data.results || []);
            } catch (error) {
                console.error("Error fetching chapters:", error);
            }
        };
        fetchChapters();
    }, [subTopicId]);

    const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

    const displayChapters = chapters.length > 0 ? chapters : CHAPTERS;
    const displayTitle = title || subTopicName;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={2}>{displayTitle}</Text>
                <TouchableOpacity style={styles.iconButton} onPress={toggleLang}>
                    <Languages color="#fff" size={24} />
                    {lang === 'hi' && <View style={styles.langIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Breadcrumb */}
                <View style={styles.breadcrumbContainer}>
                    <Text style={styles.breadcrumb}>
                        {lang === 'hi' ? 'एचपी' : 'HP'} / {lang === 'hi' ? 'क्यूबैंक' : 'QBank'} / {lang === 'hi' ? 'उप-विषय' : 'Sub Topics'} / <Text style={styles.activeBreadcrumb}>{lang === 'hi' ? 'अध्याय' : 'Chapters'}</Text>
                    </Text>
                </View>

                {/* Overview Card */}
                <View style={styles.overviewCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.textContainer}>
                            <Text style={styles.overviewTitle}>{displayTitle}</Text>
                            <Text style={styles.overviewDesc}>The key parts of speech that form the foundation of language include nouns, pr...</Text>
                        </View>
                        <View style={styles.iconCircle}>
                            <Shield color="#fff" size={28} fill="#fff" />
                        </View>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.scoreText}>Guess Score : 0.00%</Text>
                        <Text style={styles.questionsText}>0/1 Questions</Text>
                    </View>
                </View>

                {/* Chapters List */}
                <View style={styles.listContainer}>
                    {displayChapters.map((chapter, index) => {
                        const number = chapter.number || (index + 1).toString().padStart(2, '0');
                        return (
                            <TouchableOpacity
                                key={chapter.id}
                                style={styles.chapterCard}
                                activeOpacity={0.9}
                                onPress={() => onNavigate && onNavigate('question_list', { chapterId: chapter.id, chapterName: chapter.title })}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.chapterTitle}>
                                            <Text style={styles.chapterNumber}>{number} </Text>
                                            {chapter.title}
                                        </Text>
                                        <Text style={styles.chapterDesc}>{chapter.description}</Text>
                                    </View>
                                    <View style={styles.iconCircleSmall}>
                                        <Shield color="#fff" size={20} fill="#fff" />
                                    </View>
                                </View>

                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressBar, { width: `${(chapter.progress || 0) * 100}%` }]} />
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.scoreText}>Guess Score : {chapter.score || '0.00%'}</Text>
                                    <Text style={styles.questionsText}>{chapter.questions || '0 Questions'}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: Platform.OS === 'android' ? 30 : 0,
        backgroundColor: '#fff',
    },
    headerTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center',
        marginHorizontal: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        backgroundColor: '#6366f1',
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
        backgroundColor: '#4ade80',
        borderWidth: 1.5,
        borderColor: '#6366f1',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    breadcrumbContainer: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    breadcrumb: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
    },
    activeBreadcrumb: {
        color: '#6366f1',
    },
    overviewCard: {
        backgroundColor: '#eff6ff', // Light Blue-ish tint distinct from list
        margin: 20,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    overviewTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 6,
    },
    overviewDesc: {
        fontSize: 12,
        color: '#334155',
        lineHeight: 18,
    },
    listContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    chapterCard: {
        backgroundColor: '#f5f3ff', // Light purple
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#c7d2fe',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    chapterTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 6,
    },
    chapterNumber: {
        color: '#6366f1',
        fontWeight: '800',
    },
    chapterDesc: {
        fontSize: 12,
        color: '#334155',
        lineHeight: 18,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    iconCircleSmall: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#c7d2fe',
    },
    progressTrack: {
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scoreText: {
        fontSize: 12,
        color: '#6366f1',
        fontWeight: '600',
    },
    questionsText: {
        fontSize: 12,
        color: '#6366f1',
        fontWeight: '600',
    },
});
