import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';
import { teachingTopics } from '@/content/teachings';
import { booksLibrary } from '@/content/books';
import { audioLibrary } from '@/content/audioLibrary';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';

type SubSection = 'understand' | 'books' | 'audio' | 'sadhna';

export default function ShivCharchaScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playTrack } = useAudio();
  const [activeTab, setActiveTab] = useState<SubSection>('understand');

  const handleShareTopic = async (title: string, summary: string) => {
    await safeShare({
      title,
      message: `📖 *शिव चर्चा सीखें*: "${title}"\n\n${summary}\n\nशिव चर्चा ऐप — हर हर महादेव 🙏`,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="शिव चर्चा पुस्तकालय" subtitle="ज्ञान • पुस्तकें • ऑडियो • साधना" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PROMINENT SHIV SANSAR ENTRY WORLD BANNER */}
        <TouchableOpacity
          style={[styles.sansarBanner, { backgroundColor: theme.primary, borderColor: theme.accent }]}
          onPress={() => router.push('/sansar' as any)}
          activeOpacity={0.88}
        >
          <View style={styles.sansarBannerContent}>
            <Text style={[styles.sansarBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
              नया प्रमुख भक्ति संसार
            </Text>
            <Text style={[styles.sansarTitle, { color: theme.textGold }]}>🔱 शिव संसार में प्रवेश करें ➔</Text>
            <Text style={[styles.sansarSub, { color: theme.textWhite }]}>
              महादेव से जुड़ी कथाएँ, 12 ज्योतिर्लिंग, शक्ति पीठ, शिव परिवार, प्रतीक व तीर्थ यात्रा
            </Text>
          </View>
        </TouchableOpacity>

        {/* 4 Section Navigation Tabs */}
        <View style={[styles.navSubTabs, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.subTabBtn, activeTab === 'understand' && { backgroundColor: theme.primary }]}
            onPress={() => setActiveTab('understand')}
            activeOpacity={0.8}
          >
            <Text style={[styles.subTabText, { color: activeTab === 'understand' ? theme.textWhite : theme.textPrimary }]}>
              💡 समझें
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabBtn, activeTab === 'books' && { backgroundColor: theme.primary }]}
            onPress={() => setActiveTab('books')}
            activeOpacity={0.8}
          >
            <Text style={[styles.subTabText, { color: activeTab === 'books' ? theme.textWhite : theme.textPrimary }]}>
              📖 पुस्तकें
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabBtn, activeTab === 'audio' && { backgroundColor: theme.primary }]}
            onPress={() => setActiveTab('audio')}
            activeOpacity={0.8}
          >
            <Text style={[styles.subTabText, { color: activeTab === 'audio' ? theme.textWhite : theme.textPrimary }]}>
              🎧 सुनें
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabBtn, activeTab === 'sadhna' && { backgroundColor: theme.primary }]}
            onPress={() => setActiveTab('sadhna')}
            activeOpacity={0.8}
          >
            <Text style={[styles.subTabText, { color: activeTab === 'sadhna' ? theme.textWhite : theme.textPrimary }]}>
              📿 साधना
            </Text>
          </TouchableOpacity>
        </View>

        {/* SECTION A — समझें */}
        {activeTab === 'understand' && (
          <View>
            <Text style={[styles.sectionHeaderTitle, { color: theme.primary }]}>शिव शिष्यता के मूल विषय</Text>
            <Text style={[styles.sectionHeaderSub, { color: theme.textSecondary }]}>
              सरल भाषा में समझें और सुनें कि शिव को अपना गुरु कैसे बनाएँ।
            </Text>

            {teachingTopics.map((topic) => (
              <View key={topic.id} style={[styles.topicCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <Image source={{ uri: topic.imageUrl }} style={styles.topicImage} />
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

        {/* SECTION B — पुस्तकें */}
        {activeTab === 'books' && (
          <View>
            <Text style={[styles.sectionHeaderTitle, { color: theme.primary }]}>शिव चर्चा ग्रंथ व पुस्तकें</Text>
            <Text style={[styles.sectionHeaderSub, { color: theme.textSecondary }]}>"आसान भाषा में समझें" व्याख्या एवं अध्याय</Text>

            {booksLibrary.map((book) => (
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
                  <Text style={[styles.easyTag, { color: theme.secondary }]}>✨ आसान भाषा में सार</Text>
                  <Text style={[styles.bookSummary, { color: theme.textSecondary }]} numberOfLines={2}>
                    {book.easySummary}
                  </Text>
                  <Text style={[styles.chapterBadge, { color: theme.primary }]}>
                    📚 {book.totalChapters} अध्याय सम्मलित
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SECTION C — सुनें (Audio Library) */}
        {activeTab === 'audio' && (
          <View>
            <Text style={[styles.sectionHeaderTitle, { color: theme.primary }]}>भजन व शिव चर्चा ऑडियो पुस्तकालय</Text>

            {audioLibrary.map((audio) => (
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

        {/* SECTION D — साधना (Devotional Practice) */}
        {activeTab === 'sadhna' && (
          <View>
            <Text style={[styles.sectionHeaderTitle, { color: theme.primary }]}>मार्गदर्शित साधना अनुभव</Text>

            <TouchableOpacity
              style={[styles.sadhnaCard, { backgroundColor: theme.primary, borderColor: theme.accent }]}
              onPress={() => router.push('/jap' as any)}
              activeOpacity={0.9}
            >
              <Text style={styles.sadhnaIcon}>📿</Text>
              <View style={styles.sadhnaTextCol}>
                <Text style={[styles.sadhnaTitle, { color: theme.textGold }]}>108 नमः शिवाय जाप</Text>
                <Text style={[styles.sadhnaSub, { color: theme.textWhite }]}>तृतीय सूत्र — मंत्र माला साधना व रिकॉर्ड</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sadhnaCard, { backgroundColor: theme.primary, borderColor: theme.accent }]}
              onPress={() => router.push('/puja' as any)}
              activeOpacity={0.9}
            >
              <Text style={styles.sadhnaIcon}>🌸</Text>
              <View style={styles.sadhnaTextCol}>
                <Text style={[styles.sadhnaTitle, { color: theme.textGold }]}>शिव लिंग पूजा सेवा</Text>
                <Text style={[styles.sadhnaSub, { color: theme.textWhite }]}>पुष्प, जल, बेलपत्र व आरती सेवा</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sadhnaCard, { backgroundColor: theme.primary, borderColor: theme.accent }]}
              onPress={() => router.push('/teaching/t-three-sutras' as any)}
              activeOpacity={0.9}
            >
              <Text style={styles.sadhnaIcon}>🙏</Text>
              <View style={styles.sadhnaTextCol}>
                <Text style={[styles.sadhnaTitle, { color: theme.textGold }]}>दया माँगना व चर्चा करना</Text>
                <Text style={[styles.sadhnaSub, { color: theme.textWhite }]}>प्रथम व द्वितीय सूत्र का अभ्यास</Text>
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
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
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
  navSubTabs: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionHeaderSub: {
    fontSize: 13,
    marginBottom: 16,
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
    marginBottom: 16,
    borderWidth: 1,
    ...shadows.soft,
  },
  bookCover: {
    width: 80,
    height: 110,
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
});
