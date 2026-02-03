import React, { useState, useEffect } from 'react';
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
    Clock,
    Type,
    Bookmark,
    AlertTriangle,
    Info,
    ChevronUp,
    ChevronDown,
    Menu,
    ArrowRight,
    ArrowLeft,
    ThumbsUp,
    Eye,
    Flag,
    FileEdit,
    Square,
    CheckSquare
} from 'lucide-react-native';
import { API_BASE } from '../api';
import QuestionPalette from './QuestionPalette';
import ReportModal from './ReportModal';

const { width } = Dimensions.get('window');

import { useLanguage } from '../context/LanguageContext';

export default function QuizPage({ onBack, questions = [], currentIndex = 0, token }) {
    const [index, setIndex] = useState(currentIndex);
    const [timer, setTimer] = useState(5);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isEstimated, setIsEstimated] = useState(false);
    const [pyqExpanded, setPyqExpanded] = useState(true);
    const [paletteVisible, setPaletteVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const { useTranslation, language, setLanguage } = useLanguage();

    const currentQuestion = questions[index] || {};

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = async (optionId) => {
        setSelectedOption(optionId);
        try {
            await fetch(`${API_BASE}/qbank/questions/${currentQuestion.id}/submit_answer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ option_id: optionId })
            });
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

    const toggleLang = () => setLanguage(language === 'en' ? 'hi' : 'en');

    const options = currentQuestion.options || [];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>

                <View style={styles.timerContainer}>
                    <Clock color="#fff" size={20} />
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                </View>

                <TouchableOpacity style={styles.iconButton} onPress={toggleLang}>
                    <Languages color="#fff" size={24} />
                    {language === 'hi' && <View style={styles.langIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Question Meta Row */}
                <View style={styles.metaRow}>
                    <Text style={styles.counterText}>{index + 1} {useTranslation('of')} {questions.length}</Text>
                    <View style={styles.metaActions}>
                        <TouchableOpacity style={styles.metaBtn}>
                            <Type color="#fff" size={16} />
                        </TouchableOpacity>
                        {currentQuestion.is_pyq && (
                            <View style={styles.pyqBadge}>
                                <Text style={styles.pyqText}>PYQ</Text>
                            </View>
                        )}
                        <TouchableOpacity>
                            <Bookmark
                                color="#000"
                                size={20}
                                fill={currentQuestion.interaction?.is_bookmarked ? "#000" : "transparent"}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <AlertTriangle color="#ef4444" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Question Text */}
                <Text style={styles.questionText}>
                    {currentQuestion.text}
                </Text>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {options.map((opt) => {
                        const isSelected = selectedOption === opt.id;
                        return (
                            <TouchableOpacity
                                key={opt.id}
                                style={[styles.optionCard, isSelected && styles.optionSelected]}
                                onPress={() => handleOptionSelect(opt.id)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                                    <Text style={[styles.optionLabelText, isSelected && styles.optionLabelTextSelected]}>
                                        {opt.identifier}
                                    </Text>
                                </View>
                                <Text style={styles.optionText}>{opt.text}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Estimated Answer Checkbox */}
                <TouchableOpacity
                    style={styles.estimatedRow}
                    onPress={() => setIsEstimated(!isEstimated)}
                >
                    {isEstimated ? (
                        <CheckSquare color="#16a34a" size={20} />
                    ) : (
                        <Square color="#94a3b8" size={20} />
                    )}
                    <Text style={styles.estimatedText}>{useTranslation('Estimated Answer')}</Text>
                    <Info color="#16a34a" size={16} fill="#dcfce7" />
                </TouchableOpacity>

                {/* PYQ Info Accordion */}
                {currentQuestion.is_pyq && (
                    <View style={styles.pyqContainer}>
                        <TouchableOpacity
                            style={styles.pyqHeader}
                            onPress={() => setPyqExpanded(!pyqExpanded)}
                        >
                            <Text style={styles.pyqTitle}>{useTranslation('PYQ Info')}</Text>
                            {pyqExpanded ? <ChevronUp size={20} color="#0f172a" /> : <ChevronDown size={20} color="#0f172a" />}
                        </TouchableOpacity>

                        {pyqExpanded && (
                            <View style={styles.pyqBody}>
                                <Text style={styles.pyqDetail}>
                                    1. {currentQuestion.pyq_info}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

            </ScrollView>

            <QuestionPalette
                visible={paletteVisible}
                onClose={() => setPaletteVisible(false)}
            />

            <ReportModal
                visible={reportVisible}
                onClose={() => setReportVisible(false)}
            />

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <View style={styles.navButtonsRow}>
                    <TouchableOpacity
                        style={[styles.prevButton, index === 0 && { opacity: 0.5 }]}
                        onPress={() => {
                            if (index > 0) {
                                setIndex(index - 1);
                                setSelectedOption(null);
                            }
                        }}
                        disabled={index === 0}
                    >
                        <ArrowLeft color="#fff" size={20} />
                        <Text style={styles.prevText}>{useTranslation('Prev')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuCircle} onPress={() => setPaletteVisible(true)}>
                        <Menu color="#fff" size={28} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.nextButton, index === questions.length - 1 && { opacity: 0.5 }]}
                        onPress={() => {
                            if (index < questions.length - 1) {
                                setIndex(index + 1);
                                setSelectedOption(null);
                            }
                        }}
                        disabled={index === questions.length - 1}
                    >
                        <Text style={styles.nextText}>{useTranslation('Next')}</Text>
                        <ArrowRight color="#fff" size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionItem}>
                        <ThumbsUp color="#16a34a" size={18} />
                        <Text style={styles.actionText}>{useTranslation('Like')} 0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <Eye color="#16a34a" size={18} />
                        <Text style={styles.actionText}>{useTranslation('View')} 0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem} onPress={() => setReportVisible(true)}>
                        <Flag color="#16a34a" size={18} />
                        <Text style={styles.actionText}>{useTranslation('Report')} 0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <FileEdit color="#16a34a" size={18} />
                        <Text style={styles.actionText}>{useTranslation('Notes')} 0</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        backgroundColor: '#16a34a', // Green header
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
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
    metaBtn: {
        backgroundColor: '#16a34a',
        width: 28,
        height: 28,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pyqBadge: {
        backgroundColor: '#16a34a',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
    },
    optionSelected: {
        borderColor: '#16a34a',
        backgroundColor: '#f0fdf4',
    },
    optionLabelSelected: {
        backgroundColor: '#16a34a',
    },
    menuCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        top: -5,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000', // Black
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
        width: '35%',
        justifyContent: 'center',
    },
    nextText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '600',
    },
});
