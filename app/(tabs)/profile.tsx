import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { colors, shadows } from '@/theme/colors';
import { StorageService, getFormattedUserName, defaultPreferences, defaultStats } from '@/services/storage';
import { UserPreferences, UserStats } from '@/types';
import { OnboardingModal } from '@/components/common/OnboardingModal';

const AVATAR_OPTIONS = ['🙏', '👨', '👩', '🔱', '🕉️', '📿', '🌺', '🌸', '🛕'];

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [stats, setStats] = useState<UserStats>(defaultStats);

  // Unified Edit Profile Modal states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('🙏');

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const p = await StorageService.getPreferences();
    const s = await StorageService.getStats();
    setPrefs(p);
    setStats(s);
  };

  const handleOpenEditModal = () => {
    setEditName(getFormattedUserName(prefs));
    setEditAvatar(prefs.avatarIcon || '🙏');
    setShowEditProfileModal(true);
  };

  const handleSaveCombinedProfile = async () => {
    const formatted = editName.trim() || getFormattedUserName(prefs);

    const updatedPrefs: UserPreferences = {
      ...prefs,
      userName: formatted,
      avatarIcon: editAvatar,
      shareCardDefaultName: formatted,
    };

    await StorageService.savePreferences(updatedPrefs);
    setPrefs(updatedPrefs);
    setShowEditProfileModal(false);
  };

  const handleOnboardingComplete = async (userName: string, avatarIcon: string) => {
    const updatedPrefs: UserPreferences = {
      ...prefs,
      userName,
      avatarIcon,
      shareCardDefaultName: userName,
      hasCompletedOnboarding: true,
    };
    await StorageService.savePreferences(updatedPrefs);
    setPrefs(updatedPrefs);
    setShowOnboardingModal(false);
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
          {/* Top-Right Single Edit Button */}
          <TouchableOpacity
            style={[styles.editBoxBtn, { backgroundColor: 'rgba(255, 255, 255, 0.18)', borderColor: theme.borderGold }]}
            onPress={handleOpenEditModal}
            activeOpacity={0.8}
          >
            <Text style={[styles.editBoxBtnText, { color: theme.textGold }]}>✏️ संपादित करें</Text>
          </TouchableOpacity>

          {/* Avatar Circle */}
          <View style={[styles.avatarCircle, { backgroundColor: theme.accent, borderColor: theme.borderGold }]}>
            <Text style={styles.avatarText}>{prefs.avatarIcon || '🙏'}</Text>
          </View>

          {/* User Name */}
          <Text style={[styles.userNameText, { color: theme.textGold }]}>
            {getFormattedUserName(prefs)}
          </Text>

          <Text style={[styles.userSubText, { color: theme.textWhite }]}>
            नमः शिवाय साधना • शिव शिष्यता
          </Text>
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

      {/* UNIFIED EDIT PROFILE MODAL */}
      <Modal
        visible={showEditProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editModalContainer, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>प्रोफाइल संपादित करें ✏️</Text>

            {/* Avatar Picker Section */}
            <Text style={[styles.inputSectionLabel, { color: theme.textPrimary }]}>पावन प्रतीक (Avatar) चुनें:</Text>
            <View style={styles.avatarPickerGrid}>
              {AVATAR_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.avatarSelectBtn,
                    {
                      backgroundColor: editAvatar === icon ? theme.primary : theme.surfaceElevated,
                      borderColor: editAvatar === icon ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => setEditAvatar(icon)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 28 }}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Name Input Section */}
            <Text style={[styles.inputSectionLabel, { color: theme.textPrimary }]}>आपका नाम लिखें:</Text>
            <TextInput
              style={[
                styles.modalNameInput,
                {
                  backgroundColor: theme.surfaceElevated,
                  color: theme.textPrimary,
                  borderColor: theme.border,
                },
              ]}
              value={editName}
              onChangeText={setEditName}
              placeholder="जैसे: शिव शिष्य अमित"
              placeholderTextColor={theme.textMuted}
            />

            {/* Action Buttons */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.modalCloseBtn, { borderColor: theme.border }]}
                onPress={() => setShowEditProfileModal(false)}
              >
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>रद्द करें</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: theme.primary }]}
                onPress={handleSaveCombinedProfile}
              >
                <Text style={[styles.modalSaveText, { color: theme.textWhite }]}>सहेजें ✓</Text>
              </TouchableOpacity>
            </View>
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
    position: 'relative',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  editBoxBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 10,
  },
  editBoxBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 34,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userSubText: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
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
  editModalContainer: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    ...shadows.medium,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputSectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  avatarPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarSelectBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  modalNameInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 20,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCloseBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
