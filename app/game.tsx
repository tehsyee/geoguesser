import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGame } from '../src/context/GameContext';
import citiesData from '../src/data/cities.json';

export default function GameScreen() {
    const router = useRouter();
    const { currentCity, score, totalAttempts, difficulty, submitAnswer, remainingCities, useHint, hintRevealed, toggleFavorite, isFavorite, gameStartTime } = useGame();
    const [elapsedTime, setElapsedTime] = useState(0);
    const [answer, setAnswer] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [hintText, setHintText] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentCity) {
                setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [gameStartTime, currentCity]);

    useEffect(() => {
        if (!currentCity) {
            router.replace('/');
            return;
        }

        if (difficulty === 'Easy') {
            // Generate multiple choice options
            const correctCountry = currentCity.country;
            const allCountries = Array.from(new Set(citiesData.cities.map(c => c.country)));
            const filteredCountries = allCountries.filter(c => c !== correctCountry);
            const shuffledCountries = filteredCountries.sort(() => Math.random() - 0.5).slice(0, 3);
            const finalOptions = [...shuffledCountries, correctCountry].sort(() => Math.random() - 0.5);
            setOptions(finalOptions);
        }
    }, [currentCity]);

    const handleSubmit = (selectedAnswer?: string) => {
        const finalAnswer = selectedAnswer || answer;
        if (!finalAnswer.trim()) return;

        const isCorrect = submitAnswer(finalAnswer);
        router.push({
            pathname: '/feedback',
            params: { isCorrect: isCorrect ? 'true' : 'false' }
        });
        setAnswer('');
    };

    const handleHint = () => {
        const hint = useHint();
        setHintText(hint);
    };

    if (!currentCity) return null;

    const totalPossible = remainingCities.length + 1 + totalAttempts;
    const progress = (totalAttempts / totalPossible) * 100;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={28} color="#2D3436" />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <View style={styles.timerContainer}>
                                <Ionicons name="time-outline" size={16} color="#636E72" />
                                <Text style={styles.timerValue}>{elapsedTime}s</Text>
                            </View>
                            <TouchableOpacity style={styles.hintButton} onPress={handleHint} disabled={hintRevealed}>
                                <Ionicons name="bulb" size={20} color={hintRevealed ? '#B2BEC3' : '#FF9F43'} />
                            </TouchableOpacity>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.scoreLabel}>Score</Text>
                                <Text style={styles.scoreValue}>{score}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${progress}%` }]} />
                    </View>

                    <View style={styles.card}>
                        <Image
                            source={{ uri: currentCity.imageUrl }}
                            style={styles.image}
                            contentFit="cover"
                            transition={1000}
                        />
                        <View style={styles.cityInfo}>
                            <View style={styles.cityHeaderRow}>
                                <Text style={styles.cityName}>{currentCity.name}</Text>
                                <TouchableOpacity onPress={() => toggleFavorite(currentCity.name)}>
                                    <Ionicons
                                        name={isFavorite(currentCity.name) ? "heart" : "heart-outline"}
                                        size={28}
                                        color={isFavorite(currentCity.name) ? "#EE5253" : "#B2BEC3"}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.question}>Which country is this city in?</Text>
                            {hintRevealed && (
                                <View style={styles.hintDisplay}>
                                    <Text style={styles.hintDisplayText}>{hintText}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {difficulty === 'Easy' ? (
                        <View style={styles.optionsGrid}>
                            {options.map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={styles.optionButton}
                                    onPress={() => handleSubmit(opt)}
                                >
                                    <Text style={styles.optionText}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter country name..."
                                value={answer}
                                onChangeText={setAnswer}
                                autoCorrect={false}
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
                                <Text style={styles.submitButtonText}>Submit Answer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    hintButton: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DFE6E9',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F2F6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 5,
    },
    timerValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#636E72',
    },
    scoreContainer: {
        alignItems: 'flex-end',
    },
    scoreLabel: {
        fontSize: 12,
        color: '#636E72',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#10AC84',
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#DFE6E9',
        borderRadius: 3,
        marginBottom: 25,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#10AC84',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 30,
    },
    image: {
        width: '100%',
        height: 250,
    },
    cityInfo: {
        padding: 20,
        alignItems: 'center',
    },
    cityName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2D3436',
    },
    cityHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    question: {
        fontSize: 16,
        color: '#636E72',
        marginTop: 5,
    },
    hintDisplay: {
        marginTop: 15,
        backgroundColor: '#FFF9DB',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD43B',
    },
    hintDisplayText: {
        color: '#F08C00',
        fontWeight: '600',
        fontSize: 14,
    },
    optionsGrid: {
        gap: 12,
    },
    optionButton: {
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DFE6E9',
    },
    optionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3436',
    },
    inputContainer: {
        gap: 15,
    },
    input: {
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 15,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#DFE6E9',
    },
    submitButton: {
        backgroundColor: '#10AC84',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
});
