import React, { useState, useEffect, useCallback } from 'react';
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

type FilterCategory = 'all' | 'understand' | 'books' | 'audio' | 'sadhna';

export default function ShivCharchaScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPrefs, setUserPrefs] = useState<any>(defaultPreferences);
  const [isTrackerCollapsed, setIsTrackerCollapsed] = useState(false);
  const [streakInfo, setStreakInfo] = useState<{ streak: number; past7Days: Array<{ date: string; dayName: string; completed: boolean }> }>({
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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

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

  // Filtered lists based on search
  const filteredTeachings = teachingTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="शिव चर्चा • 3 सूत्र व विचार"
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
        {/* SHIV SANSAR SPOTLIGHT BANNER */}
        <TouchableOpacity
          style={[styles.sansarBanner, { backgroundColor: theme.primaryDark, borderColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/sansar' as any)}
          activeOpacity={0.88}
        >
          <View style={styles.sansarBannerContent}>
            <View style={[styles.sansarBadge, { backgroundColor: theme.accent }]}>
              <Text style={[styles.sansarBadgeText, { color: theme.primaryDark }]}>🔱 पावन महादेव ज्ञानकोश</Text>
            </View>
            <Text style={[styles.sansarTitle, { color: theme.textGold }]}>शिव संसार में प्रवेश करें ➔</Text>
            <Text style={[styles.sansarSub, { color: theme.textWhite }]}>
              कथाएँ • 12 ज्योतिर्लिंग • 51 शक्ति पीठ • शिव परिवार • प्रतीक व डिजिटल यात्रा
            </Text>
          </View>
        </TouchableOpacity>

        {/* PHASE 1: DAILY 3 SUTRA PRACTICE TRACKER & CELEBRATION */}
        <View style={[styles.trackerCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
          {/* Header Row (Clickable to Collapse / Expand) */}
          <TouchableOpacity
            style={[styles.trackerHeaderRow, { marginBottom: isTrackerCollapsed ? 0 : 12 }]}
            onPress={() => setIsTrackerCollapsed((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View style={styles.trackerTitleCol}>
              <Text style={[styles.trackerTitle, { color: theme.primary }]}>आज की शिव गुरु साधना 📿</Text>
              <Text style={[styles.trackerSub, { color: theme.textSecondary }]}>
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

          {/* COMPACT ACTIONS WHEN COLLAPSED & COMPLETED */}
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

          {/* EXPANDED 3 SUTRA CHECKLIST & CELEBRATION */}
          {!isTrackerCollapsed && (
            <>
              {/* 3 Sutra Checkable Items */}
              <View style={styles.sutrasList}>
                {/* Sutra 1 */}
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
                      "{getFirstSutraText(userPrefs)}"
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Sutra 2 */}
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

                {/* Sutra 3 */}
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

              {/* CELEBRATORY BANNER & WHATSAPP SHARE WHEN 3/3 COMPLETED */}
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

          {/* 7-DAY SADHNA STREAK TRACKER */}
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

        {/* TODAY'S CHARCHA PROMPT CARD (SUTRA 2 FOCUS) */}
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
          <Text style={[{ fontSize: 12, color: theme.textSecondary, marginBottom: 8, fontStyle: 'italic' }]}>
            {todayPrompt.topicHindi}
          </Text>

          <View style={[styles.promptContentBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.promptQuestionLabel, { color: theme.secondary }]}>💡 चर्चा का मुख्य बिंदु / विचार:</Text>
            <Text style={[styles.promptQuestion, { color: theme.textPrimary }]}>{todayPrompt.questionPrompt}</Text>
          </View>

          <View style={[styles.quoteBox, { borderLeftColor: theme.accent, backgroundColor: theme.background }]}>
            <Text style={[styles.quoteText, { color: theme.textSecondary }]}>
              "{todayPrompt.sahibJiQuote}"
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

        {/* PHASE 2: CORE PILLARS OF SHIV CHARCHA */}
        <View style={styles.pillarsContainer}>
          <Text style={[styles.pillarsTitle, { color: theme.primary }]}>🔱 शिव चर्चा के 5 पावन स्तम्भ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillarsScroll}>
            {/* Pillar 1: Sutra 1 */}
            <TouchableOpacity
              style={[styles.pillarCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
              onPress={() => router.push('/teaching/t-sutra-1-daya' as any)}
              activeOpacity={0.88}
            >
              <Text style={styles.pillarIcon}>🌸</Text>
              <Text style={[styles.pillarLabel, { color: theme.primary }]}>प्रथम सूत्र</Text>
              <Text style={[styles.pillarSub, { color: theme.textSecondary }]}>दया माँगना</Text>
            </TouchableOpacity>

            {/* Pillar 2: Sutra 2 */}
            <TouchableOpacity
              style={[styles.pillarCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
              onPress={() => router.push('/teaching/t-sutra-2-charcha' as any)}
              activeOpacity={0.88}
            >
              <Text style={styles.pillarIcon}>🗣️</Text>
              <Text style={[styles.pillarLabel, { color: theme.primary }]}>द्वितीय सूत्र</Text>
              <Text style={[styles.pillarSub, { color: theme.textSecondary }]}>चर्चा करना</Text>
            </TouchableOpacity>

            {/* Pillar 3: Sutra 3 */}
            <TouchableOpacity
              style={[styles.pillarCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
              onPress={() => router.push('/jap' as any)}
              activeOpacity={0.88}
            >
              <Text style={styles.pillarIcon}>📿</Text>
              <Text style={[styles.pillarLabel, { color: theme.primary }]}>तृतीय सूत्र</Text>
              <Text style={[styles.pillarSub, { color: theme.textSecondary }]}>108 जाप</Text>
            </TouchableOpacity>

            {/* Pillar 4: Sahib Shri Harindranand Ji */}
            <TouchableOpacity
              style={[styles.pillarCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
              onPress={() => router.push('/teaching/t-harindranand-ji' as any)}
              activeOpacity={0.88}
            >
              <Text style={styles.pillarIcon}>🔱</Text>
              <Text style={[styles.pillarLabel, { color: theme.primary }]}>साहब श्री</Text>
              <Text style={[styles.pillarSub, { color: theme.textSecondary }]}>हरिंद्रानंद जी</Text>
            </TouchableOpacity>

            {/* Pillar 5: Didi Maa Neelam Anand Ji */}
            <TouchableOpacity
              style={[styles.pillarCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}
              onPress={() => router.push('/teaching/t-neelam-anand-ji' as any)}
              activeOpacity={0.88}
            >
              <Text style={styles.pillarIcon}>🌺</Text>
              <Text style={[styles.pillarLabel, { color: theme.primary }]}>दीदी माँ</Text>
              <Text style={[styles.pillarSub, { color: theme.textSecondary }]}>नीलम आनंद जी</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* SEARCH BAR & CATEGORY FILTER PILLS */}
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
              <Text style={{ color: theme.textMuted }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Live Search Result Count */}
        {searchQuery.trim().length > 0 && (
          <View style={[styles.resultCountBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
            <Text style={[styles.resultCountText, { color: theme.primary }]}>
              🔍 {filteredTeachings.length + filteredBooks.length + filteredAudio.length} परिणाम मिले
            </Text>
          </View>
        )}

        {/* Filter Pills Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsScroll}>
          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'all' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'all' ? theme.textWhite : theme.textPrimary }]}>
              🔥 सभी
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'understand' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('understand')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'understand' ? theme.textWhite : theme.textPrimary }]}>
              💡 3 सूत्र व विषय
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'books' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('books')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'books' ? theme.textWhite : theme.textPrimary }]}>
              📚 पुस्तकें & ग्रंथ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'audio' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('audio')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'audio' ? theme.textWhite : theme.textPrimary }]}>
              🎧 ऑडियो पुस्तकालय
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'sadhna' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('sadhna')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'sadhna' ? theme.textWhite : theme.textPrimary }]}>
              📿 साधना साधन
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* SECTION A - समझें (TEACHINGS) */}
        {(activeFilter === 'all' || activeFilter === 'understand') && filteredTeachings.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>💡 शिव शिष्यता के मूल विषय</Text>

            {filteredTeachings.map((topic) => (
              <View key={topic.id} style={[styles.topicCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                {topic.imageUrl ? (
                  <Image source={{ uri: topic.imageUrl }} style={styles.topicImage} />
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

        {/* SECTION B - पुस्तकें (BOOKS) */}
        {(activeFilter === 'all' || activeFilter === 'books') && filteredBooks.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>📚 शिव चर्चा ग्रंथ व पुस्तकें</Text>

            {filteredBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={[styles.bookCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                onPress={() => router.push(`/book/${book.id}` as any)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: book.coverImage }} style={styles.bookCover} />
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

        {/* SECTION C - ऑडियो (AUDIO LIBRARY) */}
        {(activeFilter === 'all' || activeFilter === 'audio') && filteredAudio.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.sectionTitle, { color: theme.primary, marginBottom: 0 }]}>🎧 भजन व अमृत वाणी</Text>
              <TouchableOpacity onPress={() => router.push('/audio-hub' as any)} activeOpacity={0.7}>
                <Text style={{ fontSize: 13, color: theme.secondary, fontWeight: 'bold' }}>
                  सभी प्रवचन देखें ➔
                </Text>
              </TouchableOpacity>
            </View>

            {filteredAudio.map((audio) => (
              <View key={audio.id} style={[styles.audioRowCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <Image source={{ uri: audio.coverImage }} style={styles.audioCover} />
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

        {/* SECTION D - साधना (SADHNA HUB) */}
        {(activeFilter === 'all' || activeFilter === 'sadhna') && (
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

            <TouchableOpacity
              style={[styles.sadhnaCard, { backgroundColor: theme.cardBgMaroon, borderColor: theme.accent }]}
              onPress={() => router.push('/teaching/t-three-sutras' as any)}
              activeOpacity={0.9}
            >
              <Text style={styles.sadhnaIcon}>🙏</Text>
              <View style={styles.sadhnaTextCol}>
                <Text style={[styles.sadhnaTitle, { color: theme.textGold }]}>दया माँगना व चर्चा करना</Text>
                <Text style={[styles.sadhnaSub, { color: theme.textWhite }]}>प्रथम व द्वितीय सूत्र का पूर्ण अभ्यास</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  sansarBanner: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  sansarBannerContent: {},
  sansarBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  sansarBadgeText: {
    fontSize: 11,
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

  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
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
    borderRadius: 12,
    marginBottom: 12,
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
  quoteAuthor: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
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

  /* Core Pillars Styles */
  pillarsContainer: {
    marginBottom: 16,
  },
  pillarsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pillarsScroll: {
    flexDirection: 'row',
  },
  pillarCard: {
    width: 105,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    marginRight: 10,
    ...shadows.soft,
  },
  pillarIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  pillarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pillarSub: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },

  /* Search Counter Styles */
  resultCountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  resultCountText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
