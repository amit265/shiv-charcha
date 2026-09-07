import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { RelatedContentItem } from '@/types/sansar';
import { useTheme } from '@/context/ThemeContext';
import { resolveImageSource } from '@/constants/imageAssets';
import { shadows } from '@/theme/colors';

interface RelatedContentSectionProps {
  items?: RelatedContentItem[];
}

export const RelatedContentSection: React.FC<RelatedContentSectionProps> = ({ items }) => {
  const router = useRouter();
  const { theme } = useTheme();

  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, { color: theme.primary }]}>🔗 इससे जुड़ा हुआ (संबंधित ज्ञान)</Text>
      <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
        कथा, तीर्थ और परंपरा का गहरा संबंध समझें
      </Text>

      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => router.push(item.routePath as any)}
            activeOpacity={0.85}
          >
            <Image source={resolveImageSource(item.id || item.image, item.type || 'hero')} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.cardSub, { color: theme.textSecondary }]} numberOfLines={1}>
                {item.subtitle}
              </Text>
              <Text style={[styles.arrowLink, { color: theme.secondary }]}>देखें ➔</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 12,
    marginBottom: 12,
  },
  grid: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
    ...shadows.soft,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  arrowLink: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
