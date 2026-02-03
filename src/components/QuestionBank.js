import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Switch,
    Image,
    Platform
} from 'react-native';
import {
    ChevronLeft,
    Languages,
    Newspaper,
    Map,
    Globe2,
    BookA,
    Check
} from 'lucide-react-native';
import { API_BASE } from '../api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TOPICS = [
    {
        id: 1,
        number: '01',
        title: 'Current Affairs',
        description: 'Current Affairs is the study of recent national and international events—politic...',
        icon: Newspaper,
        score: '75.00%',
        questions: '31/2084 Questions',
        progress: 0.02
    },
    {
        id: 2,
        number: '02',
        title: 'State General Knowledge',
        description: 'General knowledge (GK) is an essential component of competitive exams, coveri...',
        icon: Map,
        score: '77.78%',
        questions: '230/5267 Questions',
        progress: 0.1
    },
    {
        id: 3,
        number: '03',
        title: 'National General Knowledge',
        description: 'National General Knowledge encompasses a broad range of topics ab...',
        icon: Globe2,
        score: '100.00%',
        questions: '14/7370 Questions',
        progress: 0.01
    },
    {
        id: 4,
        number: '04',
        title: 'General Hindi',
        description: 'General Hindi covers grammar, vocabulary, and comprehension skills requ...',
        icon: BookA,
        score: '0.00%',
        questions: '0/1500 Questions',
        progress: 0
    }
];

import { useLanguage } from '../context/LanguageContext';

export default function QuestionBank({ onBack, onNavigate }) {
    const [topicsEnabled, setTopicsEnabled] = useState(true);
    const { useTranslation, language, setLanguage } = useLanguage();
    const [topics, setTopics] = useState([]);

    React.useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(`${API_BASE}/qbank/subjects/`);
                const data = await res.json();
                setTopics(data.results || []);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    const toggleLang = () => setLanguage(language === 'en' ? 'hi' : 'en');

    const displayTopics = topics.length > 0 ? topics : TOPICS;

    return (
        <View style={styles.container}>
            {/* Curved Header Background */}
            <View style={styles.headerBackgroundContainer}>
                <View style={styles.headerBackground} />
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Header Content */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                        <ChevronLeft color="#fff" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={toggleLang}>
                        <Languages color="#fff" size={24} />
                        {language === 'hi' && <View style={styles.langIndicator} />}
                    </TouchableOpacity>
                </View>

                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    {/* Placeholder for the complex education illustration */}
                    <View style={styles.illustrationPlaceHolder}>
                        <View style={styles.monitor}>
                            <View style={styles.screen} />
                            <View style={styles.base} />
                        </View>
                        <View style={styles.floatingIconLeft}>
                            <Globe2 color="#6366f1" size={20} />
                        </View>
                        <View style={styles.floatingIconRight}>
                            <BookA color="#6366f1" size={20} />
                        </View>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Breadcrumb & Toggle */}
                    <View style={styles.controlsRow}>
                        <Text style={styles.breadcrumb}>
                            {useTranslation('Himachal Pradesh')} / <Text style={styles.activeBreadcrumb}>{useTranslation('Question Bank')}</Text>
                        </Text>
                        <View style={styles.toggleContainer}>
                            <Text style={styles.toggleLabel}>{useTranslation('Topics')}</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#86efac" }}
                                thumbColor={topicsEnabled ? "#16a34a" : "#f4f3f4"}
                                onValueChange={() => setTopicsEnabled(!topicsEnabled)}
                                value={topicsEnabled}
                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            />
                        </View>
                    </View>

                    {/* Topics List */}
                    <View style={styles.listContainer}>
                        {displayTopics.map((topic, index) => {
                            const Icon = topic.icon || Globe2;
                            const title = language === 'hi' ? (topic.title_hi || topic.title) : (topic.title_en || topic.title);
                            const displayTitle = useTranslation(title);
                            const number = topic.number || (index + 1).toString().padStart(2, '0');

                            return (
                                <TouchableOpacity
                                    key={topic.id}
                                    style={styles.topicCard}
                                    activeOpacity={0.9}
                                    onPress={() => onNavigate && onNavigate('sub_topics', { subjectId: topic.id, topicName: title })}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.topicTitle}>
                                                <Text style={styles.topicNumber}>{number} </Text>
                                                {displayTitle}
                                            </Text>
                                            <Text style={styles.topicDesc}>{useTranslation(topic.description)}</Text>
                                        </View>
                                        <View style={styles.iconCircle}>
                                            <Icon color="#fff" size={24} />
                                        </View>
                                    </View>

                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressBar, { width: `${(topic.progress || 0) * 100}% ` }]} />
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.scoreText}>{useTranslation('Guess Score')} : {topic.score || '0.00%'}</Text>
                                        <Text style={styles.questionsText}>{topic.questions || `0 ${useTranslation('Questions')}`}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerBackground: {
        width: width,
        height: 300,
        backgroundColor: '#dcfce7', // Light green bg
        borderBottomRightRadius: width / 2,
        borderBottomLeftRadius: width / 2,
        transform: [{ scaleX: 1.5 }],
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
    monitor: {
        width: 80,
        height: 60,
        backgroundColor: '#15803d',
        borderRadius: 8,
        borderWidth: 4,
        borderColor: '#14532d',
        justifyContent: 'center',
        alignItems: 'center',
    },
    base: {
        width: 40,
        height: 10,
        backgroundColor: '#14532d',
        marginTop: 5,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    activeBreadcrumb: {
        color: '#16a34a',
    },
    topicCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    topicNumber: {
        color: '#16a34a',
        fontWeight: '800',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
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
