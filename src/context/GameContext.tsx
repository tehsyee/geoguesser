import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import citiesData from '../data/cities.json';
import { Storage } from '../utils/storage';

export type Continent = 'Africa' | 'Antarctica' | 'Asia' | 'Europe' | 'North America' | 'Australia/Oceania' | 'South America' | 'All';

export interface City {
    name: string;
    country: string;
    continent: string;
    imageUrl: string;
    funFact: string;
}

interface GameState {
    selectedContinent: Continent;
    score: number;
    totalAttempts: number;
    remainingCities: City[];
    currentCity: City | null;
    lastCity: City | null;
    difficulty: 'Easy' | 'Hard';
    isGameOver: boolean;
    hintsUsed: number;
    hintRevealed: boolean;
    highScore: number;
    favorites: string[];
    unlockedAchievements: string[];
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    gameStartTime: number;
    totalTime: number;
}

interface GameContextType extends GameState {
    startGame: (continent: Continent, difficulty: 'Easy' | 'Hard') => void;
    submitAnswer: (answer: string) => boolean;
    nextCity: () => void;
    useHint: () => string;
    toggleFavorite: (cityName: string) => void;
    isFavorite: (cityName: string) => boolean;
    updateSettings: (sound: boolean, haptics: boolean) => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<GameState>({
        selectedContinent: 'All',
        score: 0,
        totalAttempts: 0,
        remainingCities: [],
        currentCity: null,
        lastCity: null,
        difficulty: 'Easy',
        isGameOver: false,
        hintsUsed: 0,
        hintRevealed: false,
        highScore: 0,
        favorites: [],
        unlockedAchievements: [],
        soundEnabled: true,
        hapticsEnabled: true,
        gameStartTime: 0,
        totalTime: 0,
    });

    useEffect(() => {
        const loadPersistedData = async () => {
            const highScore = await Storage.getHighScore();
            const favorites = await Storage.getFavorites();
            const unlockedAchievements = await Storage.getAchievements();
            const settings = await Storage.getSettings();
            setState(prev => ({
                ...prev,
                highScore,
                favorites,
                unlockedAchievements,
                soundEnabled: settings.sound,
                hapticsEnabled: settings.haptics,
            }));
        };
        loadPersistedData();
    }, []);

