import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../src/context/GameContext';
import citiesData from '../src/data/cities.json';

export default function FavoritesScreen() {
    const router = useRouter();
    const { favorites, toggleFavorite } = useGame();

    const favoriteCities = citiesData.cities.filter(c => favorites.includes(c.name));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#2D3436" />
                </TouchableOpacity>
                <Text style={styles.title}>Favorite Cities</Text>
            </View>

            {favoriteCities.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="heart-outline" size={80} color="#DFE6E9" />
                    <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                    <Text style={styles.emptySub}>Cities you heart during gameplay will appear here!</Text>
                    <TouchableOpacity style={styles.startBtn} onPress={() => router.replace('/')}>
                        <Text style={styles.startBtnText}>Start Exploring</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.grid}>
                        {favoriteCities.map(city => (
                            <View key={city.name} style={styles.card}>
                                <Image source={{ uri: city.imageUrl }} style={styles.image} contentFit="cover" />
                                <View style={styles.cardInfo}>
                                    <View style={styles.cardHeader}>
                                        <View>
                                            <Text style={styles.cityName}>{city.name}</Text>
                                            <Text style={styles.countryName}>{city.country}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => toggleFavorite(city.name)}>
                                            <Ionicons name="heart" size={24} color="#EE5253" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.funFact} numberOfLines={2}>{city.funFact}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#DFE6E9',
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2D3436',
    },
    scrollContent: {
        padding: 20,
    },
    grid: {
        gap: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
    },
    cardInfo: {
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    cityName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3436',
    },
    countryName: {
        fontSize: 14,
        color: '#10AC84',
        fontWeight: '600',
    },
    funFact: {
        fontSize: 13,
        color: '#636E72',
        lineHeight: 18,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2D3436',
        marginTop: 20,
    },
    emptySub: {
        fontSize: 15,
        color: '#636E72',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    startBtn: {
        backgroundColor: '#10AC84',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
    },
    startBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
