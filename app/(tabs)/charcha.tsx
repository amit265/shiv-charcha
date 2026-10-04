import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';
import { teachingTopics } from '@/content/teachings';
import { booksLibrary } from '@/content/books';
import { audioLibrary } from '@/content/audioLibrary';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';
import { StorageService, getFirstSutraText, getDiscipleTitle, defaultPreferences } from '@/services/storage';
import { getTodayCharchaPrompt } from '@/content/charchaPrompts';
import { resolveImageSource } from '@/constants/imageAssets';
import { ContextualCrossPromotion } from '@/components/common/ContextualCrossPromotion';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useDeferredTabMount } from '@/hooks/useDeferredTabMount';
import { Analytics } from '@/services/analytics/analytics';
import { ReelsService } from '@/services/reelsService';
import { ShivReel, getReelThumbnailUrl } from '@/content/reelsCatalog';

type CategoryHub = 'all' | 'sutras' | 'understanding' | 'daily_life' | 'faq' | 'books' | 'audio' | 'sadhna';

const categoryInfoMap: Record<string, { title: string; icon: string; desc: string; badge: string }> = {
  sutras: {
    title: 'त्रिवेणी सूत्र एवं भावार्थ',
    icon: '🌸',
    desc: 'दया, चर्चा व 108 जाप की संपूर्ण व्याख्या एवं अभ्यास विधि',
    badge: '5 विषय • ऑडियो',
  },
  understanding: {
    title: 'साहब श्री व दीदी माँ के विचार',
    icon: '🔱',
    desc: 'शिव को गुरु क्यों और कैसे बनाएँ? अनमोल विचार व दर्शन',
    badge: '5 विषय • ऑडियो',
  },
  daily_life: {
    title: 'गृहस्थ जीवन व आचरण',
    icon: '🏡',
    desc: 'परिवार, कर्म, महिलाएँ व गृहस्थ जीवन में शिव शिष्यता',
    badge: '4 विषय • ऑडियो',
  },
  faq: {
    title: 'शंका समाधान (FAQ)',
    icon: '❓',
    desc: 'नए शिष्यों की आम शंकाएँ, भ्रम व उनके प्रमाणिक समाधान',
    badge: '4 प्रश्नोत्तर',
  },
};

