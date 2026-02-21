import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    HIGH_SCORE: 'geoguesser_high_score',
    FAVORITES: 'geoguesser_favorites',
    ACHIEVEMENTS: 'geoguesser_achievements',
    SOUND_ENABLED: 'geoguesser_sound_enabled',
    HAPTICS_ENABLED: 'geoguesser_haptics_enabled',
};

export const Storage = {
    async saveHighScore(score: number) {
        try {
            await AsyncStorage.setItem(KEYS.HIGH_SCORE, score.toString());
        } catch (e) {
            console.error('Error saving high score', e);
        }
    },

    async getHighScore(): Promise<number> {
        try {
            const score = await AsyncStorage.getItem(KEYS.HIGH_SCORE);
            return score ? parseInt(score, 10) : 0;
        } catch (e) {
            console.error('Error getting high score', e);
            return 0;
        }
    },

    async saveFavorites(favorites: string[]) {
        try {
            await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
        } catch (e) {
            console.error('Error saving favorites', e);
        }
    },

    async getFavorites(): Promise<string[]> {
        try {
            const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
            return favorites ? JSON.parse(favorites) : [];
        } catch (e) {
            console.error('Error getting favorites', e);
            return [];
        }
    },

    async saveAchievements(achievements: string[]) {
        try {
            await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        } catch (e) {
            console.error('Error saving achievements', e);
        }
    },

    async getAchievements(): Promise<string[]> {
        try {
            const achievements = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
            return achievements ? JSON.parse(achievements) : [];
        } catch (e) {
            console.error('Error getting achievements', e);
            return [];
        }
    },

    async saveSettings(sound: boolean, haptics: boolean) {
        try {
            await AsyncStorage.multiSet([
                [KEYS.SOUND_ENABLED, sound.toString()],
                [KEYS.HAPTICS_ENABLED, haptics.toString()],
            ]);
        } catch (e) {
            console.error('Error saving settings', e);
        }
    },

    async getSettings(): Promise<{ sound: boolean; haptics: boolean }> {
        try {
            const [[, sound], [, haptics]] = await AsyncStorage.multiGet([
                KEYS.SOUND_ENABLED,
                KEYS.HAPTICS_ENABLED,
            ]);
            return {
                sound: sound === null ? true : sound === 'true',
                haptics: haptics === null ? true : haptics === 'true',
            };
        } catch (e) {
            console.error('Error getting settings', e);
            return { sound: true, haptics: true };
        }
    }
};
