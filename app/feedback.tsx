import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../src/context/GameContext';

export default function FeedbackScreen() {
    const router = useRouter();
    const { isCorrect } = useLocalSearchParams();
    const { lastCity, nextCity, remainingCities } = useGame();

    const handleContinue = () => {
        if (remainingCities.length === 0) {
            router.replace('/score');
        } else {
            nextCity();
            router.back();
        }
    };

    const handleEndGame = () => {
        router.replace('/score');
    };

    if (!lastCity) return null;

    const correct = isCorrect === 'true';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={[styles.statusIcon, { backgroundColor: correct ? '#10AC84' : '#EE5253' }]}>
                        <Ionicons name={correct ? 'checkmark' : 'close'} size={60} color="white" />
                    </View>

                    <Text style={[styles.statusTitle, { color: correct ? '#10AC84' : '#EE5253' }]}>
                        {correct ? 'Brilliant!' : 'Not Quite!'}
                    </Text>

                    <View style={styles.infoCard}>
                        <Text style={styles.label}>The correct country is:</Text>
                        <Text style={styles.countryName}>{lastCity.country}</Text>

                        <View style={styles.divider} />

                        <View style={styles.factContainer}>
                            <Ionicons name="bulb-outline" size={24} color="#FF9F43" />
                            <Text style={styles.factTitle}>Did you know?</Text>
                        </View>
                        <Text style={styles.funFact}>{lastCity.funFact}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <Text style={styles.continueButtonText}>Continue</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.endButton} onPress={handleEndGame}>
                            <Text style={styles.endButtonText}>End Game</Text>
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
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
    },
    statusIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    statusTitle: {
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        color: '#636E72',
        textTransform: 'uppercase',
        fontWeight: '600',
        textAlign: 'center',
    },
    countryName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2D3436',
        textAlign: 'center',
        marginTop: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#DFE6E9',
        marginVertical: 20,
    },
    factContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    factTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3436',
        marginLeft: 8,
    },
    funFact: {
        fontSize: 15,
        color: '#636E72',
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    continueButton: {
        backgroundColor: '#10AC84',
        padding: 18,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    endButton: {
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    endButtonText: {
        color: '#B2BEC3',
        fontSize: 16,
        fontWeight: '600',
    },
});
