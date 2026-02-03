import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Switch,
    Dimensions,
    Platform
} from 'react-native';
import {
    ChevronLeft,
    Languages,
    Newspaper
} from 'lucide-react-native';
import { API_BASE } from '../api';

const { width } = Dimensions.get('window');

const SUB_TOPICS = [
    {
        id: 1,
        number: '01',
        title: 'Miscellaneous',
        description: 'Interesting state facts, local cuisine, government schemes, and unique aspects.',
        score: '0.00%',
        questions: '0/2 Questions',
        progress: 0
    },
    {
        id: 2,
        number: '02',
        title: 'Spelling & Sentence Correction',
        description: 'Correct spelling and grammatically accurate sentences make language clear,...',
        score: '0.00%',
        questions: '20/400 Questions',
        progress: 0.05
    },
    {
        id: 3,
        number: '03',
        title: 'Noun, Pronoun, Verb, Adjective & Noun Qualified',
        description: 'The key parts of speech that form the foundation of language include nouns, pr...',
        score: '0.00%',
        questions: '3/583 Questions',
        progress: 0.01
    },
    {
        id: 4,
        number: '04',
        title: 'Antonyms & Synonyms & Similar Meanings',
        description: 'Antonyms express opposite meanings, while synonyms represent words with the ...',
        score: '100.00%',
        questions: '3/956 Questions',
        progress: 0.01
    },
    {
        id: 5,
        number: '05',
        title: 'One Word Substitution & Homonyms',
        description: '"One word for a sentence" is used to shorten long sentences, while "polysemou...',
        score: '0.00%',
        questions: '0/593 Questions',
        progress: 0
    }
];

export default function SubTopics({ onBack, onNavigate, subjectId, topicName = "General Hindi" }) {
    const [subTopicsEnabled, setSubTopicsEnabled] = useState(true);
    const [lang, setLang] = useState('en');
    const [subTopics, setSubTopics] = useState([]);

    React.useEffect(() => {
        const fetchSubTopics = async () => {
            if (!subjectId) return;
            try {
                const res = await fetch(`${API_BASE}/qbank/subtopics/?subject=${subjectId}`);
                const data = await res.json();
                setSubTopics(data.results || []);
            } catch (error) {
                console.error("Error fetching subtopics:", error);
            }
        };
        fetchSubTopics();
    }, [subjectId]);

    const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

    const displaySubTopics = subTopics.length > 0 ? subTopics : SUB_TOPICS;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{topicName}</Text>
                <TouchableOpacity style={styles.iconButton} onPress={toggleLang}>
                    <Languages color="#fff" size={24} />
                    {lang === 'hi' && <View style={styles.langIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Breadcrumb & Toggle */}
                <View style={styles.controlsRow}>
                    <Text style={styles.breadcrumb}>
                        {lang === 'hi' ? 'एचपी' : 'HP'} / {lang === 'hi' ? 'क्यूबैंक' : 'QBank'} / <Text style={styles.activeBreadcrumb}>{lang === 'hi' ? 'विषय' : 'Topics'}</Text>
                    </Text>
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>{lang === 'hi' ? 'उप-विषय' : 'Sub-Topics'}</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#818cf8" }}
                            thumbColor={subTopicsEnabled ? "#4f46e5" : "#f4f3f4"}
                            onValueChange={() => setSubTopicsEnabled(!subTopicsEnabled)}
                            value={subTopicsEnabled}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                </View>

                {/* List Container */}
                <View style={styles.listContainer}>
                    {displaySubTopics.map((topic, index) => {
                        const number = topic.number || (index + 1).toString().padStart(2, '0');
                        return (
                            <TouchableOpacity
                                key={topic.id}
                                style={styles.topicCard}
                                activeOpacity={0.9}
                                onPress={() => onNavigate && onNavigate('topic_chapters', { subTopicId: topic.id, subTopicName: topic.title })}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.topicTitle}>
                                            <Text style={styles.topicNumber}>{number} </Text>
                                            {topic.title}
                                        </Text>
                                        <Text style={styles.topicDesc}>{topic.description}</Text>
                                    </View>
                                    <View style={styles.iconCircle}>
                                        <Shield color="#fff" size={24} fill="#fff" />
                                    </View>
                                </View>

                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressBar, { width: `${(topic.progress || 0) * 100}%` }]} />
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.scoreText}>Guess Score : {topic.score || '0.00%'}</Text>
                                    <Text style={styles.questionsText}>{topic.questions || '0 Questions'}</Text>
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
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a', // Dark text for this header
    },
    iconButton: {
        width: 40,
        height: 40,
        backgroundColor: '#6366f1', // Left/Right buttons match
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
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 10,
    },
    breadcrumb: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
    },
    activeBreadcrumb: {
        color: '#6366f1',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    listContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    topicCard: {
        backgroundColor: '#f5f3ff', // Very light purple background
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#c7d2fe', // Lighter purple border
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
    topicTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 6,
    },
    topicNumber: {
        color: '#6366f1',
        fontWeight: '800',
    },
    topicDesc: {
        fontSize: 12,
        color: '#334155', // Slightly darker than gray for better readability on light purple
        lineHeight: 18,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
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
