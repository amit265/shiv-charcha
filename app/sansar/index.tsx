import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
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

  const categories: SansarCategory[] = [
    {
      id: 'stories',
      title: '📖 शिव कथाएँ',
      subtitle: 'सती, पार्वती, नीलकंठ व गंगा अवतरण की पावन गाथाएँ',
      icon: '📖',
      route: '/sansar/stories',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'jyotirlinga',
      title: '🛕 12 ज्योतिर्लिंग',
      subtitle: 'सोमनाथ से घृष्णेश्वर तक द्वादश पावन धाम दर्शन व ऑडियो',
      icon: '🛕',
      route: '/sansar/jyotirlinga',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'shakti-peeth',
      title: '🌺 शक्ति पीठ',
      subtitle: 'सती के पावन अंगों से सिद्ध 51 शक्ति पीठ दर्शन व इतिहास',
      icon: '🌺',
      route: '/sansar/shakti-peeth',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'family',
      title: '👨‍👩‍👧 शिव परिवार',
      subtitle: 'पार्वती, गणेश, कार्तिकेय व नंदी की अलौकिक महिमा',
      icon: '👨‍👩‍👧',
      route: '/sansar/family',
      image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'swaroop',
      title: '🔱 शिव के स्वरूप',
      subtitle: 'महादेव, नीलकंठ, नटराज, अर्धनारीश्वर व महाकाल रूप',
      icon: '🔱',
      route: '/sansar/swaroop',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'symbols',
      title: '🕉️ शिव के प्रतीक',
      subtitle: 'त्रिशूल, डमरू, रुद्राक्ष, चंद्रमा, भस्म व त्रिनेत्र का अर्थ',
      icon: '🕉️',
      route: '/sansar/symbols',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'yatra',
      title: '📍 शिव यात्रा (Interactive Map)',
      subtitle: 'भारत के नक्शे पर ज्योतिर्लिंग व तीर्थों की डिजिटल यात्रा',
      icon: '📍',
      route: '/sansar/yatra',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'temples',
      title: '🛕 प्रसिद्ध शिव मंदिर',
      subtitle: 'पशुपतिनाथ, तुंगनाथ, अमरनाथ व देश-विदेश के शिवालय',
      icon: '🛕',
      route: '/sansar/temples',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'festivals',
      title: '📅 शिव पर्व एवं उत्सव',
      subtitle: 'महाशिवरात्रि, सावन सोमवार व प्रदोष व्रत की विधि',
      icon: '📅',
      route: '/sansar/festivals',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'stotra',
      title: '📿 शिव स्तोत्र व मंत्र',
      subtitle: 'तांडव स्तोत्र, रुद्राष्टकम, महामृत्युंजय व लिंगाष्टकम पाठ',
      icon: '📿',
      route: '/sansar/stotra',
      image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🔱 शिव संसार" subtitle="महादेव से जुड़ी कथाएँ, तीर्थ, मंदिर, स्वरूप और ज्ञान" showBack />

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
            भगवान शिव के दिव्य आख्यान, ज्योतिर्लिंग, शक्ति पीठ, तीर्थ यात्रा व पौराणिक प्रतीकों का सम्पूर्ण डिजिटल ज्ञानकोश।
          </Text>
        </View>

        {/* Categories Grid */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>
          शिव संसार के पावन भाग
        </Text>

        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              onPress={() => router.push(cat.route as any)}
              activeOpacity={0.88}
            >
              <Image source={{ uri: cat.image }} style={styles.cardImage} />
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
      </ScrollView>
    </SafeAreaView>
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
