import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/common/Header';
import { colors, shadows } from '../../theme/colors';
import { teachingTopics } from '../../content/teachings';
import { booksLibrary } from '../../content/books';
import { audioLibrary } from '../../content/audioLibrary';
import { useAudio } from '../../context/AudioContext';

type SubSection = 'understand' | 'books' | 'audio' | 'sadhna';

export default function ShivCharchaScreen() {
  const router = useRouter();
  const { playTrack } = useAudio();
  const [activeTab, setActiveTab] = useState<SubSection>('understand');

  const handleShareTopic = async (title: string, summary: string) => {
    try {
      await Share.share({
        message: `📖 *शिव चर्चा सीखें*: "${title}"\n\n${summary}\n\nशिव चर्चा ऐप — महाव्योम स्टूडियो`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Header title="शिव चर्चा पुस्तकालय" subtitle="ज्ञान • पुस्तकें • ऑडियो • साधना" />

      {/* 4 Section Navigation Tabs */}
      <View style={styles.navSubTabs}>
        <TouchableOpacity
          style={[styles.subTabBtn, activeTab === 'understand' && styles.subTabBtnActive]}
          onPress={() => setActiveTab('understand')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, activeTab === 'understand' && styles.subTabTextActive]}>
            💡 समझें
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabBtn, activeTab === 'books' && styles.subTabBtnActive]}
          onPress={() => setActiveTab('books')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, activeTab === 'books' && styles.subTabTextActive]}>
            📖 पुस्तकें
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabBtn, activeTab === 'audio' && styles.subTabBtnActive]}
          onPress={() => setActiveTab('audio')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, activeTab === 'audio' && styles.subTabTextActive]}>
            🎧 सुनें
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabBtn, activeTab === 'sadhna' && styles.subTabBtnActive]}
          onPress={() => setActiveTab('sadhna')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, activeTab === 'sadhna' && styles.subTabTextActive]}>
            📿 साधना
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SECTION A — समझें */}
        {activeTab === 'understand' && (
          <View>
            <Text style={styles.sectionHeaderTitle}>शिव शिष्यता के मूल विषय</Text>
            <Text style={styles.sectionHeaderSub}>
              सरल भाषा में समझें और सुनें कि शिव को अपना गुरु कैसे बनाएँ।
            </Text>

            {teachingTopics.map((topic) => (
              <View key={topic.id} style={styles.topicCard}>
                <Image source={{ uri: topic.imageUrl }} style={styles.topicImage} />
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicSubtitle}>{topic.subTitle}</Text>
                <Text style={styles.topicSummary}>{topic.summary}</Text>

                <View style={styles.cardActionsRow}>
                  {topic.audioUrl && (
                    <TouchableOpacity
                      style={styles.listenBtn}
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
                      <Text style={styles.listenBtnText}>🎧 सुनें</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.readBtn}
                    onPress={() => router.push(`/teaching/${topic.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.readBtnText}>📖 विस्तृत पढ़ें</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.shareIconBtn}
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
            <Text style={styles.sectionHeaderTitle}>शिव चर्चा ग्रंथ व पुस्तकें</Text>
            <Text style={styles.sectionHeaderSub}>"आसान भाषा में समझें" व्याख्या एवं अध्याय</Text>

            {booksLibrary.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                onPress={() => router.push(`/book/${book.id}` as any)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: book.coverImage }} style={styles.bookCover} />
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>लेखक: {book.author}</Text>
                  <Text style={styles.easyTag}>✨ आसान भाषा में सार</Text>
                  <Text style={styles.bookSummary} numberOfLines={2}>
                    {book.easySummary}
                  </Text>
                  <Text style={styles.chapterBadge}>
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
            <Text style={styles.sectionHeaderTitle}>भजन व शिव चर्चा ऑडियो पुस्तकालय</Text>

            {audioLibrary.map((audio) => (
              <View key={audio.id} style={styles.audioRowCard}>
                <Image source={{ uri: audio.coverImage }} style={styles.audioCover} />
                <View style={styles.audioMeta}>
                  <Text style={styles.audioRowTitle}>{audio.title}</Text>
                  <Text style={styles.audioRowSubtitle}>
                    {audio.artist || audio.subtitle} • {Math.floor(audio.duration / 60)} मि
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.audioPlayBtn}
                  onPress={() => playTrack(audio)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.audioPlayIcon}>▶️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* SECTION D — साधना (Devotional Practice) */}
        {activeTab === 'sadhna' && (
          <View>
            <Text style={styles.sectionHeaderTitle}>मार्गदर्शित साधना अनुभव</Text>

            <TouchableOpacity
              style={styles.sadhnaCard}
              onPress={() => router.push('/jap' as any)}
              activeOpacity={0.9}
            >
              <Text style={styles.sadhnaIcon}>📿</Text>
              <View style={styles.sadhnaTextCol}>
                <Text style={styles.sadhnaTitle}>108 नमः शिवाय जाप</Text>
                <Text style={styles.sadhnaSub}>तृतीय सूत्र — मंत्र माला साधना व रिकॉर्ड</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sadhnaCard}
              onPress={() => router.push('/puja' as any)}
              activeOpacity={0.9}
            >
              <Text style={styles.sadhnaIcon}>🌸</Text>
              <View style={styles.sadhnaTextCol}>
                <Text style={styles.sadhnaTitle}>शिव लिंग पूजा सेवा</Text>
                <Text style={styles.sadhnaSub}>पुष्प, जल, बेलपत्र व आरती सेवा</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sadhnaCard}
              onPress={() => router.push('/teaching/t-three-sutras' as any)}
              activeOpacity={0.9}
            >
              <Text style={styles.sadhnaIcon}>🙏</Text>
              <View style={styles.sadhnaTextCol}>
                <Text style={styles.sadhnaTitle}>दया माँगना व चर्चा करना</Text>
                <Text style={styles.sadhnaSub}>प्रथम व द्वितीय सूत्र का अभ्यास</Text>
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
    backgroundColor: colors.bgIvory,
  },
  navSubTabs: {
    flexDirection: 'row',
    backgroundColor: colors.maroonPrimary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldPrimary,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  subTabBtnActive: {
    backgroundColor: colors.goldPrimary,
  },
  subTabText: {
    fontSize: 13,
    color: colors.bgIvory,
    fontWeight: 'bold',
  },
  subTabTextActive: {
    color: colors.maroonDark,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginBottom: 4,
  },
  sectionHeaderSub: {
    fontSize: 13,
    color: colors.textMedium,
    marginBottom: 16,
  },
  topicCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    color: colors.textDark,
  },
  topicSubtitle: {
    fontSize: 12,
    color: colors.saffronDark,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 6,
  },
  topicSummary: {
    fontSize: 13,
    color: colors.textMedium,
    lineHeight: 20,
    marginBottom: 14,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenBtn: {
    backgroundColor: colors.saffronPrimary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  listenBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  readBtn: {
    backgroundColor: colors.bgSoftAmber,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderGold,
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
  },
  readBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  shareIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgIvory,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  shareIconText: {
    fontSize: 14,
  },
  bookCard: {
    backgroundColor: colors.cardBgAmber,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderGold,
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
    color: colors.maroonDark,
  },
  bookAuthor: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  easyTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.saffronDark,
    marginTop: 4,
  },
  bookSummary: {
    fontSize: 12,
    color: colors.textMedium,
    marginTop: 4,
    lineHeight: 16,
  },
  chapterBadge: {
    fontSize: 11,
    color: colors.maroonPrimary,
    fontWeight: 'bold',
    marginTop: 6,
  },
  audioRowCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    color: colors.textDark,
  },
  audioRowSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  audioPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayIcon: {
    fontSize: 16,
  },
  sadhnaCard: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
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
    color: colors.goldLight,
  },
  sadhnaSub: {
    fontSize: 12,
    color: colors.bgIvory,
    opacity: 0.85,
    marginTop: 2,
  },
});
