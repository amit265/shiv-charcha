import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '../../components/common/Header';
import { colors } from '../../theme/colors';
import { shareTemplates } from '../../content/shareTemplates';
import { ShareCardRenderer } from '../../components/share/ShareCardRenderer';
import { ShareTemplate } from '../../types';

export default function ShareStudioScreen() {
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate>(shareTemplates[0]);

  return (
    <View style={styles.container}>
      <Header title="शेयर स्टूडियो" subtitle="डिजाइन चुनें • नाम दर्ज करें • साझा करें" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
