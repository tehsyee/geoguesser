import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../src/context/GameContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { soundEnabled, hapticsEnabled, updateSettings } = useGame();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#2D3436" />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Audio & Feedback</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="volume-high-outline" size={24} color="#636E72" />
                            <Text style={styles.settingLabel}>Sound Effects</Text>
                        </View>
                        <Switch
                            value={soundEnabled}
                            onValueChange={(val) => updateSettings(val, hapticsEnabled)}
                            trackColor={{ false: '#DFE6E9', true: '#10AC84' }}
                            thumbColor="white"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="finger-print-outline" size={24} color="#636E72" />
                            <Text style={styles.settingLabel}>Haptic Feedback</Text>
                        </View>
                        <Switch
                            value={hapticsEnabled}
                            onValueChange={(val) => updateSettings(soundEnabled, val)}
                            trackColor={{ false: '#DFE6E9', true: '#10AC84' }}
                            thumbColor="white"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.aboutItem}>
                        <Text style={styles.aboutLabel}>Version</Text>
                        <Text style={styles.aboutValue}>1.2.0 (Premium)</Text>
                    </View>
                    <View style={styles.aboutItem}>
                        <Text style={styles.aboutLabel}>Developer</Text>
                        <Text style={styles.aboutValue}>Antigravity AI</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={() => {/* In a real app, clear all storage */ }}
                >
                    <Text style={styles.resetBtnText}>Clear Game Progress</Text>
                </TouchableOpacity>
            </View>
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
    content: {
        padding: 20,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#B2BEC3',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3436',
    },
    aboutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    aboutLabel: {
        fontSize: 16,
        color: '#636E72',
    },
    aboutValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3436',
    },
    resetBtn: {
        marginTop: 10,
        padding: 15,
        alignItems: 'center',
    },
    resetBtnText: {
        color: '#EE5253',
        fontWeight: '600',
        fontSize: 14,
    }
});
