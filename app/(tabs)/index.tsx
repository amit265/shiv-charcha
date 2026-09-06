import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';
import { dailyMessages } from '@/content/dailyMessages';
import { audioLibrary } from '@/content/audioLibrary';
import { sacredDates } from '@/content/dates';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();

  const todayMsg = dailyMessages[0];
  const todayBhajan = audioLibrary[0];
  const specialDate = sacredDates[0];

  const handleShareMessage = async () => {
    await safeShare({
      title: todayMsg.title,
      message: `🌸 *आज का शिव गुरु संदेश* 🌸\n\n"${todayMsg.title}"\n${todayMsg.shortMessage}\n\n${todayMsg.shareCardPrompt}\n\nशिव चर्चा ऐप — हर हर महादेव 🙏`,
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
        {/* Banner Greeting */}
        <View style={[styles.greetingBanner, { backgroundColor: theme.primary, borderColor: theme.accent }]}>
          <Text style={[styles.greetingTitle, { color: theme.textGold }]}>आज शिव गुरु से मेरा जुड़ाव 🙏</Text>
          <Text style={[styles.greetingSub, { color: theme.textWhite }]}>हर हर महादेव • नमः शिवाय साधना</Text>
        </View>

        {/* PROMINENT SHIV SANSAR SPOTLIGHT CARD ON HOME */}
        <TouchableOpacity
          style={[styles.sansarSpotlightCard, { backgroundColor: theme.cardBgMaroon, borderColor: theme.accent }]}
          onPress={() => router.push('/sansar' as any)}
          activeOpacity={0.9}
        >
          <View style={styles.sansarHeaderRow}>
            <Text style={[styles.sansarBadge, { backgroundColor: theme.accent, color: theme.primaryDark }]}>
              विशेष प्रस्तुति
            </Text>
            <Text style={[styles.sansarArrow, { color: theme.textGold }]}>प्रवेश करें ➔</Text>
          </View>

          <Text style={[styles.sansarTitle, { color: theme.textGold }]}>🔱 शिव संसार — महादेव ज्ञानकोश</Text>
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

        {/* SECTION: आज का शिव गुरु संदेश */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary, borderColor: theme.borderGold }]}>
              आज का संदेश
            </Text>
            <Text style={[styles.dateText, { color: theme.textMuted }]}>{todayMsg.date}</Text>
          </View>

          <Image source={{ uri: todayMsg.imageUrl }} style={styles.msgImage} />

          <Text style={[styles.msgTitle, { color: theme.textPrimary }]}>{todayMsg.title}</Text>
          <Text style={[styles.msgShort, { color: theme.textSecondary }]}>{todayMsg.shortMessage}</Text>

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
              <Text style={[styles.actionBtnOutlineText, { color: theme.primary }]}>📖 पढ़ें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtnOutline, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
              onPress={handleShareMessage}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionBtnOutlineText, { color: theme.primary }]}>📤 साझा</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: आज का अनुभव */}
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

        {/* SECTION: आज का भजन */}
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

        {/* SECTION: आज का महत्वपूर्ण दिन */}
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

        {/* SECTION: रील्स व शेयर */}
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
    paddingBottom: 110,
  },
  greetingBanner: {
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1.2,
    marginRight: 6,
    alignItems: 'center',
  },
  listenBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionBtnOutline: {
    borderWidth: 1,
    paddingHorizontal: 14,
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
});
