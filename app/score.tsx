import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../src/context/GameContext';
import achievementsData from '../src/data/achievements.json';

export default function ScoreScreen() {
    const router = useRouter();
    const { score, totalAttempts, resetGame, highScore, unlockedAchievements, totalTime } = useGame();

    const percentage = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

    const getMessage = () => {
        if (percentage >= 90) return { title: 'World Traveler!', sub: 'You know your way around the globe!' };
        if (percentage >= 70) return { title: 'Great Job!', sub: 'You have a solid grasp of geography.' };
        if (percentage >= 50) return { title: 'Not Bad!', sub: 'Keep exploring to learn more.' };
        return { title: 'Keep Practicing!', sub: 'The world is a big place to discover.' };
    };

    const message = getMessage();

    const handlePlayAgain = () => {
        resetGame();
        router.replace('/');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Game Summary</Text>
                    </View>

                    <View style={styles.scoreCard}>
                        <View style={styles.trophyContainer}>
                            <Ionicons name="trophy" size={80} color="#FF9F43" />
                        </View>

                        <Text style={styles.scoreTitle}>{message.title}</Text>
                        <Text style={styles.scoreSub}>{message.sub}</Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Score</Text>
                                <Text style={styles.statValue}>{score}/{totalAttempts}</Text>
                            </View>
                            <View style={[styles.statBox, styles.statDivider]}>
                                <Text style={styles.statLabel}>Accuracy</Text>
                                <Text style={styles.statValue}>{percentage}%</Text>
                            </View>
                            <View style={[styles.statBox, styles.statDivider]}>
                                <Text style={styles.statLabel}>Best</Text>
                                <Text style={styles.statValue}>{highScore}</Text>
                            </View>
                            <View style={[styles.statBox, styles.statDivider]}>
                                <Text style={styles.statLabel}>Time</Text>
                                <Text style={styles.statValue}>{totalTime}s</Text>
                            </View>
                        </View>
                    </View>

                    {unlockedAchievements.length > 0 && (
                        <View style={styles.achievementsSection}>
                            <Text style={styles.sectionTitle}>Achievements Unlocked</Text>
                            <View style={styles.achievementsGrid}>
                                {achievementsData.achievements
                                    .filter(a => unlockedAchievements.includes(a.id))
                                    .map(a => (
                                        <View key={a.id} style={styles.achievementBadge}>
                                            <View style={styles.badgeIcon}>
                                                <Ionicons name={a.icon as any} size={24} color="#FF9F43" />
                                            </View>
                                            <Text style={styles.badgeTitle}>{a.title}</Text>
                                        </View>
                                    ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.primaryButton} onPress={handlePlayAgain}>
                            <Text style={styles.primaryButtonText}>Play Again</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} onPress={handlePlayAgain}>
                            <Text style={styles.secondaryButtonText}>Back to Main Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#636E72',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    scoreCard: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 10,
        marginBottom: 35,
    },
    trophyContainer: {
        marginBottom: 15,
    },
    scoreTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2D3436',
        textAlign: 'center',
    },
    scoreSub: {
        fontSize: 15,
        color: '#636E72',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 25,
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#DFE6E9',
        paddingTop: 25,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        borderLeftWidth: 1,
        borderLeftColor: '#DFE6E9',
    },
    statLabel: {
        fontSize: 10,
        color: '#B2BEC3',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2D3436',
    },
    achievementsSection: {
        width: '100%',
        marginBottom: 35,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3436',
        marginBottom: 20,
        textAlign: 'center',
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    achievementBadge: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 12,
        alignItems: 'center',
        width: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    badgeIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF9DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    badgeTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2D3436',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    primaryButton: {
        backgroundColor: '#10AC84',
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: '#10AC84',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryButton: {
        padding: 15,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#636E72',
        fontSize: 16,
        fontWeight: '600',
    },
});
