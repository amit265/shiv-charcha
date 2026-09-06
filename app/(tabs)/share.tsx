import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { colors, shadows } from '@/theme/colors';
import { shareTemplates } from '@/content/shareTemplates';
import { ShareCardRenderer } from '@/components/share/ShareCardRenderer';
import { ShareTemplate } from '@/types';

export default function ShareStudioScreen() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate>(shareTemplates[0]);

  return (
    <View style={styles.container}>
      <Header title="शेयर स्टूडियो" subtitle="डिजाइन चुनें • नाम दर्ज करें • साझा करें" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Full-Screen Reels Mode Feature Banner */}
        <TouchableOpacity
          style={styles.reelsBanner}
          onPress={() => router.push('/reels' as any)}
          activeOpacity={0.9}
        >
          <View style={styles.reelsBannerLeft}>
            <View style={styles.reelsBadge}>
              <Text style={styles.reelsBadgeText}>✨ 100+ पावन विचार रील्स</Text>
            </View>
            <Text style={styles.reelsBannerTitle}>🎬 विचार रील स्क्रॉल (Reels Mode)</Text>
            <Text style={styles.reelsBannerSub}>
              फुल-स्क्रीन शिव वॉलपेपर पर 100 विचार स्क्रॉल करें, सहेजें और शेयर करें ➔
            </Text>
          </View>
          <View style={styles.reelsPlayCircle}>
            <Text style={styles.reelsPlayIcon}>▶️</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionHeaderTitle}>टैम्पलेट डिजाइन चुनें 🎨</Text>
        <Text style={styles.sectionHeaderSub}>
          अपनी पसंद का भक्ति कार्ड स्टाइल चुनें और अपना नाम लिखकर शेयर करें:
        </Text>

        {/* Template Selector Horizontal List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.templateScroll}
          contentContainerStyle={styles.templateScrollContainer}
        >
          {shareTemplates.map((template) => {
            const isSelected = template.id === selectedTemplate.id;
            return (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templatePill,
                  { backgroundColor: template.bgGradient[0] },
                  isSelected && styles.templatePillSelected,
                ]}
                onPress={() => setSelectedTemplate(template)}
                activeOpacity={0.8}
              >
                <Text style={styles.templatePillTitle}>{template.title}</Text>
                <Text style={styles.templatePillStyle}>
                  {isSelected ? '✓ चयनित' : template.style}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Live Card Renderer & Customization Form */}
        <ShareCardRenderer template={selectedTemplate} />
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
  reelsBanner: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.8,
    borderColor: colors.goldPrimary,
    ...shadows.gold,
  },
  reelsBannerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  reelsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.goldPrimary,
    marginBottom: 6,
  },
  reelsBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  reelsBannerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.goldLight,
    letterSpacing: 0.3,
  },
  reelsBannerSub: {
    fontSize: 12,
    color: colors.bgIvory,
    opacity: 0.9,
    marginTop: 4,
    lineHeight: 17,
  },
  reelsPlayCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  reelsPlayIcon: {
    fontSize: 20,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginBottom: 4,
  },
  sectionHeaderSub: {
    fontSize: 12,
    color: colors.textMedium,
    marginBottom: 12,
  },
  templateScroll: {
    marginBottom: 16,
  },
  templateScrollContainer: {
    paddingRight: 12,
  },
  templatePill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 10,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  templatePillSelected: {
    borderColor: colors.goldLight,
    borderWidth: 2.5,
    transform: [{ scale: 1.05 }],
  },
  templatePillTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  templatePillStyle: {
    fontSize: 10,
    color: colors.goldLight,
    marginTop: 2,
    fontWeight: '600',
  },
});
