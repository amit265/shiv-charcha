import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { resolveImageSource } from '@/constants/imageAssets';
import { shadows } from '@/theme/colors';

interface SansarCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  image: string;
}

export default function ShivSansarHomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const tier1Categories: SansarCategory[] = [
    {
      id: 'stories',
      title: 'शिव कथाएँ',
      subtitle: 'सती, पार्वती, नीलकंठ व गंगा अवतरण की पावन गाथाएँ',
      icon: '📖',
      route: '/sansar/stories',
      image: '',
    },
    {
      id: 'jyotirlinga',
      title: '12 ज्योतिर्लिंग',
      subtitle: 'सोमनाथ से घृष्णेश्वर तक द्वादश पावन धाम दर्शन',
      icon: '🛕',
      route: '/sansar/jyotirlinga',
      image: '',
    },
    {
      id: 'shakti-peeth',
      title: '51 शक्ति पीठ',
      subtitle: 'माता सती के पावन शक्ति पीठ दर्शन व इतिहास',
      icon: '🌺',
      route: '/sansar/shakti-peeth',
      image: '',
    },
    {
      id: 'family',
      title: 'शिव परिवार',
      subtitle: 'माता पार्वती, गणेश, कार्तिकेय व नंदी की महिमा',
      icon: '👨‍👩‍👧',
      route: '/sansar/family',
      image: '',
    },
  ];

  const tier2Categories: SansarCategory[] = [
    {
      id: 'swaroop',
      title: 'शिव के स्वरूप',
      subtitle: 'महादेव, नीलकंठ, नटराज व अर्धनारीश्वर रूप',
      icon: '🔱',
      route: '/sansar/swaroop',
      image: '',
    },
    {
      id: 'symbols',
      title: 'शिव के प्रतीक',
      subtitle: 'त्रिशूल, डमरू, रुद्राक्ष, भस्म व त्रिनेत्र का अर्थ',
      icon: '🕉️',
      route: '/sansar/symbols',
      image: '',
    },
    {
      id: 'yatra',
      title: 'शिव डिजिटल यात्रा',
      subtitle: 'भारत के नक्शे पर ज्योतिर्लिंग व तीर्थों का मार्ग',
      icon: '📍',
      route: '/sansar/yatra',
      image: '',
    },
    {
      id: 'temples',
      title: 'प्रसिद्ध शिव मंदिर',
      subtitle: 'पशुपतिनाथ, तुंगनाथ, अमरनाथ व पावन शिवालय',
      icon: '🛕',
      route: '/sansar/temples',
      image: '',
    },
  ];

  const tier3Categories: SansarCategory[] = [
    {
      id: 'stotra',
      title: 'शिव स्तोत्र व मंत्र',
      subtitle: 'तांडव स्तोत्र, रुद्राष्टकम व महामृत्युंजय पाठ',
      icon: '📿',
      route: '/sansar/stotra',
      image: '',
    },
    {
      id: 'festivals',
      title: 'शिव पर्व व व्रत विधि',
      subtitle: 'महाशिवरात्रि, सावन सोमवार व प्रदोष व्रत विधि',
      icon: '📅',
      route: '/sansar/festivals',
      image: '',
    },
  ];

  const renderCategoryGrid = (items: SansarCategory[]) => (
    <View style={styles.categoriesGrid}>
      {items.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.categoryCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
          onPress={() => router.push(cat.route as any)}
          activeOpacity={0.88}
        >
          <Image source={resolveImageSource(cat.id || cat.image, 'hero')} style={styles.cardImage} />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardIcon}>{cat.icon}</Text>
            <Text style={styles.cardTitle}>{cat.title}</Text>
            <Text style={styles.cardSub} numberOfLines={2}>
              {cat.subtitle}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🔱 शिव संसार" subtitle="महादेव से जुड़ी कथाएँ, तीर्थ, मंदिर, स्वरूप और ज्ञान" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Hero Card */}
        <View style={[styles.heroBanner, { backgroundColor: theme.primary, borderColor: theme.accent }]}>
          <Text style={[styles.heroBadge, { backgroundColor: theme.surfaceElevated, color: theme.primary }]}>
            शिव ज्ञान एवं संस्कृति की विशाल दुनिया
          </Text>
          <Text style={[styles.heroTitle, { color: theme.textGold }]}>
            शिव चर्चा से शिव संसार तक 🔱
          </Text>
          <Text style={[styles.heroSub, { color: theme.textWhite }]}>
            भगवान शिव के दिव्य आख्यान, ज्योतिर्लिंग, शक्ति पीठ, तीर्थ यात्रा व पौराणिक प्रतीकों का सम्पूर्ण ज्ञानकोश।
          </Text>
        </View>

        {/* TIER 1: KATHA & DHAM */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>
          🌸 1. पावन कथाएँ, ज्योतिर्लिंग व धाम
        </Text>
        {renderCategoryGrid(tier1Categories)}

        {/* TIER 2: SWAROOP, SYMBOLS & TEMPLES */}
        <Text style={[styles.sectionTitle, { color: theme.primary, marginTop: 22 }]}>
          🔱 2. रूप, प्रतीक व तीर्थ दर्शन
        </Text>
        {renderCategoryGrid(tier2Categories)}

        {/* TIER 3: MANTRAS & FESTIVALS */}
        <Text style={[styles.sectionTitle, { color: theme.primary, marginTop: 22 }]}>
          📿 3. नित्य पाठ, स्तोत्र व पर्व
        </Text>
        {renderCategoryGrid(tier3Categories)}
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
  heroBanner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  categoryCard: {
    width: '47.5%',
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadows.soft,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    padding: 12,
    justifyContent: 'flex-end',
  },
  cardIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    lineHeight: 14,
  },
});
