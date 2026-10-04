import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
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

import { useVideoPlayer, VideoView } from 'expo-video';
import { StorageService, getFormattedUserName } from '@/services/storage';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { getTodayPanchang } from '@/services/panchangService';
import { FormattedText } from '@/components/common/FormattedText';
import { resolveImageSource } from '@/constants/imageAssets';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useDeferredTabMount } from '@/hooks/useDeferredTabMount';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReelsService } from '@/services/reelsService';
import { ShivReel, getReelThumbnailUrl } from '@/content/reelsCatalog';

function FloatingMiniReelPlayer({
  reel,
  onPress,
  onClose,
}: {
  reel: ShivReel;
  onPress: () => void;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(reel.videoUrl || '', (p: any) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const dynamicBottomOffset = Math.max(insets.bottom + 75, Platform.OS === 'android' ? 105 : 100);

  return (
    <View style={[styles.floatingMiniContainer, { bottom: dynamicBottomOffset, borderColor: theme.accent }]}>
      <TouchableOpacity activeOpacity={0.9} style={styles.floatingMiniTouchArea} onPress={onPress}>
        {reel.videoUrl ? (
          <VideoView style={styles.floatingMiniVideo} player={player} nativeControls={false} contentFit="cover" />
        ) : (
          <View style={styles.floatingMiniFallback}>
            <Text style={{ color: '#FFF', fontSize: 10 }}>🎬 शिव रील</Text>
          </View>
        )}
        <View style={[styles.floatingMiniBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.floatingMiniBadgeText} numberOfLines={1}>
            🎬 रील्स खोलें ➔
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClose}
        style={styles.floatingMiniCloseBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.floatingMiniCloseText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isReady = useDeferredTabMount(20);
  const { playTrack } = useAudio();
  const panchang = getTodayPanchang();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [formattedName, setFormattedName] = useState<string>('शिव शिष्य');
  const [sutraStreak, setSutraStreak] = useState<number>(0);
  const [past7Days, setPast7Days] = useState<{ date: string; dayName: string; completed: boolean }[]>([]);
  const [dailySutras, setDailySutras] = useState({ sutra1: false, sutra2: false, sutra3: false });
  const [reelsCatalog, setReelsCatalog] = useState<ShivReel[]>([]);
  const [randomReel, setRandomReel] = useState<ShivReel | null>(null);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const pickRandomReel = (reels: ShivReel[]) => {
      if (reels && reels.length > 0) {
        const randomIndex = Math.floor(Math.random() * reels.length);
        setRandomReel(reels[randomIndex]);
      }
    };

    (async () => {
      const cached = await ReelsService.getCachedReels();
      if (isMounted && cached && cached.length > 0) {
        setReelsCatalog(cached);
        pickRandomReel(cached);
      }
      try {
        const synced = await ReelsService.syncRemoteReels();
        if (isMounted && synced && synced.length > 0) {
          setReelsCatalog(synced);
          pickRandomReel(synced);
        }
      } catch {
        // Silently keep cached
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const todayMsg = dailyMessages[0];
  const todayBhajan = audioLibrary[0];
  const specialDate = sacredDates[0];
  const todayPrompt = getTodayCharchaPrompt();
  const featuredPravachan = pravachanLibrary[0];

  const loadUserData = async () => {
    const prefs = await StorageService.getPreferences();
    if (!prefs.hasCompletedOnboarding) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 3200);
    }
    setFormattedName(getFormattedUserName(prefs));

    const sutrasData = await StorageService.getDaily3Sutras();
    setDailySutras({ sutra1: sutrasData.sutra1, sutra2: sutrasData.sutra2, sutra3: sutrasData.sutra3 });

    const streakData = await StorageService.getSutraStreak();
    setSutraStreak(streakData.streak);
    setPast7Days(streakData.past7Days);
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const toggleSutra = async (key: 'sutra1' | 'sutra2' | 'sutra3') => {
    const updatedValue = !dailySutras[key];
    const newSutras = { ...dailySutras, [key]: updatedValue };
    setDailySutras(newSutras);
    await StorageService.saveDaily3Sutras({ [key]: updatedValue });

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

  if (!isReady) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header showBack={false} />
        <LoadingScreen message="शिव गुरु साधना कक्ष खुल रहा है..." fullScreen={false} />
      </View>
    );
  }

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

        {/* 1-TAP QUICK SADHNA RIBBON FOR DAILY USERS & ELDERLY */}
        <View style={styles.quickRibbonContainer}>
          <TouchableOpacity
            style={[styles.quickRibbonCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => router.push('/jap' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(230, 81, 0, 0.12)' }]}>
              <Text style={styles.quickIcon}>📿</Text>
            </View>
            <Text style={[styles.quickLabel, { color: theme.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              108 जाप
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickRibbonCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => router.push('/puja' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(255, 179, 0, 0.12)' }]}>
              <Text style={styles.quickIcon}>🌸</Text>
            </View>
            <Text style={[styles.quickLabel, { color: theme.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              शिव पूजा
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickRibbonCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => router.push('/charcha' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(183, 28, 28, 0.12)' }]}>
              <Text style={styles.quickIcon}>🗣️</Text>
            </View>
            <Text style={[styles.quickLabel, { color: theme.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              3 सूत्र
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickRibbonCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
            onPress={() => router.push('/audio-hub' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(230, 81, 0, 0.12)' }]}>
              <Text style={styles.quickIcon}>🎙️</Text>
            </View>
            <Text style={[styles.quickLabel, { color: theme.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              अमृत वाणी
            </Text>
          </TouchableOpacity>
        </View>

        {/* LEVEL 1: INTERACTIVE 3-SUTRA DAILY PRACTICE CARD */}
        <View style={[styles.streakCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
          <View style={styles.streakHeaderRow}>
            <View style={styles.streakLeftTitleGroup}>
              <Text style={[styles.streakTitle, { color: theme.primary }]}>🪷 आज की 3-सूत्र शिव साधना</Text>
              <Text style={[styles.streakSubtitle, { color: theme.textMuted }]}>
                {sutraStreak > 0 ? `🔥 ${sutraStreak} दिन से निरंतर साधना जारी` : 'साहब श्री हरिंद्रानंद जी के 3 सूत्र अंकित करें'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/charcha' as any)} activeOpacity={0.8}>
              <Text style={[styles.streakArrow, { color: theme.secondary }]}>विवरण ➔</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Checkable 3 Sutra Pills */}
          <View style={styles.sutraPillsRow}>
            <TouchableOpacity
              style={[
                styles.sutraPillItem,
                {
                  backgroundColor: dailySutras.sutra1 ? 'rgba(230, 81, 0, 0.15)' : theme.cardBg,
                  borderColor: dailySutras.sutra1 ? theme.accent : theme.border,
                },
              ]}
              onPress={() => toggleSutra('sutra1')}
              activeOpacity={0.8}
            >
              <Text style={[styles.sutraPillCheck, { color: dailySutras.sutra1 ? theme.primary : theme.textMuted }]}>
                {dailySutras.sutra1 ? '✓' : '○'}
              </Text>
              <Text style={[styles.sutraPillText, { color: theme.textPrimary }]}>1. दया माँगी</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sutraPillItem,
                {
                  backgroundColor: dailySutras.sutra2 ? 'rgba(230, 81, 0, 0.15)' : theme.cardBg,
                  borderColor: dailySutras.sutra2 ? theme.accent : theme.border,
                },
              ]}
              onPress={() => toggleSutra('sutra2')}
              activeOpacity={0.8}
            >
              <Text style={[styles.sutraPillCheck, { color: dailySutras.sutra2 ? theme.primary : theme.textMuted }]}>
                {dailySutras.sutra2 ? '✓' : '○'}
              </Text>
              <Text style={[styles.sutraPillText, { color: theme.textPrimary }]}>2. चर्चा की</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sutraPillItem,
                {
                  backgroundColor: dailySutras.sutra3 ? 'rgba(230, 81, 0, 0.15)' : theme.cardBg,
                  borderColor: dailySutras.sutra3 ? theme.accent : theme.border,
                },
              ]}
              onPress={() => toggleSutra('sutra3')}
              activeOpacity={0.8}
            >
              <Text style={[styles.sutraPillCheck, { color: dailySutras.sutra3 ? theme.primary : theme.textMuted }]}>
                {dailySutras.sutra3 ? '✓' : '○'}
              </Text>
              <Text style={[styles.sutraPillText, { color: theme.textPrimary }]}>3. 108 जाप</Text>
            </TouchableOpacity>
          </View>

          {/* 7-Day Lotus Bar */}
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
        </View>

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

        {/* SEPARATE SECTION CARD 1: 🌸 100+ SUVICHAR REELS (BANNER CARD) */}
        <TouchableOpacity
          style={[styles.quoteReelsStandaloneCard, { backgroundColor: theme.cardBgMaroon, borderColor: theme.borderGold }]}
          onPress={() => router.push('/quote-reels' as any)}
          activeOpacity={0.9}
        >
          <View style={styles.reelsShowcaseHeaderRow}>
            <View>
              <Text style={[styles.reelsShowcaseBadge, { backgroundColor: '#FFD700', color: '#3A0007' }]}>
                🌸 100+ फुल-स्क्रीन रील्स
              </Text>
              <Text style={[styles.reelsShowcaseTitle, { color: theme.textGold }]}>
                🌸 100+ पावन शिव सुविचार रील्स
              </Text>
            </View>
            <View style={[styles.launchQuoteReelsBtn, { backgroundColor: theme.accent }]}>
              <Text style={[styles.launchQuoteReelsBtnText, { color: theme.primaryDark }]}>प्ले करें ➔</Text>
            </View>
          </View>

          <Text style={[styles.reelsShowcaseSub, { color: theme.textWhite }]}>
            शिव गुरु भक्ति, 3 सूत्र व अध्यात्म के 100+ पावन विचार सुंदर HD वॉलपेपर, संगीत, चित्र डाउनलोड व व्हाट्सएप शेयर के साथ स्वाइप रील्स में देखें
          </Text>

          <View style={styles.quoteReelsTagsRow}>
            <Text style={styles.quoteReelTag}>🖼️ 20+ HD वॉलपेपर</Text>
            <Text style={styles.quoteReelTag}>📥 चित्र डाउनलोड</Text>
            <Text style={styles.quoteReelTag}>🟢 व्हाट्सएप शेयर</Text>
          </View>
        </TouchableOpacity>

        {/* SEPARATE SECTION CARD 2: 🎬 SHIV VIDEO REELS SHOWCASE */}
        <View style={[styles.reelsShowcaseCard, { backgroundColor: theme.cardBgMaroon, borderColor: theme.borderGold }]}>
          <View style={styles.reelsShowcaseHeaderRow}>
            <View>
              <Text style={[styles.reelsShowcaseBadge, { backgroundColor: theme.accent, color: theme.primaryDark }]}>
                🎬 15s वीडियो रील्स
              </Text>
              <Text style={[styles.reelsShowcaseTitle, { color: theme.textGold }]}>🎬 शिव वीडियो रील्स</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/reels' as any)} activeOpacity={0.8}>
              <Text style={[styles.reelsShowcaseAllBtn, { color: theme.textGold }]}>सभी वीडियो ➔</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.reelsShowcaseSub, { color: theme.textWhite }]}>
            साहब श्री हरिंद्रानंद जी के 3 सूत्र, गोष्ठी व शिव विचार वीडियो रील्स में देखें
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reelsScrollRow}>
            {reelsCatalog.map((reel) => {
              const thumbUrl = getReelThumbnailUrl(reel);
              return (
                <TouchableOpacity
                  key={reel.id}
                  style={[styles.reelThumbCard, { borderColor: theme.borderGold }]}
                  onPress={() => router.push({ pathname: '/reels', params: { startReelId: reel.id } } as any)}
                  activeOpacity={0.85}
                >
                  {thumbUrl ? (
                    <Image source={{ uri: thumbUrl }} style={styles.reelThumbImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.reelThumbBg} />
                  )}
                  <View style={styles.reelThumbPlayOverlay}>
                    <View style={styles.playIconCircle}>
                      <Text style={styles.reelPlayIcon}>▶️</Text>
                    </View>
                  </View>
                  <View style={styles.reelThumbOverlay}>
                    <Text style={styles.reelThumbTitle} numberOfLines={2}>
                      {reel.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SECTION: TODAY'S SHIV GURU MESSAGE (WITH PROMINENT WHATSAPP SHARE) */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary, borderColor: theme.borderGold }]}>
              आज का संदेश
            </Text>
            <Text style={[styles.dateText, { color: theme.textMuted }]}>{todayMsg.date}</Text>
          </View>

          <Image source={resolveImageSource(todayMsg.id || todayMsg.imageUrl, 'hero')} style={styles.msgImage} />

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
            <Text style={[styles.quoteText, { color: theme.textSecondary }]}>{`"${todayPrompt.sahibJiQuote}"`}</Text>
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
            <Image source={resolveImageSource(featuredPravachan.id || featuredPravachan.coverImage, 'stotra')} style={styles.bhajanImage} />
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
        {/* SECTION: TODAY'S BHAJAN */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>आज का भजन 🎵</Text>
          <View style={styles.bhajanCardRow}>
            <Image source={resolveImageSource(todayBhajan.id || todayBhajan.coverImage, 'stotra')} style={styles.bhajanImage} />
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
      </ScrollView>

      {/* GENTLE ONBOARDING MODAL ON COLD START */}
      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* FLOATING MINI REEL PLAYER MODAL (BOTTOM-RIGHT CORNER ABOVE TAB BAR) */}
      {showMiniModal && randomReel && randomReel.videoUrl && (
        <FloatingMiniReelPlayer
          reel={randomReel}
          onPress={() => router.push('/reels' as any)}
          onClose={() => setShowMiniModal(false)}
        />
      )}
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
  sutraPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: 10,
  },
  sutraPillItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  sutraPillCheck: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  sutraPillText: {
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
    padding: 18,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  quoteCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quoteBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quoteBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  refreshQuoteText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  quoteTextDisplay: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  quoteAuthorDisplay: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 12,
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

  /* REELS SHOWCASE & FLOATING MINI PLAYER STYLES */
  quoteReelsStandaloneCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  launchQuoteReelsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  launchQuoteReelsBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reelsShowcaseCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  quoteThumbCard: {
    width: 140,
    height: 185,
    borderRadius: 14,
    borderWidth: 1.2,
    overflow: 'hidden',
    backgroundColor: '#1E0A10',
  },
  quoteThumbBgImage: {
    width: '100%',
    height: '100%',
    padding: 8,
    justifyContent: 'space-between',
  },
  quoteThumbDarkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  quoteThumbBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  quoteThumbBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#3A0007',
  },
  quoteThumbContent: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 4,
  },
  quoteThumbText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 15,
  },
  quoteThumbAuthor: {
    fontSize: 9,
    color: '#FFD700',
    marginTop: 3,
    fontWeight: '500',
  },
  quoteThumbPlayIconRow: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  quoteThumbPlayIcon: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  quoteReelsBannerCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  launchQuoteReelsPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  launchQuoteReelsText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  quoteReelsTagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  quoteReelTag: {
    fontSize: 10,
    color: '#FFE082',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reelsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    marginVertical: 12,
  },
  reelsShowcaseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reelsShowcaseBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  reelsShowcaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reelsShowcaseAllBtn: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reelsShowcaseSub: {
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 16,
  },
  reelsScrollRow: {
    gap: 10,
  },
  reelThumbCard: {
    width: 110,
    height: 160,
    borderRadius: 14,
    borderWidth: 1.2,
    backgroundColor: '#0B132B',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
  },
  reelThumbImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  reelThumbBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelThumbPlayOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
  },
  reelPlayIcon: {
    fontSize: 16,
  },
  reelThumbOverlay: {
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  reelThumbTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 13,
  },

  floatingMiniContainer: {
    position: 'absolute',
    right: 14,
    width: 110,
    height: 175,
    borderRadius: 18,
    borderWidth: 1.8,
    backgroundColor: '#000000',
    overflow: 'hidden',
    zIndex: 999,
    ...shadows.medium,
  },
  floatingMiniTouchArea: {
    width: '100%',
    height: '100%',
  },
  floatingMiniVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  floatingMiniFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0B132B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingMiniCloseBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  floatingMiniCloseText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  floatingMiniBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  floatingMiniBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
