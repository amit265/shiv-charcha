import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { colors, shadows } from '@/theme/colors';
import { dailyMessages } from '@/content/dailyMessages';
import { audioLibrary } from '@/content/audioLibrary';
import { sacredDates } from '@/content/dates';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';

export default function HomeScreen() {
  const router = useRouter();
  const { playTrack } = useAudio();

  const todayMsg = dailyMessages[0];
  const todayBhajan = audioLibrary[0];
  const specialDate = sacredDates[0];

  const handleShareMessage = async () => {
    await safeShare({
      title: todayMsg.title,
      message: `🌸 *आज का शिव गुरु संदेश* 🌸\n\n"${todayMsg.title}"\n${todayMsg.shortMessage}\n\n${todayMsg.shareCardPrompt}\n\nशिव चर्चा ऐप — महाव्योम स्टूडियो`,
    });
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Greeting */}
        <View style={styles.greetingBanner}>
          <Text style={styles.greetingTitle}>आज शिव गुरु से मेरा जुड़ाव 🙏</Text>
          <Text style={styles.greetingSub}>देखें • सुनें • छुएँ • करें • सीखें • साझा करें</Text>
        </View>

        {/* SECTION: आज का शिव गुरु संदेश */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionBadge}>आज का संदेश</Text>
            <Text style={styles.dateText}>{todayMsg.date}</Text>
          </View>

          <Image source={{ uri: todayMsg.imageUrl }} style={styles.msgImage} />

          <Text style={styles.msgTitle}>{todayMsg.title}</Text>
          <Text style={styles.msgShort}>{todayMsg.shortMessage}</Text>

          <View style={styles.msgActionsRow}>
            <TouchableOpacity
              style={styles.listenBtn}
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
              <Text style={styles.listenBtnText}>🎧 सुनें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnOutline}
              onPress={() => router.push('/teaching/t-three-sutras' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionBtnOutlineText}>📖 पढ़ें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnOutline}
              onPress={handleShareMessage}
              activeOpacity={0.7}
            >
              <Text style={styles.actionBtnOutlineText}>📤 साझा करें</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: आज का अनुभव (Interactive Devotional Spotlight) */}
        <View style={styles.experienceSection}>
          <Text style={styles.sectionTitle}>आज का भक्ति अनुभव 🌺</Text>
          <Text style={styles.sectionSub}>शिव गुरु के श्री चरणों में सेवा व साधना अर्पित करें</Text>

          <View style={styles.experienceGrid}>
            <TouchableOpacity
              style={styles.experienceCard}
              onPress={() => router.push('/puja' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.expIcon}>🌸</Text>
              <Text style={styles.expTitle}>शिव लिंग पूजा</Text>
              <Text style={styles.expSub}>पुष्प, बेलपत्र व जल चढ़ाएँ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.experienceCard, styles.expCardAlt]}
              onPress={() => router.push('/jap' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.expIcon}>📿</Text>
              <Text style={styles.expTitle}>108 जाप साधना</Text>
              <Text style={styles.expSub}>नमः शिवाय माला जाप</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: आज का भजन */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>आज का भजन 🎵</Text>
          <View style={styles.bhajanCardRow}>
            <Image source={{ uri: todayBhajan.coverImage }} style={styles.bhajanImage} />
            <View style={styles.bhajanInfo}>
              <Text style={styles.bhajanTitle}>{todayBhajan.title}</Text>
              <Text style={styles.bhajanArtist}>{todayBhajan.artist}</Text>
              <Text style={styles.bhajanDuration}>⏱️ {Math.floor(todayBhajan.duration / 60)} मि</Text>
            </View>
            <TouchableOpacity
              style={styles.bhajanPlayBtn}
              onPress={() => playTrack(todayBhajan)}
              activeOpacity={0.8}
            >
              <Text style={styles.bhajanPlayIcon}>▶️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION: आज का महत्वपूर्ण दिन & आगामी विशेष दिवस */}
        <TouchableOpacity
          style={styles.dateReminderCard}
          onPress={() => router.push(`/date/${specialDate.id}` as any)}
          activeOpacity={0.9}
        >
          <View style={styles.dateLeftColumn}>
            <Text style={styles.dateLabel}>पावन स्मरण दिवस</Text>
            <Text style={styles.dateTitle}>{specialDate.title}</Text>
            <Text style={styles.dateSub}>{specialDate.subtitle}</Text>
          </View>
          <View style={styles.dateRightArrow}>
            <Text style={styles.arrowIcon}>➔</Text>
          </View>
        </TouchableOpacity>

        {/* SECTION: आज का शेयर कार्ड Quick Teaser */}
        <View style={styles.shareTeaserCard}>
          <Text style={styles.shareTeaserTitle}>आज का शेयर कार्ड बनाएं 🖼️</Text>
          <Text style={styles.shareTeaserSub}>
            अपना नाम लिखकर शिव गुरु का पावन संदेश परिजनों व व्हाट्सएप पर साझा करें।
          </Text>
          <TouchableOpacity
            style={styles.shareTeaserBtn}
            onPress={() => router.push('/share' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.shareTeaserBtnText}>✨ शेयर कार्ड बनाएं</Text>
          </TouchableOpacity>
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
  greetingBanner: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
    ...shadows.soft,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  greetingSub: {
    fontSize: 11,
    color: colors.bgIvory,
    opacity: 0.9,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    color: colors.maroonDark,
    backgroundColor: colors.bgSoftAmber,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  dateText: {
    fontSize: 12,
    color: colors.textLight,
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
    color: colors.textDark,
    marginBottom: 6,
  },
  msgShort: {
    fontSize: 14,
    color: colors.textMedium,
    lineHeight: 22,
    marginBottom: 16,
  },
  msgActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listenBtn: {
    backgroundColor: colors.saffronPrimary,
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
    color: colors.textWhite,
  },
  actionBtnOutline: {
    backgroundColor: colors.bgIvory,
    borderWidth: 1,
    borderColor: colors.borderGold,
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
    color: colors.maroonDark,
  },
  experienceSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 12,
  },
  experienceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  experienceCard: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 18,
    padding: 16,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
    ...shadows.gold,
  },
  expCardAlt: {
    backgroundColor: colors.maroonLight,
  },
  expIcon: {
    fontSize: 34,
    marginBottom: 6,
  },
  expTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.goldLight,
    textAlign: 'center',
  },
  expSub: {
    fontSize: 10,
    color: colors.bgIvory,
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
    color: colors.textDark,
  },
  bhajanArtist: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  bhajanDuration: {
    fontSize: 11,
    color: colors.saffronPrimary,
    marginTop: 4,
  },
  bhajanPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bhajanPlayIcon: {
    fontSize: 18,
  },
  dateReminderCard: {
    backgroundColor: colors.bgSoftAmber,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.borderGold,
  },
  dateLeftColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.saffronDark,
    textTransform: 'uppercase',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginTop: 2,
  },
  dateSub: {
    fontSize: 12,
    color: colors.textMedium,
    marginTop: 2,
  },
  dateRightArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  arrowIcon: {
    fontSize: 16,
    color: colors.maroonDark,
    fontWeight: 'bold',
  },
  shareTeaserCard: {
    backgroundColor: colors.maroonDark,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
  },
  shareTeaserTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.goldLight,
    textAlign: 'center',
  },
  shareTeaserSub: {
    fontSize: 13,
    color: colors.bgIvory,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  shareTeaserBtn: {
    backgroundColor: colors.goldPrimary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 14,
  },
  shareTeaserBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
});