export default function ShivCharchaScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isReady = useDeferredTabMount(20);
  const { playTrack } = useAudio();
  const [activeHub, setActiveHub] = useState<CategoryHub>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPrefs, setUserPrefs] = useState<any>(defaultPreferences);
  const [isTrackerCollapsed, setIsTrackerCollapsed] = useState(false);
  const [streakInfo, setStreakInfo] = useState<{ streak: number; past7Days: { date: string; dayName: string; completed: boolean }[] }>({
    streak: 0,
    past7Days: [],
  });

  const todayPrompt = getTodayCharchaPrompt();

  // Daily 3 Sutras State
  const [dailySutras, setDailySutras] = useState({
    sutra1: false,
    sutra2: false,
    sutra3: false,
  });

  const [reelsCatalog, setReelsCatalog] = useState<ShivReel[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const cached = await ReelsService.getCachedReels();
      if (isMounted && cached && cached.length > 0) {
        setReelsCatalog(cached);
      }
      try {
        const synced = await ReelsService.syncRemoteReels();
        if (isMounted && synced && synced.length > 0) {
          setReelsCatalog(synced);
        }
      } catch {
        // Silently keep cached
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const loadData = async () => {
    const data = await StorageService.getDaily3Sutras();
    const prefs = await StorageService.getPreferences();
    const streakData = await StorageService.getSutraStreak();
    setUserPrefs(prefs);
    setStreakInfo(streakData);
    setDailySutras({
      sutra1: data.sutra1,
      sutra2: data.sutra2,
      sutra3: data.sutra3,
    });
    if (data.sutra1 && data.sutra2 && data.sutra3) {
      setIsTrackerCollapsed(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      Analytics.logScreen('ShivCharchaTab');
      loadData();
    }, [])
  );

  const toggleSutra = async (key: 'sutra1' | 'sutra2' | 'sutra3') => {
    const updatedValue = !dailySutras[key];
    const newSutras = { ...dailySutras, [key]: updatedValue };
    setDailySutras(newSutras);
    await StorageService.saveDaily3Sutras({ [key]: updatedValue });

    const streakData = await StorageService.getSutraStreak();
    setStreakInfo(streakData);

    const count = (newSutras.sutra1 ? 1 : 0) + (newSutras.sutra2 ? 1 : 0) + (newSutras.sutra3 ? 1 : 0);
    if (count === 3) {
      setIsTrackerCollapsed(true);
    }
  };

  const completedCount = (dailySutras.sutra1 ? 1 : 0) + (dailySutras.sutra2 ? 1 : 0) + (dailySutras.sutra3 ? 1 : 0);
  const isAllCompleted = completedCount === 3;

  const handleShareCompletion = async () => {
    const sutra1Text = getFirstSutraText(userPrefs);
    const titleText = getDiscipleTitle(userPrefs);
    await safeShare({
      title: 'आज की शिव गुरु साधना पूर्ण हुई',
      message: `🌸 *आज की शिव गुरु साधना पूर्ण हुई* 🌸\n\n"${sutra1Text}"\n\nआज के तीनों सूत्र पूर्ण किए:\n1. दया माँगी 🙏\n2. शिव चर्चा की 🗣️\n3. 108 मणके जाप 📿\n\n- ${titleText}\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
    });
  };

  const handleSharePrompt = async () => {
    const titleText = getDiscipleTitle(userPrefs);
    await safeShare({
      title: `आज का शिव चर्चा विषय: ${todayPrompt.title}`,
      message: `🗣️ *आज का शिव चर्चा विषय*\n\n"${todayPrompt.title}"\n\n💡 *चर्चा का बिंदु/प्रश्न*:\n${todayPrompt.questionPrompt}\n\n🌸 *साहब श्री हरिंद्रानंद जी का कथन*:\n"${todayPrompt.sahibJiQuote}"\n\n- ${titleText}\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
    });
  };

  const handleShareTopic = async (title: string, summary: string) => {
    await safeShare({
      title,
      message: `📖 *शिव चर्चा ज्ञान*: "${title}"\n\n${summary}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
    });
  };

  // Filtered lists based on search and active hub
  const filteredTeachings = teachingTopics.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeHub === 'sutras') return t.category === 'sutras';
    if (activeHub === 'understanding') return t.category === 'understanding';
    if (activeHub === 'daily_life') return t.category === 'daily_life';
    if (activeHub === 'faq') return t.category === 'faq';
    if (activeHub === 'books' || activeHub === 'audio' || activeHub === 'sadhna') return false;
    return true;
  });

  const filteredBooks = booksLibrary.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.easySummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudio = audioLibrary.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.artist && a.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isDetailedListView = activeHub !== 'all' || searchQuery.trim().length > 0;

  if (!isReady) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="शिव चर्चा • 3 सूत्र व ज्ञान" subtitle="साहब श्री हरिंद्रानंद जी का पावन संदेश" />
        <LoadingScreen message="शिव चर्चा साहित्य लोड हो रहा है..." fullScreen={false} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="शिव चर्चा • 3 सूत्र व ज्ञान"
        subtitle="साहब श्री हरिंद्रानंद जी का पावन संदेश"
        rightAction={
          <TouchableOpacity
            style={[
              styles.headerActionBtn,
              { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: theme.borderGold },
            ]}
            onPress={() => router.push('/(tabs)/sansar' as any)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 18 }}>🛕</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* DAILY 3 SUTRA PRACTICE TRACKER */}
        <View style={[styles.trackerCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
          <TouchableOpacity
            style={[styles.trackerHeaderRow, { marginBottom: isTrackerCollapsed ? 0 : 12 }]}
            onPress={() => setIsTrackerCollapsed((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View style={styles.trackerTitleCol}>
              <Text style={[styles.trackerTitle, { color: theme.primary }]} adjustsFontSizeToFit minimumFontScale={0.85} numberOfLines={1}>
                आज की शिव गुरु साधना 📿
              </Text>
              <Text style={[styles.trackerSub, { color: theme.textSecondary }]} adjustsFontSizeToFit minimumFontScale={0.85} numberOfLines={1}>
                {isAllCompleted
                  ? isTrackerCollapsed
                    ? '🎉 साधना पूर्ण हुई • विवरण देखने हेतु टैप करें'
                    : '🎉 आज के तीनों सूत्र पूर्ण हुए!'
                  : isTrackerCollapsed
                    ? `${completedCount}/3 सूत्र संपन्न • विस्तार के लिए टैप करें`
                    : `${completedCount}/3 सूत्र संपन्न • आज की साधना अंकित करें`}
              </Text>
            </View>

            <View style={styles.headerRightCol}>
              <View
                style={[
                  styles.progressBadge,
                  { backgroundColor: isAllCompleted ? theme.success : theme.surfaceElevated, borderColor: theme.borderGold },
                ]}
              >
                <Text style={[styles.progressBadgeText, { color: isAllCompleted ? '#FFF' : theme.primary }]}>
                  {isAllCompleted ? '✓ पूर्ण' : `${completedCount}/3`}
                </Text>
              </View>
              <Text style={[styles.collapseChevron, { color: theme.textSecondary }]}>
                {isTrackerCollapsed ? '🔽' : '🔼'}
              </Text>
            </View>
          </TouchableOpacity>

          {isTrackerCollapsed && isAllCompleted && (
            <View style={[styles.compactCelebrationRow, { borderTopColor: theme.border }]}>
              <Text style={[styles.compactCelebrationText, { color: theme.primary }]}>
                आज की साधना पूर्ण हुई 🙏
              </Text>
              <View style={styles.compactBtnRow}>
                <TouchableOpacity
                  style={[styles.miniShareWhatsappBtn, { backgroundColor: '#25D366' }]}
                  onPress={handleShareCompletion}
                  activeOpacity={0.85}
                >
                  <Text style={styles.miniShareWhatsappText}>📲 व्हाट्सएप शेयर</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.miniCreateCardBtn, { backgroundColor: theme.primary }]}
                  onPress={() => router.push('/share' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.miniCreateCardText, { color: theme.textWhite }]}>🎨 सुविचार</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!isTrackerCollapsed && (
            <>
              <View style={styles.sutrasList}>
                <TouchableOpacity
                  style={[
                    styles.sutraCheckRow,
                    {
                      backgroundColor: dailySutras.sutra1 ? theme.surfaceElevated : theme.background,
                      borderColor: dailySutras.sutra1 ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => toggleSutra('sutra1')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, dailySutras.sutra1 && { backgroundColor: theme.accent, borderColor: theme.accent }]}>
                    {dailySutras.sutra1 && <Text style={[styles.checkMark, { color: theme.primaryDark }]}>✓</Text>}
                  </View>
                  <View style={styles.sutraTextCol}>
                    <Text style={[styles.sutraLabel, { color: theme.textPrimary }]}>
                      🌸 प्रथम सूत्र: दया माँगी
                    </Text>
                    <Text style={[styles.sutraDesc, { color: theme.textSecondary }]}>
                      {`"${getFirstSutraText(userPrefs)}"`}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sutraCheckRow,
                    {
                      backgroundColor: dailySutras.sutra2 ? theme.surfaceElevated : theme.background,
                      borderColor: dailySutras.sutra2 ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => toggleSutra('sutra2')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, dailySutras.sutra2 && { backgroundColor: theme.accent, borderColor: theme.accent }]}>
                    {dailySutras.sutra2 && <Text style={[styles.checkMark, { color: theme.primaryDark }]}>✓</Text>}
                  </View>
                  <View style={styles.sutraTextCol}>
                    <Text style={[styles.sutraLabel, { color: theme.textPrimary }]}>
                      🗣️ द्वितीय सूत्र: चर्चा की
                    </Text>
                    <Text style={[styles.sutraDesc, { color: theme.textSecondary }]}>
                      अन्य लोगों से शिव गुरु की महिमा व दया का अनुभव साझा किया
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sutraCheckRow,
                    {
                      backgroundColor: dailySutras.sutra3 ? theme.surfaceElevated : theme.background,
                      borderColor: dailySutras.sutra3 ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => toggleSutra('sutra3')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, dailySutras.sutra3 && { backgroundColor: theme.accent, borderColor: theme.accent }]}>
                    {dailySutras.sutra3 && <Text style={[styles.checkMark, { color: theme.primaryDark }]}>✓</Text>}
                  </View>
                  <View style={styles.sutraTextCol}>
                    <Text style={[styles.sutraLabel, { color: theme.textPrimary }]}>
                      📿 तृतीय सूत्र: 108 नमः शिवाय जाप
                    </Text>
                    <Text style={[styles.sutraDesc, { color: theme.textSecondary }]}>
                      108 मणके माला जाप पूर्ण किया
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.miniJapBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push('/jap' as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.miniJapBtnText, { color: theme.textWhite }]}>जाप करें</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>

              {isAllCompleted && (
                <View style={[styles.celebrationCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.accent }]}>
                  <Text style={[styles.celebrationTitle, { color: theme.primary }]}>
                    🎉 हर हर महादेव! आज की साधना पूर्ण हुई 🙏
                  </Text>
                  <Text style={[styles.celebrationSub, { color: theme.textSecondary }]}>
                    आज आपने शिव गुरु के चरणों में दया माँगी, चर्चा की और 108 मणके अर्पित किए।
                  </Text>
                  <View style={styles.celebrationBtnRow}>
                    <TouchableOpacity
                      style={[styles.shareWhatsappBtn, { backgroundColor: '#25D366' }]}
                      onPress={handleShareCompletion}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.shareWhatsappText}>📲 व्हाट्सएप पर शेयर करें</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.createCardBtn, { backgroundColor: theme.primary }]}
                      onPress={() => router.push('/share' as any)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.createCardText, { color: theme.textWhite }]}>🎨 सुविचार कार्ड</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}

          {streakInfo.past7Days.length > 0 && (
            <View style={[styles.streakRow, { borderTopColor: theme.border }]}>
              <View style={styles.streakHeaderRow}>
                <Text style={[styles.streakTitle, { color: theme.primary }]}>
                  🔥 {streakInfo.streak > 0 ? `${streakInfo.streak} दिन निरंतर साधना स्ट्रैक` : '7-दिवसीय साधना ट्रैक'}
                </Text>
                <Text style={[styles.streakHint, { color: theme.textMuted }]}>
                  {streakInfo.streak > 0 ? 'नियमितता बनी रहे 🙏' : 'प्रतिदिन 3 सूत्र पूर्ण करें'}
                </Text>
              </View>
              <View style={styles.past7DaysRow}>
                {streakInfo.past7Days.map((item, idx) => {
                  const isToday = idx === streakInfo.past7Days.length - 1;
                  return (
                    <View
                      key={item.date}
                      style={[
                        styles.dayDotCol,
                        { backgroundColor: item.completed ? 'rgba(230, 81, 0, 0.12)' : theme.surfaceElevated, borderColor: item.completed ? theme.accent : theme.border },
                        isToday && !item.completed && { borderColor: theme.primary },
                      ]}
                    >
                      <Text style={[styles.dayDotIcon, { color: item.completed ? theme.accent : theme.textMuted }]}>
                        {item.completed ? '🌸' : '○'}
                      </Text>
                      <Text style={[styles.dayDotName, { color: isToday ? theme.primary : theme.textSecondary, fontWeight: isToday ? 'bold' : 'normal' }]}>
                        {isToday ? 'आज' : item.dayName}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* TODAY'S CHARCHA PROMPT CARD */}
        <View style={[styles.promptCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
          <View style={styles.promptHeaderRow}>
            <View style={[styles.promptBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.accent }]}>
              <Text style={[styles.promptBadgeText, { color: theme.primary }]}>🗣️ द्वितीय सूत्र • आज का चर्चा विषय</Text>
            </View>
            <Text style={[styles.promptDate, { color: theme.textMuted }]}>
              {new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
            </Text>
          </View>

          <Text style={[styles.promptTitle, { color: theme.primary }]}>{todayPrompt.title}</Text>

          <View style={[styles.promptContentBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.promptQuestionLabel, { color: theme.secondary }]}>💡 चर्चा का मुख्य बिंदु / विचार:</Text>
            <Text style={[styles.promptQuestion, { color: theme.textPrimary }]}>{todayPrompt.questionPrompt}</Text>
          </View>

          <View style={[styles.quoteBox, { borderLeftColor: theme.accent, backgroundColor: theme.background }]}>
            <Text style={[styles.quoteText, { color: theme.textSecondary }]}>
              {`"${todayPrompt.sahibJiQuote}"`}
            </Text>
          </View>

          <View style={styles.promptActionsRow}>
            <TouchableOpacity
              style={[styles.sharePromptWhatsappBtn, { backgroundColor: '#25D366' }]}
              onPress={handleSharePrompt}
              activeOpacity={0.85}
            >
              <Text style={styles.sharePromptWhatsappText}>📲 व्हाट्सएप पर चर्चा साझा करें</Text>
            </TouchableOpacity>

            {!dailySutras.sutra2 && (
              <TouchableOpacity
                style={[styles.markSutra2Btn, { backgroundColor: theme.primary }]}
                onPress={() => toggleSutra('sutra2')}
                activeOpacity={0.85}
              >
                <Text style={[styles.markSutra2Text, { color: theme.textWhite }]}>✓ चर्चा की</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

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

        {/* SEARCH BAR */}
        <View style={styles.searchRow}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.surfaceElevated,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
            placeholder="🔍 शिव चर्चा, पुस्तकें या ऑडियो खोजें..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setSearchQuery('')}>
              <Text style={{ color: theme.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Dynamic Header when inside Category or Search */}
        {isDetailedListView && (
          <View style={styles.hubHeaderNav}>
            <TouchableOpacity
              style={[styles.backToHubBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
              onPress={() => {
                setActiveHub('all');
                setSearchQuery('');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.backToHubText, { color: theme.primary }]}>← शिव चर्चा मुख्य Hub पर लौटें</Text>
            </TouchableOpacity>

            <Text style={[styles.activeCategoryHeading, { color: theme.primary }]}>
              {searchQuery.trim().length > 0
                ? `🔍 खोज परिणाम (${filteredTeachings.length + filteredBooks.length + filteredAudio.length})`
                : `${categoryInfoMap[activeHub]?.icon || '📖'} ${categoryInfoMap[activeHub]?.title || 'विषय सूचि'}`}
            </Text>
          </View>
        )}

        {/* FILTER PILLS HORIZONTAL SCROLL */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsScroll}>
          <TouchableOpacity
            style={[styles.filterPill, activeHub === 'all' && !searchQuery && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => {
              setActiveHub('all');
              setSearchQuery('');
            }}
          >
            <Text style={[styles.filterPillText, { color: activeHub === 'all' && !searchQuery ? theme.textWhite : theme.textPrimary }]}>
              🔥 मुख्य Hub
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeHub === 'sutras' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveHub('sutras')}
          >
            <Text style={[styles.filterPillText, { color: activeHub === 'sutras' ? theme.textWhite : theme.textPrimary }]}>
              🌸 3 सूत्र (5)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeHub === 'understanding' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveHub('understanding')}
          >
            <Text style={[styles.filterPillText, { color: activeHub === 'understanding' ? theme.textWhite : theme.textPrimary }]}>
              🔱 साहब विचार (5)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeHub === 'daily_life' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveHub('daily_life')}
          >
            <Text style={[styles.filterPillText, { color: activeHub === 'daily_life' ? theme.textWhite : theme.textPrimary }]}>
              🏡 गृहस्थ आचरण (4)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeHub === 'faq' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveHub('faq')}
          >
            <Text style={[styles.filterPillText, { color: activeHub === 'faq' ? theme.textWhite : theme.textPrimary }]}>
              ❓ शंका समाधान (4)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeHub === 'books' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveHub('books')}
          >
            <Text style={[styles.filterPillText, { color: activeHub === 'books' ? theme.textWhite : theme.textPrimary }]}>
              📚 पुस्तकें
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeHub === 'audio' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveHub('audio')}
          >
            <Text style={[styles.filterPillText, { color: activeHub === 'audio' ? theme.textWhite : theme.textPrimary }]}>
              🎧 ऑडियो
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* MAIN HUB DASHBOARD (WHEN activeHub === 'all' AND NO SEARCH) */}
        {!isDetailedListView && (
          <>
            {/* CATEGORY CARDS 2x2 GRID */}
            <View style={styles.hubGridSection}>
              <Text style={[styles.hubGridTitle, { color: theme.primary }]}>📚 शिव ज्ञान एवं चर्चा विषय श्रेणियाँ</Text>
              <Text style={[styles.hubGridSub, { color: theme.textSecondary }]}>
                किसी भी श्रेणी पर टैप कर विस्तृत लेख, ऑडियो एवं मार्गदर्शन पढ़ें
              </Text>

              <View style={styles.grid2x2}>
                {/* CATEGORY CARD 1: SUTRAS */}
                <TouchableOpacity
                  style={[styles.gridCategoryCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
                  onPress={() => setActiveHub('sutras')}
                  activeOpacity={0.88}
                >
                  <View style={styles.gridCardTopRow}>
                    <Text style={styles.gridCardIcon}>🌸</Text>
                    <View style={[styles.gridBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                      <Text style={[styles.gridBadgeText, { color: theme.primary }]}>5 विषय • ऑडियो</Text>
                    </View>
                  </View>
                  <Text style={[styles.gridCardTitle, { color: theme.textPrimary }]}>त्रिवेणी सूत्र एवं भावार्थ</Text>
                  <Text style={[styles.gridCardSub, { color: theme.textSecondary }]} numberOfLines={2}>
                    दया, चर्चा व 108 जाप की संपूर्ण व्याख्या एवं विधि
                  </Text>
                  <Text style={[styles.gridCardArrow, { color: theme.secondary }]}>देखें ➔</Text>
                </TouchableOpacity>

                {/* CATEGORY CARD 2: UNDERSTANDING */}
                <TouchableOpacity
                  style={[styles.gridCategoryCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
                  onPress={() => setActiveHub('understanding')}
                  activeOpacity={0.88}
                >
                  <View style={styles.gridCardTopRow}>
                    <Text style={styles.gridCardIcon}>🔱</Text>
                    <View style={[styles.gridBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                      <Text style={[styles.gridBadgeText, { color: theme.primary }]}>5 विषय • ऑडियो</Text>
                    </View>
                  </View>
                  <Text style={[styles.gridCardTitle, { color: theme.textPrimary }]}>साहब श्री व दीदी माँ</Text>
                  <Text style={[styles.gridCardSub, { color: theme.textSecondary }]} numberOfLines={2}>
                    शिव को गुरु क्यों और कैसे बनाएँ? अनमोल विचार
                  </Text>
                  <Text style={[styles.gridCardArrow, { color: theme.secondary }]}>देखें ➔</Text>
                </TouchableOpacity>

                {/* CATEGORY CARD 3: DAILY LIFE */}
                <TouchableOpacity
                  style={[styles.gridCategoryCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
                  onPress={() => setActiveHub('daily_life')}
                  activeOpacity={0.88}
                >
                  <View style={styles.gridCardTopRow}>
                    <Text style={styles.gridCardIcon}>🏡</Text>
                    <View style={[styles.gridBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                      <Text style={[styles.gridBadgeText, { color: theme.primary }]}>4 विषय • ऑडियो</Text>
                    </View>
                  </View>
                  <Text style={[styles.gridCardTitle, { color: theme.textPrimary }]}>गृहस्थ जीवन व आचरण</Text>
                  <Text style={[styles.gridCardSub, { color: theme.textSecondary }]} numberOfLines={2}>
                    परिवार, कर्म, महिलाएँ व व्यावहारिक नियम
                  </Text>
                  <Text style={[styles.gridCardArrow, { color: theme.secondary }]}>देखें ➔</Text>
                </TouchableOpacity>

                {/* CATEGORY CARD 4: FAQ */}
                <TouchableOpacity
                  style={[styles.gridCategoryCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
                  onPress={() => setActiveHub('faq')}
                  activeOpacity={0.88}
                >
                  <View style={styles.gridCardTopRow}>
                    <Text style={styles.gridCardIcon}>❓</Text>
                    <View style={[styles.gridBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                      <Text style={[styles.gridBadgeText, { color: theme.primary }]}>4 प्रश्नोत्तर</Text>
                    </View>
                  </View>
                  <Text style={[styles.gridCardTitle, { color: theme.textPrimary }]}>शंका समाधान (FAQ)</Text>
                  <Text style={[styles.gridCardSub, { color: theme.textSecondary }]} numberOfLines={2}>
                    नए शिष्यों की आम शंकाएँ व प्रमाणिक समाधान
                  </Text>
                  <Text style={[styles.gridCardArrow, { color: theme.secondary }]}>देखें ➔</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SHIV CHARCHA GOSTHI BANNER */}
            <TouchableOpacity
              style={[styles.gosthiBanner, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
              onPress={() => router.push('/gosthi' as any)}
              activeOpacity={0.88}
            >
              <View style={styles.gosthiBannerRow}>
                <Text style={{ fontSize: 36 }}>🏡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.gosthiBannerTitle, { color: theme.primary }]}>घर पर शिव चर्चा गोष्ठी आयोजित करें ➔</Text>
                  <Text style={[styles.gosthiBannerSub, { color: theme.textSecondary }]}>
                    45-मिनट गोष्ठी टाइमर व सुंदर व्हाट्सएप निमंत्रण कार्ड बनाएँ
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* BOOKS SHORTCUT SECTION */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>📚 शिव चर्चा ग्रंथ व पुस्तकें</Text>
                <TouchableOpacity onPress={() => setActiveHub('books')} activeOpacity={0.7}>
                  <Text style={[styles.seeAllText, { color: theme.secondary }]}>सभी पुस्तकें देखें ➔</Text>
                </TouchableOpacity>
              </View>

              {booksLibrary.slice(0, 2).map((book) => (
                <TouchableOpacity
                  key={book.id}
                  style={[styles.bookCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                  onPress={() => router.push(`/book/${book.id}` as any)}
                  activeOpacity={0.9}
                >
                  <Image source={resolveImageSource(book.id || book.coverImage, 'book')} style={styles.bookCover} />
                  <View style={styles.bookDetails}>
                    <Text style={[styles.bookTitle, { color: theme.primary }]}>{book.title}</Text>
                    <Text style={[styles.bookAuthor, { color: theme.textMuted }]}>लेखक: {book.author}</Text>
                    <Text style={[styles.easyTag, { color: theme.secondary }]}>✨ आसान भाषा में व्याख्या</Text>
                    <Text style={[styles.bookSummary, { color: theme.textSecondary }]} numberOfLines={2}>
                      {book.easySummary}
                    </Text>
                    <Text style={[styles.chapterBadge, { color: theme.primary }]}>
                      📚 {book.totalChapters} अध्याय सम्मलित ➔
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* AUDIO SHORTCUT SECTION */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>🎧 ऑडियो पुस्तकालय व भजन</Text>
                <TouchableOpacity onPress={() => router.push('/audio-hub' as any)} activeOpacity={0.7}>
                  <Text style={[styles.seeAllText, { color: theme.secondary }]}>सभी ऑडियो देखें ➔</Text>
                </TouchableOpacity>
              </View>

              {audioLibrary.slice(0, 3).map((audio) => (
                <View key={audio.id} style={[styles.audioRowCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                  <Image source={resolveImageSource(audio.id || audio.coverImage, 'stotra')} style={styles.audioCover} />
                  <View style={styles.audioMeta}>
                    <Text style={[styles.audioRowTitle, { color: theme.textPrimary }]}>{audio.title}</Text>
                    <Text style={[styles.audioRowSubtitle, { color: theme.textMuted }]}>
                      {audio.artist || audio.subtitle} • {Math.floor(audio.duration / 60)} मि
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.audioPlayBtn, { backgroundColor: theme.primary }]}
                    onPress={() => playTrack(audio)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.audioPlayIcon, { color: theme.textWhite }]}>▶️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* SADHNA EXPERIENCE MODULE */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>📿 मार्गदर्शित साधना अनुभव</Text>

              <TouchableOpacity
                style={[styles.sadhnaCard, { backgroundColor: theme.cardBgMaroon, borderColor: theme.accent }]}
                onPress={() => router.push('/jap' as any)}
                activeOpacity={0.9}
              >
                <Text style={styles.sadhnaIcon}>📿</Text>
                <View style={styles.sadhnaTextCol}>
                  <Text style={[styles.sadhnaTitle, { color: theme.textGold }]}>108 नमः शिवाय जाप</Text>
                  <Text style={[styles.sadhnaSub, { color: theme.textWhite }]}>तृतीय सूत्र - डिजिटल रुद्राक्ष माला साधना</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sadhnaCard, { backgroundColor: theme.cardBgMaroon, borderColor: theme.accent }]}
                onPress={() => router.push('/puja' as any)}
                activeOpacity={0.9}
              >
                <Text style={styles.sadhnaIcon}>🌸</Text>
                <View style={styles.sadhnaTextCol}>
                  <Text style={[styles.sadhnaTitle, { color: theme.textGold }]}>शिव लिंग पूजा सेवा</Text>
                  <Text style={[styles.sadhnaSub, { color: theme.textWhite }]}>जल, पुष्प, बेलपत्र व आरती अर्पित करें</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Cross Promotion Banner */}
            <ContextualCrossPromotion targetAppId="vrat-sathi" style={{ paddingHorizontal: 0 }} />
          </>
        )}

        {/* DETAILED TOPIC READER LIST VIEW (WHEN A CATEGORY OR SEARCH IS ACTIVE) */}
        {isDetailedListView && (
          <>
            {/* TEACHINGS LIST */}
            {(activeHub === 'all' || activeHub === 'sutras' || activeHub === 'understanding' || activeHub === 'daily_life' || activeHub === 'faq') &&
              filteredTeachings.length > 0 && (
                <View style={styles.sectionContainer}>
                  {filteredTeachings.map((topic) => (
                    <View key={topic.id} style={[styles.topicCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                      {topic.imageUrl ? (
                        <Image source={resolveImageSource(topic.id || topic.imageUrl, 'teaching')} style={styles.topicImage} />
                      ) : null}
                      <Text style={[styles.topicTitle, { color: theme.textPrimary }]}>{topic.title}</Text>
                      <Text style={[styles.topicSubtitle, { color: theme.secondary }]}>{topic.subTitle}</Text>
                      <Text style={[styles.topicSummary, { color: theme.textSecondary }]}>{topic.summary}</Text>

                      <View style={styles.cardActionsRow}>
                        {topic.audioUrl && (
                          <TouchableOpacity
                            style={[styles.listenBtn, { backgroundColor: theme.primary }]}
                            onPress={() =>
                              playTrack({
                                id: topic.id,
                                title: topic.title,
                                subtitle: topic.subTitle,
                                category: 'teachings',
                                duration: topic.audioDuration || 180,
                                audioUrl: topic.audioUrl || '',
                                coverImage: topic.imageUrl || '',
                              })
                            }
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.listenBtnText, { color: theme.textWhite }]}>🎧 सुनें</Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={[styles.readBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                          onPress={() => router.push(`/teaching/${topic.id}` as any)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.readBtnText, { color: theme.primary }]}>📖 विस्तृत पढ़ें</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.shareIconBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
                          onPress={() => handleShareTopic(topic.title, topic.summary)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.shareIconText}>📤</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

            {/* BOOKS LIST WHEN Category = 'books' or Search */}
            {(activeHub === 'all' || activeHub === 'books' || searchQuery.trim().length > 0) && filteredBooks.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>📚 शिव चर्चा ग्रंथ व पुस्तकें</Text>
                {filteredBooks.map((book) => (
                  <TouchableOpacity
                    key={book.id}
                    style={[styles.bookCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                    onPress={() => router.push(`/book/${book.id}` as any)}
                    activeOpacity={0.9}
                  >
                    <Image source={resolveImageSource(book.id || book.coverImage, 'book')} style={styles.bookCover} />
                    <View style={styles.bookDetails}>
                      <Text style={[styles.bookTitle, { color: theme.primary }]}>{book.title}</Text>
                      <Text style={[styles.bookAuthor, { color: theme.textMuted }]}>लेखक: {book.author}</Text>
                      <Text style={[styles.easyTag, { color: theme.secondary }]}>✨ आसान भाषा में व्याख्या</Text>
                      <Text style={[styles.bookSummary, { color: theme.textSecondary }]} numberOfLines={2}>
                        {book.easySummary}
                      </Text>
                      <Text style={[styles.chapterBadge, { color: theme.primary }]}>
                        📚 {book.totalChapters} अध्याय सम्मलित ➔
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* AUDIO LIST WHEN Category = 'audio' or Search */}
            {(activeHub === 'all' || activeHub === 'audio' || searchQuery.trim().length > 0) && filteredAudio.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>🎧 ऑडियो पुस्तकालय</Text>
                {filteredAudio.map((audio) => (
                  <View key={audio.id} style={[styles.audioRowCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                    <Image source={resolveImageSource(audio.id || audio.coverImage, 'stotra')} style={styles.audioCover} />
                    <View style={styles.audioMeta}>
                      <Text style={[styles.audioRowTitle, { color: theme.textPrimary }]}>{audio.title}</Text>
                      <Text style={[styles.audioRowSubtitle, { color: theme.textMuted }]}>
                        {audio.artist || audio.subtitle} • {Math.floor(audio.duration / 60)} मि
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.audioPlayBtn, { backgroundColor: theme.primary }]}
                      onPress={() => playTrack(audio)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.audioPlayIcon, { color: theme.textWhite }]}>▶️</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* NO RESULTS FOUND */}
            {filteredTeachings.length === 0 && filteredBooks.length === 0 && filteredAudio.length === 0 && (
              <View style={[styles.noResultBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
                <Text style={[styles.noResultTitle, { color: theme.primary }]}>कोई विषय नहीं मिला</Text>
                <Text style={[styles.noResultSub, { color: theme.textSecondary }]}>
                  कृपया खोज शब्द बदलें या अन्य श्रेणी का चयन करें।
                </Text>
                <TouchableOpacity
                  style={[styles.resetSearchBtn, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    setActiveHub('all');
                    setSearchQuery('');
                  }}
                >
                  <Text style={{ color: theme.textWhite, fontWeight: 'bold' }}>मुख्य Hub पर लौटें</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  /* Tracker Styles */
  trackerCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  trackerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trackerTitleCol: {
    flex: 1,
  },
  trackerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  trackerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  collapseChevron: {
    fontSize: 12,
    marginLeft: 2,
  },
  compactCelebrationRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactCelebrationText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  compactBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniShareWhatsappBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  miniShareWhatsappText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  miniCreateCardBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  miniCreateCardText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  sutrasList: {
    gap: 8,
  },
  sutraCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkMark: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sutraTextCol: {
    flex: 1,
  },
  sutraLabel: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sutraDesc: {
    fontSize: 11,
    marginTop: 1,
    lineHeight: 15,
  },
  miniJapBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 6,
  },
  miniJapBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  celebrationCard: {
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  celebrationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  celebrationSub: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  celebrationBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareWhatsappBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareWhatsappText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  createCardBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  createCardText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* Streak Styles */
  streakRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  streakTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  streakHint: {
    fontSize: 11,
  },
  past7DaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  dayDotCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  dayDotIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  dayDotName: {
    fontSize: 10,
  },

  /* Daily Prompt Card Styles */
  promptCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  promptHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  promptBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  promptBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  promptDate: {
    fontSize: 11,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    lineHeight: 22,
  },
  promptContentBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  promptQuestionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promptQuestion: {
    fontSize: 13,
    lineHeight: 19,
  },
  quoteBox: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    paddingVertical: 6,
    paddingRight: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  promptActionsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sharePromptWhatsappBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  sharePromptWhatsappText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markSutra2Btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  markSutra2Text: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* Search & Filters */
  searchRow: {
    position: 'relative',
    marginBottom: 12,
  },
  searchInput: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 14,
    top: 12,
  },
  filterPillsScroll: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: 8,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  /* Hub Category Grid (2x2) */
  hubGridSection: {
    marginBottom: 18,
  },
  hubGridTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hubGridSub: {
    fontSize: 12,
    marginBottom: 12,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCategoryCard: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    ...shadows.soft,
    justifyContent: 'space-between',
  },
  gridCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gridCardIcon: {
    fontSize: 26,
  },
  gridBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  gridBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  gridCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gridCardSub: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  gridCardArrow: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* Gosthi Banner Styles */
  gosthiBanner: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 18,
    ...shadows.soft,
  },
  gosthiBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gosthiBannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  gosthiBannerSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },

  /* Section Containers */
  sectionContainer: {
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  /* Hub Navigation Bar */
  hubHeaderNav: {
    marginBottom: 14,
  },
  backToHubBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  backToHubText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeCategoryHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* Cards */
  topicCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    ...shadows.soft,
  },
  topicImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  topicSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 6,
  },
  topicSummary: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  listenBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  readBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
  },
  readBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  shareIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  shareIconText: {
    fontSize: 14,
  },
  bookCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 14,
    borderWidth: 1,
    ...shadows.soft,
  },
  bookCover: {
    width: 75,
    height: 105,
    borderRadius: 10,
    marginRight: 14,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 12,
    marginTop: 2,
  },
  easyTag: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bookSummary: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  chapterBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
  },
  audioRowCard: {
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  audioCover: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  audioMeta: {
    flex: 1,
  },
  audioRowTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  audioRowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  audioPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayIcon: {
    fontSize: 16,
  },
  sadhnaCard: {
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    ...shadows.gold,
  },
  sadhnaIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  sadhnaTextCol: {
    flex: 1,
  },
  sadhnaTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  sadhnaSub: {
    fontSize: 12,
    opacity: 0.85,
    marginTop: 2,
  },

  /* No Results */
  noResultBox: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 16,
  },
  noResultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noResultSub: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetSearchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  /* REELS SHOWCASE STYLES */
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
});
