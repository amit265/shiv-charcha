import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { colors, shadows } from '@/theme/colors';
import { StorageService, defaultPreferences, defaultStats } from '@/services/storage';
import { UserPreferences, UserStats } from '@/types';
import { OnboardingModal } from '@/components/common/OnboardingModal';

const AVATAR_OPTIONS = ['🙏', '🔱', '🕉️', '📿', '🌺', '🌸', '🛕'];

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await StorageService.getPreferences();
    const s = await StorageService.getStats();
    setPrefs(p);
    setStats(s);
    setNameInput(p.userName || 'शिव शिष्य');
  };

  const handleSaveName = async () => {
    const trimmed = nameInput.trim() || (prefs.userGender === 'female' ? 'शिव शिष्या' : prefs.userGender === 'neutral' ? 'शिव भक्त' : 'शिव शिष्य');
    await StorageService.savePreferences({ userName: trimmed });
    setPrefs((prev) => ({ ...prev, userName: trimmed }));
    setIsEditingName(false);
  };

  const handleSelectGender = async (gender: 'male' | 'female' | 'neutral') => {
    const defaultName = gender === 'female' ? 'शिव शिष्या' : gender === 'neutral' ? 'शिव भक्त' : 'शिव शिष्य';
    const isGenericName = !prefs.userName || prefs.userName === 'शिव शिष्य' || prefs.userName === 'शिव शिष्या' || prefs.userName === 'शिव भक्त';
    const newName = isGenericName ? defaultName : prefs.userName;
    const defaultAvatar = gender === 'female' ? '👩' : gender === 'neutral' ? '🙏' : '👨';
    const newAvatar = (!prefs.avatarIcon || prefs.avatarIcon === '🙏' || prefs.avatarIcon === '👨' || prefs.avatarIcon === '👩') ? defaultAvatar : prefs.avatarIcon;

    await StorageService.savePreferences({ userGender: gender, userName: newName, avatarIcon: newAvatar, shareCardDefaultName: newName });
    setPrefs((prev) => ({ ...prev, userGender: gender, userName: newName, avatarIcon: newAvatar, shareCardDefaultName: newName }));
    setNameInput(newName);
  };

  const handleSelectAvatar = async (icon: string) => {
    await StorageService.savePreferences({ avatarIcon: icon });
    setPrefs((prev) => ({ ...prev, avatarIcon: icon }));
    setShowAvatarPicker(false);
  };

  const handleOnboardingComplete = async (userName: string, avatarIcon: string) => {
    await StorageService.savePreferences({
      userName,
      avatarIcon,
      hasCompletedOnboarding: true,
    });
    setPrefs((prev) => ({
      ...prev,
      userName,
      avatarIcon,
      hasCompletedOnboarding: true,
    }));
    setShowOnboardingModal(false);
  };

  const getSubText = () => {
    if (prefs.userGender === 'female') return 'शिव शिष्या • नमः शिवाय साधना';
    if (prefs.userGender === 'neutral') return 'शिव भक्त • नमः शिवाय साधना';
    return 'शिव शिष्य • नमः शिवाय साधना';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="मेरी शिव शिष्यता प्रोफाइल"
        subtitle="व्यक्तिगत यात्रा • साधना आँकड़े"
        rightAction={
          <TouchableOpacity
            style={[
              styles.headerRightBtn,
              { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: theme.borderGold },
            ]}
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* USER PROFILE IDENTITY CARD */}
        <View style={[styles.userCard, { backgroundColor: theme.primaryDark, borderColor: theme.accent }]}>
          <TouchableOpacity
            style={[styles.avatarCircle, { backgroundColor: theme.accent, borderColor: theme.borderGold }]}
            onPress={() => setShowAvatarPicker(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{prefs.avatarIcon || '🙏'}</Text>
            <View style={[styles.avatarEditBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Text style={{ fontSize: 10 }}>✏️</Text>
            </View>
          </TouchableOpacity>

          {isEditingName ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    backgroundColor: theme.surfaceElevated,
                    color: theme.textPrimary,
                    borderColor: theme.borderGold,
                  },
                ]}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
              />
              <TouchableOpacity style={[styles.saveNameBtn, { backgroundColor: theme.accent }]} onPress={handleSaveName}>
                <Text style={[styles.saveNameText, { color: theme.primaryDark }]}>सहेजें</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.nameRow} onPress={() => setIsEditingName(true)}>
              <Text style={[styles.userNameText, { color: theme.textGold }]}>
                {prefs.userName || (prefs.userGender === 'female' ? 'शिव शिष्या' : 'शिव शिष्य')} 🙏
              </Text>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.userSubText, { color: theme.textWhite }]}>
            {getSubText()}
          </Text>

          {/* Disciple Gender / Title Selector Pills */}
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderPill,
                { backgroundColor: (prefs.userGender || 'male') === 'male' ? theme.accent : 'rgba(255,255,255,0.15)' },
              ]}
              onPress={() => handleSelectGender('male')}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderPillText, { color: (prefs.userGender || 'male') === 'male' ? theme.primaryDark : '#FFF' }]}>
                👨 शिव शिष्य
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderPill,
                { backgroundColor: prefs.userGender === 'female' ? theme.accent : 'rgba(255,255,255,0.15)' },
              ]}
              onPress={() => handleSelectGender('female')}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderPillText, { color: prefs.userGender === 'female' ? theme.primaryDark : '#FFF' }]}>
                👩 शिव शिष्या
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderPill,
                { backgroundColor: prefs.userGender === 'neutral' ? theme.accent : 'rgba(255,255,255,0.15)' },
              ]}
              onPress={() => handleSelectGender('neutral')}
              activeOpacity={0.8}
            >
              <Text style={[styles.genderPillText, { color: prefs.userGender === 'neutral' ? theme.primaryDark : '#FFF' }]}>
                🙏 शिव भक्त
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: MY SHIV GURU DEVOTIONAL STATS */}
        <Text style={[styles.sectionHeaderTitle, { color: theme.primary }]}>मेरी शिव गुरु यात्रा 📊</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>{stats.activeDays}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>सक्रिय दिन</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>{stats.japCompletions}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>108 जाप पूर्ण</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>{stats.totalJapCount || stats.japCompletions * 108}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>कुल मणके</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>{stats.audioListenedCount}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>ऑडियो सुने</Text>
          </View>
        </View>

        {/* SECTION: DEVOTIONAL TOOLS SHORTCUTS */}
        <Text style={[styles.sectionHeaderTitle, { color: theme.primary }]}>साधना केंद्र एवं सुविधाएं 🌸</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => router.push('/puja' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.toolIcon}>🌸</Text>
            <View style={styles.toolTextCol}>
              <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>शिव लिंग पूजा सेवा</Text>
              <Text style={[styles.toolSub, { color: theme.textSecondary }]}>जल, बेलपत्र व आरती चढ़ाएं</Text>
            </View>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => router.push('/jap' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.toolIcon}>📿</Text>
            <View style={styles.toolTextCol}>
              <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>108 जाप साधना</Text>
              <Text style={[styles.toolSub, { color: theme.textSecondary }]}>मंत्र जाप काउंटर व रुद्राक्ष</Text>
            </View>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => router.push('/gallery' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.toolIcon}>🖼️</Text>
            <View style={styles.toolTextCol}>
              <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>पावन गैलरी व वॉलपेपर</Text>
              <Text style={[styles.toolSub, { color: theme.textSecondary }]}>एचडी शिव वॉलपेपर संग्रह</Text>
            </View>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => router.push('/ringtones' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.toolIcon}>🔔</Text>
            <View style={styles.toolTextCol}>
              <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>भक्तिमय ध्वनियाँ व रिंगटोन</Text>
              <Text style={[styles.toolSub, { color: theme.textSecondary }]}>शंख, डमरू व मंत्र ध्वनियाँ</Text>
            </View>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>➔</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION: ONBOARDING TOUR REPLAY */}
        <TouchableOpacity
          style={[styles.tourBanner, { backgroundColor: theme.surfaceElevated, borderColor: theme.accent }]}
          onPress={() => setShowOnboardingModal(true)}
          activeOpacity={0.85}
        >
          <View style={styles.tourLeft}>
            <Text style={{ fontSize: 26, marginRight: 12 }}>🌸</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tourTitle, { color: theme.primary }]}>शिव चर्चा 3 सूत्र एवं परिचय</Text>
              <Text style={[styles.tourSub, { color: theme.textSecondary }]}>
                साहब श्री हरिंद्रानंद जी के 3 सूत्र व ऐप परिचय पुनः देखें
              </Text>
            </View>
          </View>
          <Text style={[styles.tourBtnText, { color: theme.primary }]}>देखें ➔</Text>
        </TouchableOpacity>

        {/* SECTION: FULL SETTINGS ENTRY BANNER */}
        <TouchableOpacity
          style={[styles.settingsEntryCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
          onPress={() => router.push('/settings' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.settingsEntryLeft}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>⚙️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingsEntryTitle, { color: theme.textPrimary }]}>ऐप सेटिंग्स एवं कानूनी नीतियाँ</Text>
              <Text style={[styles.settingsEntrySub, { color: theme.textSecondary }]}>
                थीम बदलें, ध्वनि/कंपन, ऐप शेयर, रेटिंग एवं नीतियाँ
              </Text>
            </View>
          </View>
          <View style={[styles.settingsEntryBadge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.settingsEntryBadgeText, { color: theme.textWhite }]}>खोलें ➔</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* AVATAR PICKER MODAL */}
      <Modal
        visible={showAvatarPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.avatarModalContainer, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}>
            <Text style={[styles.avatarModalTitle, { color: theme.primary }]}>अपना पावन प्रतीक चुनें 🙏</Text>

            <View style={styles.avatarPickerGrid}>
              {AVATAR_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.avatarSelectBtn,
                    {
                      backgroundColor: prefs.avatarIcon === icon ? theme.primary : theme.surfaceElevated,
                      borderColor: prefs.avatarIcon === icon ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => handleSelectAvatar(icon)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 28 }}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.avatarModalCloseBtn} onPress={() => setShowAvatarPicker(false)}>
              <Text style={[styles.avatarModalCloseText, { color: theme.textSecondary }]}>बंद करें</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ONBOARDING MODAL REPLAY */}
      <OnboardingModal
        visible={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onComplete={handleOnboardingComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  headerRightBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    position: 'relative',
  },
  avatarText: {
    fontSize: 34,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
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
    color: '#000000',
    width: 160,
  },
  saveNameBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  saveNameText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  userSubText: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  genderPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  genderPillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    ...shadows.soft,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  toolsGrid: {
    marginBottom: 20,
    gap: 10,
  },
  toolCard: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    ...shadows.soft,
  },
  toolIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  toolTextCol: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  toolSub: {
    fontSize: 11,
    marginTop: 2,
  },
  tourBanner: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.soft,
  },
  tourLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  tourTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tourSub: {
    fontSize: 11,
    marginTop: 2,
  },
  tourBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsEntryCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.soft,
  },
  settingsEntryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  settingsEntryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingsEntrySub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  settingsEntryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  settingsEntryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatarModalContainer: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    alignItems: 'center',
    ...shadows.medium,
  },
  avatarModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  avatarPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarSelectBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarModalCloseBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  avatarModalCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
