import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Continent, useGame } from '../src/context/GameContext';

const continents: { name: Continent; icon: string; color: string; fact: string }[] = [
    { name: 'Africa', icon: 'earth', color: '#FF9F43', fact: 'Home to the world\'s largest desert, the Sahara.' },
    { name: 'Antarctica', icon: 'snow', color: '#54A0FF', fact: 'The coldest, driest, and windiest continent.' },
    { name: 'Asia', icon: 'earth-sharp', color: '#10AC84', fact: 'The largest continent by both land area and population.' },
    { name: 'Europe', icon: 'business', color: '#5F27CD', fact: 'Contains the world\'s smallest country, Vatican City.' },
    { name: 'North America', icon: 'map', color: '#EE5253', fact: 'The only continent with every kind of climate.' },
    { name: 'Australia/Oceania', icon: 'sunny', color: '#00D2D3', fact: 'The smallest continent, but a large island nation.' },
    { name: 'South America', icon: 'leaf', color: '#2E86DE', fact: 'Home to the Amazon Rainforest and River.' },
    { name: 'All', icon: 'repeat', color: '#8395A7', fact: 'Test your knowledge across the entire globe!' },
];

export default function ContinentSelection() {
    const router = useRouter();
    const { startGame } = useGame();
    const [difficulty, setDifficulty] = useState<'Easy' | 'Hard'>('Easy');

    const handleSelect = (continent: Continent) => {
        startGame(continent, difficulty);
        router.push('/game');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.headerMain}>
                        <View style={styles.headerText}>
                            <Text style={styles.title}>GeoGuesser</Text>
                            <Text style={styles.subtitle}>Challenge</Text>
                        </View>
                        <TouchableOpacity style={[styles.headerBtn, styles.favoritesBtn]} onPress={() => router.push('/favorites')}>
                            <Ionicons name="heart" size={24} color="#EE5253" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.headerBtn, styles.settingsBtn]} onPress={() => router.push('/settings')}>
                            <Ionicons name="settings-outline" size={24} color="#636E72" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.description}>Choose your level and continent</Text>
                </View>

                <View style={styles.difficultyContainer}>
                    <TouchableOpacity
                        style={[styles.difficultyBtn, difficulty === 'Easy' && styles.difficultyBtnActive]}
                        onPress={() => setDifficulty('Easy')}
                    >
                        <Ionicons name="list-outline" size={20} color={difficulty === 'Easy' ? 'white' : '#636E72'} />
                        <Text style={[styles.difficultyText, difficulty === 'Easy' && styles.difficultyTextActive]}>Easy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.difficultyBtn, difficulty === 'Hard' && styles.difficultyBtnActive]}
                        onPress={() => setDifficulty('Hard')}
                    >
                        <Ionicons name="create-outline" size={20} color={difficulty === 'Hard' ? 'white' : '#636E72'} />
                        <Text style={[styles.difficultyText, difficulty === 'Hard' && styles.difficultyTextActive]}>Hard</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                    {continents.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 5 }]}
                            onPress={() => handleSelect(item.name)}
                        >
                            <View style={styles.cardHeader}>
                                <Ionicons name={item.icon as any} size={24} color={item.color} />
                                <Text style={styles.continentName}>{item.name}</Text>
                            </View>
                            <Text style={styles.continentFact}>{item.fact}</Text>
                        </TouchableOpacity>
                    ))}
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
        padding: 20,
    },
    header: {
        marginBottom: 30,
        marginTop: 20,
        alignItems: 'center',
    },
    headerMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    headerText: {
        alignItems: 'center',
    },
    headerBtn: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    favoritesBtn: {
        right: 50,
        top: 0,
    },
    settingsBtn: {
        right: 0,
        top: 0,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2D3436',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 32,
        fontWeight: '300',
        color: '#10AC84',
        marginTop: -5,
    },
    description: {
        fontSize: 16,
        color: '#636E72',
        marginTop: 10,
        textAlign: 'center',
    },
    difficultyContainer: {
        flexDirection: 'row',
        backgroundColor: '#DFE6E9',
        borderRadius: 15,
        padding: 5,
        marginBottom: 25,
    },
    difficultyBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    difficultyBtnActive: {
        backgroundColor: '#10AC84',
        shadowColor: '#10AC84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    difficultyText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#636E72',
    },
    difficultyTextActive: {
        color: 'white',
    },
    grid: {
        gap: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    continentName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3436',
        marginLeft: 10,
    },
    continentFact: {
        fontSize: 13,
        color: '#B2BEC3',
        marginLeft: 34,
    },
});
