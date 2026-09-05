import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Share, Platform } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { ShareTemplate } from '../../types';
import { colors, shadows } from '../../theme/colors';

interface ShareCardRendererProps {
  template: ShareTemplate;
  userName?: string;
  customText?: string;
}

export const ShareCardRenderer: React.FC<ShareCardRendererProps> = ({
  template,
  userName: initialUserName = 'शिव शिष्य',
  customText: initialCustomText,
}) => {
  const viewShotRef = useRef<any>(null);
  const [userName, setUserName] = useState<string>(initialUserName);
  const [customMessage, setCustomMessage] = useState<string>(
    initialCustomText || template.defaultText
  );

  const handleShare = async () => {
    try {
      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        const uri = await viewShotRef.current.capture();
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          await Share.share({
            message: `"${customMessage}"\n— ${userName}\n\nशिव चर्चा ऐप`,
            url: uri,
          });
        }
      } else {
        await Share.share({
          message: `"${customMessage}"\n— ${userName}\n\nशिव चर्चा ऐप से शेयर किया गया 🙏`,
        });
      }
    } catch (e) {
      await Share.share({
        message: `"${customMessage}"\n— ${userName}\n\nशिव चर्चा ऐप`,
      });
    }
  };

  return (
    <View style={styles.outerContainer}>
      {/* Captured Card Component */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 0.95 }}
        style={[
          styles.cardContainer,
          {
            backgroundColor: template.bgGradient[0],
            borderColor: template.accentColor,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardOm}>ॐ</Text>
          <Text style={[styles.cardTitle, { color: template.accentColor }]}>{template.title}</Text>
        </View>

        <View style={styles.quoteBox}>
          <Text style={[styles.quoteText, { color: template.textColor }]}>
            "{customMessage}"
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={[styles.authorText, { color: template.accentColor }]}>
            — {userName || 'शिव शिष्य'}
          </Text>
          <Text style={[styles.brandingText, { color: template.textColor }]}>
            महाव्योम स्टूडियो • शिव चर्चा 🙏
          </Text>
        </View>
      </ViewShot>

      {/* Input controls to customize */}
      <View style={styles.controlsBox}>
        <Text style={styles.inputLabel}>अपना नाम दर्ज करें (Optional):</Text>
        <TextInput
          style={styles.textInput}
          value={userName}
          onChangeText={setUserName}
          placeholder="आपका नाम..."
          placeholderTextColor="#8D6E63"
        />

        <Text style={styles.inputLabel}>संदेश बदलें:</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={customMessage}
          onChangeText={setCustomMessage}
          multiline
          numberOfLines={3}
          placeholder="संदेश लिखें..."
          placeholderTextColor="#8D6E63"
        />

        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareButtonText}>🖼️ शेयर कार्ड साझा करें</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    aspectRatio: 1.0,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    borderWidth: 2,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardOm: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.goldPrimary,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quoteBox: {
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  quoteText: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30,
    textAlign: 'center',
  },
  cardFooter: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
  },
  authorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  brandingText: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 4,
  },
  controlsBox: {
    width: '100%',
    backgroundColor: colors.cardBgAmber,
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 6,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  multilineInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  shareButton: {
    backgroundColor: colors.saffronPrimary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    ...shadows.soft,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
});
