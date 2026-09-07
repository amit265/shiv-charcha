import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';
import { dailyMessages } from '@/content/dailyMessages';
import { audioLibrary } from '@/content/audioLibrary';
import { sacredDates } from '@/content/dates';
import { getTodayCharchaPrompt } from '@/content/charchaPrompts';
import { pravachanLibrary } from '@/content/pravachanLibrary';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';

import { StorageService, getFormattedUserName } from '@/services/storage';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { getTodayPanchang } from '@/services/panchangService';
import { FormattedText } from '@/components/common/FormattedText';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();
  const panchang = getTodayPanchang();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [formattedName, setFormattedName] = useState<string>('शिव शिष्य');
  const [sutraStreak, setSutraStreak] = useState<number>(0);
  const [past7Days, setPast7Days] = useState<Array<{ date: string; dayName: string; completed: boolean }>>([]);

  const todayMsg = dailyMessages[0];
  const todayBhajan = audioLibrary[0];
  const specialDate = sacredDates[0];
  const todayPrompt = getTodayCharchaPrompt();
  const featuredPravachan = pravachanLibrary[0];

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    const prefs = await StorageService.getPreferences();
    if (!prefs.hasCompletedOnboarding) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 3200);
    }
    setFormattedName(getFormattedUserName(prefs));

    const streakData = await StorageService.getSutraStreak();
    setSutraStreak(streakData.streak);
    setPast7Days(streakData.past7Days);
  };

  const handleOnboardingComplete = async (userName: string, avatarIcon: string) => {
    await StorageService.savePreferences({
      userName,
      avatarIcon,
      hasCompletedOnboarding: true,
    });
    setShowOnboarding(false);
    loadUserData();
  };

  const handleShareMessage = async () => {
    await safeShare({
      title: todayMsg.title,
      message: `🌸 *आज का शिव गुरु संदेश* 🌸\n\n"${todayMsg.title}"\n${todayMsg.shortMessage}\n\n${todayMsg.shareCardPrompt}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
    });
  };

  const handleSharePrompt = async () => {
    await safeShare({
      title: todayPrompt.title,
      message: `🗣️ *आज का शिव चर्चा विषय* 🗣️\n\n"${todayPrompt.title}"\n\n${todayPrompt.questionPrompt}\n\n"${todayPrompt.sahibJiQuote}"\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        rightAction={
          <View style={styles.headerRightRow}>
            <TouchableOpacity
              style={[
                styles.headerActionBtn,
                { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: theme.borderGold },
              ]}
              onPress={() => router.push('/calendar' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.headerActionIcon}>📅</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.headerActionBtn,
                { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: theme.borderGold },
              ]}
              onPress={() => router.push('/settings' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.headerActionIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Greeting & 2-Line Panchang Badge */}
        <View style={[styles.greetingBanner, { backgroundColor: theme.primary, borderColor: theme.accent }]}>
          <TouchableOpacity
            style={[styles.panchangContainer, { backgroundColor: 'rgba(0, 0, 0, 0.22)', borderColor: theme.borderGold }]}
            onPress={() => router.push('/calendar' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.panchangHeaderRow}>
              <Text style={[styles.panchangLine1, { color: theme.textGold }]}>
                {panchang.line1}
              </Text>
              <Text style={[styles.panchangChevron, { color: theme.textGold }]}>पंचांग कैलेंडर ➔</Text>
            </View>
            <Text style={[styles.panchangLine2, { color: theme.textWhite }]}>
              {panchang.line2}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.greetingTitle, { color: theme.textGold }]}>प्रणाम, {formattedName} 🙏</Text>
          <Text style={[styles.greetingSub, { color: theme.textWhite }]}>{panchang.specialNote}</Text>
        </View>

        {/* 1-TAP QUICK SADHNA RIBBON FOR ELDERLY & DAILY USERS */}
        <View style={styles.quickRibbonContainer}>
          <TouchableOpacity
            style={[styles.quickRibbonCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => router.push('/jap' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(230, 81, 0, 0.12)' }]}>
              <Text style={styles.quickIcon}>📿</Text>
            </View>
            <Text style={[styles.quickLabel, { color: theme.textPrimary }]}>108 जाप</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickRibbonCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => router.push('/puja' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(255, 179, 0, 0.12)' }]}>
              <Text style={styles.quickIcon}>🌸</Text>
            </View>
            <Text style={[styles.quickLabel, { color: theme.textPrimary }]}>शिव पूजा</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickRibbonCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => router.push('/charcha' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(183, 28, 28, 0.12)' }]}>
              <Text style={styles.quickIcon}>🗣️</Text>
            </View>
            <Text style={[styles.quickLabel, { color: theme.textPrimary }]}>शिव चर्चा</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickRibbonCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => router.push('/audio-hub' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(230, 81, 0, 0.12)' }]}>
              <Text style={styles.quickIcon}>🎙️</Text>
            </View>
            <Text style={[styles.quickLabel, { color: theme.textPrimary }]}>अमृत वाणी</Text>
          </TouchableOpacity>
        </View>

        {/* 7-DAY SADHNA LOTUS STREAK BAR */}
        <TouchableOpacity
          style={[styles.streakCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
          onPress={() => router.push('/charcha' as any)}
          activeOpacity={0.9}
        >
          <View style={styles.streakHeaderRow}>
            <View style={styles.streakLeftTitleGroup}>
              <Text style={[styles.streakTitle, { color: theme.primary }]}>🪷 मेरी 7-दिवसीय शिव साधना</Text>
              <Text style={[styles.streakSubtitle, { color: theme.textMuted }]}>
                {sutraStreak > 0 ? `🔥 ${sutraStreak} दिन से निरंतर साधना जारी` : 'प्रतिदिन 3 सूत्र पूरे करें व कमल खिलाएँ'}
              </Text>
            </View>
            <Text style={[styles.streakArrow, { color: theme.secondary }]}>3 सूत्र ➔</Text>
          </View>

          <View style={styles.lotusStreakRow}>
            {past7Days.map((item, idx) => (
              <View key={idx} style={styles.lotusItem}>
                <Text style={styles.lotusEmoji}>{item.completed ? '🪷' : '🌸'}</Text>
                <Text style={[styles.lotusDayText, { color: item.completed ? theme.primary : theme.textMuted }]}>
                  {item.dayName}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {/* PROMINENT SHIV SANSAR SPOTLIGHT CARD */}
        <TouchableOpacity
          style={[styles.sansarSpotlightCard, { backgroundColor: theme.cardBgMaroon, borderColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/sansar' as any)}
          activeOpacity={0.9}
        >
          <View style={styles.sansarHeaderRow}>
            <Text style={[styles.sansarBadge, { backgroundColor: theme.accent, color: theme.primaryDark }]}>
              विशेष प्रस्तुति
            </Text>
            <Text style={[styles.sansarArrow, { color: theme.textGold }]}>प्रवेश करें ➔</Text>
          </View>

          <Text style={[styles.sansarTitle, { color: theme.textGold }]}>🔱 शिव संसार - महादेव ज्ञानकोश</Text>
          <Text style={[styles.sansarSub, { color: theme.textWhite }]}>
            शिव कथाएँ • 12 ज्योतिर्लिंग • शक्ति पीठ • शिव परिवार • शिव प्रतीक व डिजिटल यात्रा
          </Text>

          <View style={styles.sansarTagsRow}>
            <Text style={[styles.tagPill, { backgroundColor: 'rgba(255,255,255,0.15)', color: theme.textWhite }]}>📖 कथाएँ</Text>
            <Text style={[styles.tagPill, { backgroundColor: 'rgba(255,255,255,0.15)', color: theme.textWhite }]}>🛕 ज्योतिर्लिंग</Text>
            <Text style={[styles.tagPill, { backgroundColor: 'rgba(255,255,255,0.15)', color: theme.textWhite }]}>🌺 शक्ति पीठ</Text>
            <Text style={[styles.tagPill, { backgroundColor: 'rgba(255,255,255,0.15)', color: theme.textWhite }]}>📍 यात्रा</Text>
          </View>
        </TouchableOpacity>

        {/* SECTION: TODAY'S SHIV GURU MESSAGE (WITH PROMINENT WHATSAPP SHARE) */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary, borderColor: theme.borderGold }]}>
              आज का संदेश
            </Text>
            <Text style={[styles.dateText, { color: theme.textMuted }]}>{todayMsg.date}</Text>
          </View>

          <Image source={{ uri: todayMsg.imageUrl }} style={styles.msgImage} />

          <Text style={[styles.msgTitle, { color: theme.textPrimary }]}>{todayMsg.title}</Text>
          <FormattedText text={todayMsg.shortMessage} style={[styles.msgShort, { color: theme.textSecondary }]} />

          <View style={styles.msgActionsRow}>
            <TouchableOpacity
              style={[styles.listenBtn, { backgroundColor: theme.primary }]}
              onPress={() =>
                playTrack({
                  id: todayMsg.id,
                  title: todayMsg.title,
                  subtitle: todayMsg.category,
                  category: 'teachings',
                  duration: todayMsg.audioDuration,
                  audioUrl: todayMsg.audioUrl,
                  coverImage: todayMsg.imageUrl,
                  artist: todayMsg.author,
                })
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.listenBtnText, { color: theme.textWhite }]}>🎧 सुनें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtnOutline, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
              onPress={() => router.push('/teaching/t-three-sutras' as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionBtnOutlineText, { color: theme.primary }]}>📖 पढ़ें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.whatsappBtn, { backgroundColor: '#25D366' }]}
              onPress={handleShareMessage}
              activeOpacity={0.85}
            >
              <Text style={styles.whatsappBtnText}>🟢 WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: TODAY'S SHIV CHARCHA DISCUSSION TOPIC (DAILY SUTRA 2 PROMPT) */}
        <View style={[styles.charchaPromptCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
          <View style={styles.promptHeaderRow}>
            <Text style={[styles.promptBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
              💬 आज का चर्चा बिंदु
            </Text>
            <Text style={[styles.promptSubTag, { color: theme.secondary }]}>द्वितीय सूत्र (चर्चा करना)</Text>
          </View>

          <Text style={[styles.promptTitle, { color: theme.primary }]}>🗣️ {todayPrompt.title}</Text>
          <Text style={[styles.promptTopicText, { color: theme.textPrimary }]}>{todayPrompt.topicHindi}</Text>

          <View style={[styles.quoteBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.quoteText, { color: theme.textSecondary }]}>"{todayPrompt.sahibJiQuote}"</Text>
          </View>

          <View style={styles.promptActionRow}>
            <TouchableOpacity
              style={[styles.promptParticipateBtn, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/charcha' as any)}
              activeOpacity={0.85}
            >
              <Text style={[styles.promptParticipateText, { color: theme.textWhite }]}>🗣️ चर्चा कार्ड देखें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.promptShareOutlineBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
              onPress={handleSharePrompt}
              activeOpacity={0.85}
            >
              <Text style={[styles.promptShareOutlineText, { color: theme.primary }]}>📤 चर्चा साझा करें</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: SAHAB SHRI AMRIT VANI AUDIO SPOTLIGHT */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>🎙️ अमृत वाणी (पावन प्रवचन)</Text>
            <TouchableOpacity onPress={() => router.push('/audio-hub' as any)} activeOpacity={0.7}>
              <Text style={[{ fontSize: 12, fontWeight: 'bold', color: theme.secondary }]}>सभी सुनें ➔</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bhajanCardRow}>
            <Image source={{ uri: featuredPravachan.coverImage }} style={styles.bhajanImage} />
            <View style={styles.bhajanInfo}>
              <Text style={[styles.bhajanTitle, { color: theme.textPrimary }]}>{featuredPravachan.title}</Text>
              <Text style={[styles.bhajanArtist, { color: theme.textMuted }]}>{featuredPravachan.artist}</Text>
              <Text style={[styles.bhajanDuration, { color: theme.secondary }]}>
                ⏱️ {Math.floor(featuredPravachan.duration / 60)} मि • अमृत वाणी
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.bhajanPlayBtn, { backgroundColor: theme.primary }]}
              onPress={() => playTrack(featuredPravachan)}
              activeOpacity={0.8}
            >
              <Text style={[styles.bhajanPlayIcon, { color: theme.textWhite }]}>▶️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: BHAKTI EXPERIENCE GRID */}
        <View style={styles.experienceSection}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>आज का भक्ति अनुभव 🌺</Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>शिव गुरु के श्री चरणों में सेवा व साधना अर्पित करें</Text>

          <View style={styles.experienceGrid}>
            <TouchableOpacity
              style={[styles.experienceCard, { backgroundColor: theme.primary, borderColor: theme.accent }]}
              onPress={() => router.push('/puja' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.expIcon}>🌸</Text>
              <Text style={[styles.expTitle, { color: theme.textGold }]}>शिव लिंग पूजा</Text>
              <Text style={[styles.expSub, { color: theme.textWhite }]}>पुष्प, बेलपत्र व जल चढ़ाएँ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.experienceCard, { backgroundColor: theme.primaryLight, borderColor: theme.accent }]}
              onPress={() => router.push('/jap' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.expIcon}>📿</Text>
              <Text style={[styles.expTitle, { color: theme.textGold }]}>108 जाप साधना</Text>
              <Text style={[styles.expSub, { color: theme.textWhite }]}>नमः शिवाय माला जाप</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: TODAY'S BHAJAN */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>आज का भजन 🎵</Text>
          <View style={styles.bhajanCardRow}>
            <Image source={{ uri: todayBhajan.coverImage }} style={styles.bhajanImage} />
            <View style={styles.bhajanInfo}>
              <Text style={[styles.bhajanTitle, { color: theme.textPrimary }]}>{todayBhajan.title}</Text>
              <Text style={[styles.bhajanArtist, { color: theme.textMuted }]}>{todayBhajan.artist}</Text>
              <Text style={[styles.bhajanDuration, { color: theme.secondary }]}>⏱️ {Math.floor(todayBhajan.duration / 60)} मि</Text>
            </View>
            <TouchableOpacity
              style={[styles.bhajanPlayBtn, { backgroundColor: theme.primary }]}
              onPress={() => playTrack(todayBhajan)}
              activeOpacity={0.8}
            >
              <Text style={[styles.bhajanPlayIcon, { color: theme.textWhite }]}>▶️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: SPECIAL REMEMBRANCE DAY */}
        <TouchableOpacity
          style={[styles.dateReminderCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
          onPress={() => router.push(`/date/${specialDate.id}` as any)}
          activeOpacity={0.9}
        >
          <View style={styles.dateLeftColumn}>
            <Text style={[styles.dateLabel, { color: theme.secondary }]}>पावन स्मरण दिवस</Text>
            <Text style={[styles.dateTitle, { color: theme.primary }]}>{specialDate.title}</Text>
            <Text style={[styles.dateSub, { color: theme.textSecondary }]}>{specialDate.subtitle}</Text>
          </View>
          <View style={[styles.dateRightArrow, { backgroundColor: theme.primary }]}>
            <Text style={[styles.arrowIcon, { color: theme.textWhite }]}>➔</Text>
          </View>
        </TouchableOpacity>

        {/* SECTION: REELS & SHARE TEASER */}
        <View style={[styles.shareTeaserCard, { backgroundColor: theme.primary, borderColor: theme.accent }]}>
          <Text style={[styles.shareTeaserTitle, { color: theme.textGold }]}>शिव चर्चा विचार रील्स व शेयर 🎬</Text>
          <Text style={[styles.shareTeaserSub, { color: theme.textWhite }]}>
            100+ पावन भक्ति विचारों को फुल-स्क्रीन रील मोड में देखें, वॉलपेपर बदलें व साझा करें।
          </Text>
          <View style={styles.teaserBtnRow}>
            <TouchableOpacity
              style={[styles.shareTeaserBtn, { backgroundColor: theme.accent }]}
              onPress={() => router.push('/reels' as any)}
              activeOpacity={0.8}
            >
              <Text style={[styles.shareTeaserBtnText, { color: theme.primaryDark }]}>🎬 100 रील्स स्क्रॉल</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareTeaserOutlineBtn, { borderColor: theme.accent }]}
              onPress={() => router.push('/share' as any)}
              activeOpacity={0.8}
            >
              <Text style={[styles.shareTeaserOutlineBtnText, { color: theme.textGold }]}>🎨 शेयर कार्ड</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* GENTLE ONBOARDING MODAL ON COLD START */}
      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerActionIcon: {
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  greetingBanner: {
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  greetingSub: {
    fontSize: 11,
    opacity: 0.9,
    marginTop: 4,
  },

  /* 1-TAP QUICK SADHNA RIBBON STYLES */
  quickRibbonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickRibbonCard: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.2,
    ...shadows.soft,
  },
  quickIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickIcon: {
    fontSize: 20,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* 7-DAY STREAK CARD STYLES */
  streakCard: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  streakHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakLeftTitleGroup: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  streakSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  streakArrow: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  lotusStreakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  lotusItem: {
    alignItems: 'center',
  },
  lotusEmoji: {
    fontSize: 20,
  },
  lotusDayText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },

  /* SHIV SANSAR SPOTLIGHT STYLES */
  sansarSpotlightCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  sansarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sansarBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sansarArrow: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sansarTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sansarSub: {
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.9,
    marginBottom: 12,
  },
  sansarTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    ...shadows.soft,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 12,
  },
  msgImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 14,
  },
  msgTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  msgShort: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  msgActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listenBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
    marginRight: 4,
    alignItems: 'center',
  },
  listenBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  actionBtnOutline: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  whatsappBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1.1,
    marginLeft: 4,
    alignItems: 'center',
  },
  whatsappBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* DAILY CHARCHA PROMPT CARD STYLES */
  charchaPromptCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  promptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  promptSubTag: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 6,
  },
  promptTopicText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  quoteBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  promptActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promptParticipateBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  promptParticipateText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  promptShareOutlineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  promptShareOutlineText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  experienceSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 12,
    marginBottom: 12,
  },
  experienceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  experienceCard: {
    borderRadius: 18,
    padding: 16,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1.5,
    ...shadows.gold,
  },
  expIcon: {
    fontSize: 34,
    marginBottom: 6,
  },
  expTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  expSub: {
    fontSize: 10,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 2,
  },
  bhajanCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  bhajanImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  bhajanInfo: {
    flex: 1,
  },
  bhajanTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  bhajanArtist: {
    fontSize: 12,
    marginTop: 2,
  },
  bhajanDuration: {
    fontSize: 11,
    marginTop: 4,
  },
  bhajanPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bhajanPlayIcon: {
    fontSize: 18,
  },
  dateReminderCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
  },
  dateLeftColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  dateSub: {
    fontSize: 12,
    marginTop: 2,
  },
  dateRightArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  arrowIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareTeaserCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  shareTeaserTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareTeaserSub: {
    fontSize: 13,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  teaserBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  shareTeaserBtn: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  shareTeaserBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  shareTeaserOutlineBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  shareTeaserOutlineBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  panchangContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  panchangHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  panchangLine1: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  panchangChevron: {
    fontSize: 11,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  panchangLine2: {
    fontSize: 11,
    lineHeight: 15,
    opacity: 0.9,
  },
});