    const playSound = async (type: 'success' | 'failure' | 'click' | 'achievement') => {
        if (!state.soundEnabled) return;
        try {
            const soundObject = new Audio.Sound();
            let source;
            if (type === 'success') {
                source = { uri: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3' };
            } else if (type === 'failure') {
                source = { uri: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3' };
            } else if (type === 'achievement') {
                source = { uri: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3' };
            } else {
                source = { uri: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' };
            }
            await soundObject.loadAsync(source);
            await soundObject.playAsync();
        } catch (error) {
            console.log('Error playing sound', error);
        }
    };

    const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'error') => {
        if (!state.hapticsEnabled) return;
        if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        else if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    };

    const startGame = (continent: Continent, difficulty: 'Easy' | 'Hard') => {
        let filteredCities = citiesData.cities;
        if (continent !== 'All') {
            filteredCities = citiesData.cities.filter(c => c.continent === continent);
        }

        const shuffled = [...filteredCities].sort(() => Math.random() - 0.5);

        setState(prev => ({
            ...prev,
            selectedContinent: continent,
            score: 0,
            totalAttempts: 0,
            remainingCities: shuffled.slice(1),
            currentCity: shuffled[0] || null,
            lastCity: null,
            difficulty,
            isGameOver: false,
            hintsUsed: 0,
            hintRevealed: false,
            gameStartTime: Date.now(),
            totalTime: 0,
        }));

        triggerHaptic('medium');
        playSound('click');
    };

    const submitAnswer = (answer: string) => {
        if (!state.currentCity) return false;

        const isCorrect = answer.toLowerCase().trim() === state.currentCity.country.toLowerCase().trim();

        if (isCorrect) {
            triggerHaptic('success');
            playSound('success');
            checkAchievements('correct_answer');
        } else {
            triggerHaptic('error');
            playSound('failure');
        }

        setState(prev => {
            const newScore = isCorrect ? prev.score + 1 : prev.score;
            const newHighScore = Math.max(prev.highScore, newScore);

            if (newHighScore > prev.highScore) {
                Storage.saveHighScore(newHighScore);
            }

            return {
                ...prev,
                score: newScore,
                totalAttempts: prev.totalAttempts + 1,
                lastCity: prev.currentCity,
                highScore: newHighScore,
            };
        });

        return isCorrect;
    };

    const nextCity = () => {
        if (state.remainingCities.length === 0) {
            const endTime = Date.now();
            const timeTaken = Math.floor((endTime - state.gameStartTime) / 1000);
            setState(prev => ({ ...prev, isGameOver: true, totalTime: timeTaken }));
            checkAchievements('game_complete', timeTaken);
            return;
        }

        const next = state.remainingCities[0];
        setState(prev => ({
            ...prev,
            remainingCities: prev.remainingCities.slice(1),
            currentCity: next,
            hintRevealed: false,
        }));

        triggerHaptic('light');
        playSound('click');
    };

    const useHint = () => {
        if (!state.currentCity) return '';

        setState(prev => ({
            ...prev,
            hintsUsed: prev.hintsUsed + 1,
            hintRevealed: true,
        }));

        triggerHaptic('medium');
        playSound('click');

        return `Hint: The country starts with "${state.currentCity.country[0]}"`;
    };

    const toggleFavorite = (cityName: string) => {
        setState(prev => {
            const isFav = prev.favorites.includes(cityName);
            const nextFavs = isFav
                ? prev.favorites.filter(name => name !== cityName)
                : [...prev.favorites, cityName];

            Storage.saveFavorites(nextFavs);
            triggerHaptic('light');

            if (nextFavs.length >= 5) {
                checkAchievements('favorites_count');
            }

            return {
                ...prev,
                favorites: nextFavs,
            };
        });
    };

    const isFavorite = (cityName: string) => state.favorites.includes(cityName);

    const updateSettings = (sound: boolean, haptics: boolean) => {
        setState(prev => ({
            ...prev,
            soundEnabled: sound,
            hapticsEnabled: haptics,
        }));
        Storage.saveSettings(sound, haptics);
    };

    const checkAchievements = (event: 'correct_answer' | 'game_complete' | 'favorites_count', extra?: number) => {
        const toUnlock: string[] = [];

        if (event === 'correct_answer') {
            if (!state.unlockedAchievements.includes('first_win')) {
                toUnlock.push('first_win');
            }
            if (state.difficulty === 'Hard' && !state.unlockedAchievements.includes('hard_mode')) {
                toUnlock.push('hard_mode');
            }
        }

        if (event === 'game_complete') {
            const timeTaken = extra || 0;
            if (!state.unlockedAchievements.includes('continent_master')) {
                toUnlock.push('continent_master');
            }
            const accuracy = Math.round((state.score / state.totalAttempts) * 100);
            if (accuracy === 100 && state.totalAttempts >= 5 && !state.unlockedAchievements.includes('perfect_score')) {
                toUnlock.push('perfect_score');
            }
            // Speed Demon: Finish a game in less than 30 seconds (at least 5 questions)
            if (timeTaken < 30 && state.totalAttempts >= 5 && !state.unlockedAchievements.includes('speed_demon')) {
                toUnlock.push('speed_demon');
            }
        }

        if (event === 'favorites_count') {
            if (state.favorites.length >= 5 && !state.unlockedAchievements.includes('geography_buff')) {
                toUnlock.push('geography_buff');
            }
        }

        if (toUnlock.length > 0) {
            playSound('achievement');
            setState(prev => {
                const nextUnlocked = Array.from(new Set([...prev.unlockedAchievements, ...toUnlock]));
                Storage.saveAchievements(nextUnlocked);
                return { ...prev, unlockedAchievements: nextUnlocked };
            });
        }
    };

    const resetGame = () => {
        setState(prev => ({
            ...prev,
            selectedContinent: 'All',
            score: 0,
            totalAttempts: 0,
            remainingCities: [],
            currentCity: null,
            lastCity: null,
            difficulty: 'Easy',
            isGameOver: false,
            hintsUsed: 0,
            hintRevealed: false,
            gameStartTime: 0,
            totalTime: 0,
        }));
        playSound('click');
    };

    return (
        <GameContext.Provider value={{ ...state, startGame, submitAnswer, nextCity, useHint, toggleFavorite, isFavorite, updateSettings, resetGame }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
