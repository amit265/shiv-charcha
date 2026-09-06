import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { colors, shadows } from '@/theme/colors';
import { StorageService, defaultPreferences, defaultStats } from '@/services/storage';
import { UserPreferences, UserStats } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await StorageService.getPreferences();
    const s = await StorageService.getStats();
    setPrefs(p);
    setStats(s);
    setNameInput(p.userName);
  };

  const handleSaveName = async () => {
    await StorageService.savePreferences({ userName: nameInput });
    setPrefs(prev => ({ ...prev, userName: nameInput }));
    setIsEditingName(false);
  };

  const toggleSound = async (val: boolean) => {
    await StorageService.savePreferences({ soundEnabled: val });
    setPrefs(prev => ({ ...prev, soundEnabled: val }));
  };

  const toggleHaptics = async (val: boolean) => {
    await StorageService.savePreferences({ hapticsEnabled: val });
    setPrefs(prev => ({ ...prev, hapticsEnabled: val }));
  };

  const toggleNotifications = async (val: boolean) => {
    await StorageService.savePreferences({ notificationsEnabled: val });
    setPrefs(prev => ({ ...prev, notificationsEnabled: val }));
  };

  return (
    <View style={styles.container}>
      <Header
        title="मेरी शिव शिष्यता प्रोफाइल"
        subtitle="व्यक्तिगत यात्रा • ऐप सेटिंग्स"
        rightAction={
          <TouchableOpacity
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderWidth: 1,
              borderColor: theme.borderGold,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>🙏</Text>
          </View>

          {isEditingName ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
              />
              <TouchableOpacity style={styles.saveNameBtn} onPress={handleSaveName}>
                <Text style={styles.saveNameText}>सहेजें</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.nameRow} onPress={() => setIsEditingName(true)}>
              <Text style={styles.userNameText}>{prefs.userName} 🙏</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.userSubText}>शिव शिष्य • नमः शिवाय साधना</Text>
        </View>

        {/* SECTION: MY SHIV GURU JOURNEY */}
        <Text style={styles.sectionHeaderTitle}>मेरी शिव गुरु यात्रा 📊</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.activeDays}</Text>
            <Text style={styles.statLabel}>सक्रिय दिन</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.japCompletions}</Text>
            <Text style={styles.statLabel}>108 जाप पूर्ण</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.audioListenedCount}</Text>
            <Text style={styles.statLabel}>ऑडियो सुने</Text>
          </View>
        </View>

        {/* Quick Utilities Shortcuts */}
        <View style={styles.shortcutRow}>
          <TouchableOpacity
            style={styles.shortcutBtn}
            onPress={() => router.push('/gallery' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.shortcutIcon}>🖼️</Text>
            <Text style={styles.shortcutText}>वॉलपेपर</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutBtn}
            onPress={() => router.push('/ringtones' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.shortcutIcon}>🔔</Text>
            <Text style={styles.shortcutText}>रिंगटोन</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION: SETTINGS */}
        <Text style={[styles.sectionHeaderTitle, { color: theme.primary }]}>ऐप सेटिंग्स ⚙️</Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/theme-selector' as any)}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>🎨 ऐप रंग-सज्जा (Theme)</Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                {theme.nameHindi}
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: theme.accent, fontWeight: 'bold' }}>बदलें ➔</Text>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>🔊 ध्वनि प्रभाव (Sound)</Text>
            <Switch
              value={prefs.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#D7CCC8', true: theme.accent }}
              thumbColor={prefs.soundEnabled ? theme.primary : '#F5F5F5'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>📳 कंपन प्रतिक्रिया (Vibration)</Text>
            <Switch
              value={prefs.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#D7CCC8', true: theme.accent }}
              thumbColor={prefs.hapticsEnabled ? theme.primary : '#F5F5F5'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>🔔 दैनिक स्मरण सूचनाएं (Notifications)</Text>
            <Switch
              value={prefs.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#D7CCC8', true: theme.accent }}
              thumbColor={prefs.notificationsEnabled ? theme.primary : '#F5F5F5'}
            />
          </View>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomWidth: 0, paddingTop: 14 }]}
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.primary, fontWeight: 'bold' }]}>⚙️ सभी सेटिंग्स, शेयर एवं कानूनी नीतियाँ</Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                ऐप शेयर, रेटिंग, हमारे अन्य ऐप एवं नीतियाँ
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: theme.primary, fontWeight: 'bold' }}>खोलें ➔</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION: ABOUT & LEGAL */}
        <Text style={styles.sectionHeaderTitle}>ऐप परिचय व कानूनी जानकारी ℹ️</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>महाव्योम स्टूडियो (Mahavyoma Studio)</Text>
          <Text style={styles.aboutDesc}>
            शिव चर्चा V1 — एक सुंदर, सहज, भक्तिमय और सर्वसुलभ डिजिटल साथी।
          </Text>

          <View style={styles.legalList}>
            <Text style={styles.legalItem}>• सर्वाधिकार सुरक्षित © महाव्योम स्टूडियो</Text>
            <Text style={styles.legalItem}>
              • सामग्री आभार: साहब श्री हरिंद्रानंद जी एवं दीदी माँ नीलम आनंद जी के पावन विचार
            </Text>
            <Text style={styles.legalItem}>• गोपनीयता नीति (Privacy Policy) & सेवा शर्तें</Text>
            <Text style={styles.legalItem}>• ओपन सोर्स लाइसेंस व श्रेय</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgIvory,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  userCard: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
    ...shadows.medium,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  editIcon: {
    fontSize: 14,
    marginLeft: 8,
  },
  editNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    color: colors.textDark,
    width: 160,
  },
  saveNameBtn: {
    backgroundColor: colors.goldPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  saveNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  userSubText: {
    fontSize: 12,
    color: colors.bgIvory,
    opacity: 0.85,
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginBottom: 10,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statBox: {
    backgroundColor: colors.cardBgAmber,
    borderRadius: 16,
    padding: 14,
    flex: 0.31,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
    ...shadows.soft,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.saffronDark,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMedium,
    marginTop: 4,
    textAlign: 'center',
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  shortcutBtn: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  shortcutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  shortcutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  settingsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingLabel: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  aboutCard: {
    backgroundColor: colors.bgSoftAmber,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  aboutDesc: {
    fontSize: 13,
    color: colors.textMedium,
    marginTop: 4,
    lineHeight: 18,
  },
  legalList: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderGold,
  },
  legalItem: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 18,
  },
});
