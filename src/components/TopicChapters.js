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

import { useLanguage } from '../context/LanguageContext';

export default function TopicChapters({ onBack, onNavigate, subTopicId, subTopicName = "General Hindi", title }) {
    const { useTranslation, language, setLanguage } = useLanguage();
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

    const toggleLang = () => setLanguage(language === 'en' ? 'hi' : 'en');

    const displayChapters = chapters.length > 0 ? chapters : CHAPTERS;
    const displayTitle = title || subTopicName;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={2}>{useTranslation(displayTitle)}</Text>
                <TouchableOpacity style={styles.iconButton} onPress={toggleLang}>
                    <Languages color="#fff" size={24} />
                    {language === 'hi' && <View style={styles.langIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Breadcrumb */}
                <View style={styles.breadcrumbContainer}>
                    <Text style={styles.breadcrumb}>
                        {useTranslation('HP')} / {useTranslation('QBank')} / {useTranslation('Sub Topics')} / <Text style={styles.activeBreadcrumb}>{useTranslation('Chapters')}</Text>
                    </Text>
                </View>

                {/* Overview Card */}
                <View style={styles.overviewCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.textContainer}>
                            <Text style={styles.overviewTitle}>{useTranslation(displayTitle)}</Text>
                            <Text style={styles.overviewDesc}>{useTranslation('The key parts of speech that form the foundation of language include nouns, pr...')}</Text>
                        </View>
                        <View style={styles.iconCircle}>
                            <Shield color="#fff" size={28} fill="#fff" />
                        </View>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.scoreText}>{useTranslation('Guess Score')} : 0.00%</Text>
                        <Text style={styles.questionsText}>0/1 {useTranslation('Questions')}</Text>
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
                                            {useTranslation(chapter.title)}
                                        </Text>
                                        <Text style={styles.chapterDesc}>{useTranslation(chapter.description)}</Text>
                                    </View>
                                    <View style={styles.iconCircleSmall}>
                                        <Shield color="#fff" size={20} fill="#fff" />
                                    </View>
                                </View>

                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressBar, { width: `${(chapter.progress || 0) * 100}%` }]} />
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.scoreText}>{useTranslation('Guess Score')} : {chapter.score || '0.00%'}</Text>
                                    <Text style={styles.questionsText}>{chapter.questions || `0 ${useTranslation('Questions')}`}</Text>
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
        backgroundColor: '#16a34a',
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
    activeBreadcrumb: {
        color: '#16a34a',
    },
    overviewCard: {
        backgroundColor: '#f0fdf4', // Light green tint
        margin: 20,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    chapterCard: {
        backgroundColor: '#f0fdf4', // Light green
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    chapterNumber: {
        color: '#16a34a',
        fontWeight: '800',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    iconCircleSmall: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#bbf7d0',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#16a34a',
        borderRadius: 2,
    },
    scoreText: {
        fontSize: 12,
        color: '#16a34a',
        fontWeight: '600',
    },
    questionsText: {
        fontSize: 12,
        color: '#16a34a',
        fontWeight: '600',
    },
});
