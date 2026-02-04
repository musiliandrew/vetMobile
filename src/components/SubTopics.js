import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Switch,
    Dimensions,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    Languages,
    Newspaper
} from 'lucide-react-native';
import { API_BASE } from '../api';
import { useLanguage, T } from '../context/LanguageContext';

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
    const { useTranslation, language, setLanguage } = useLanguage();
    const [subTopics, setSubTopics] = useState([]);

    useEffect(() => {
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

    const toggleLang = () => setLanguage(language === 'en' ? 'hi' : 'en');

    const displaySubTopics = subTopics.length > 0 ? subTopics : SUB_TOPICS;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <T style={styles.headerTitle}>{topicName}</T>
                <TouchableOpacity style={styles.iconButton} onPress={toggleLang}>
                    <Languages color="#fff" size={24} />
                    {language === 'hi' && <View style={styles.langIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Breadcrumb & Toggle */}
                <View style={styles.controlsRow}>
                    <Text style={styles.breadcrumb}>
                        <T>HP</T> / <T>QBank</T> / <T style={styles.activeBreadcrumb}>Topics</T>
                    </Text>
                    <View style={styles.toggleContainer}>
                        <T style={styles.toggleLabel}>Sub-Topics</T>
                        <Switch
                            trackColor={{ false: "#767577", true: "#86efac" }}
                            thumbColor={subTopicsEnabled ? "#16a34a" : "#f4f3f4"}
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
                                            <T>{topic.title}</T>
                                        </Text>
                                        <Text style={styles.topicDesc}><T>{topic.description}</T></Text>
                                    </View>
                                    <View style={styles.iconCircle}>
                                        <Shield color="#fff" size={24} fill="#fff" />
                                    </View>
                                </View>

                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressBar, { width: `${(topic.progress || 0) * 100}%` }]} />
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.scoreText}><T>Guess Score</T> : {topic.score || '0.00%'}</Text>
                                    <Text style={styles.questionsText}>{topic.questions || <><T>{'0'}</T> <T>Questions</T></>}</Text>
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
        backgroundColor: '#16a34a', // Left/Right buttons match
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
    topicCard: {
        backgroundColor: '#f0fdf4', // Very light green background
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0', // Lighter green border
    },
    topicNumber: {
        color: '#16a34a',
        fontWeight: '800',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
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
