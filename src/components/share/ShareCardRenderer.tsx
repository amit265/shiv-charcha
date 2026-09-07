import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { ShareTemplate } from '../../types';
import { shadows } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { safeShare } from '../../services/shareService';
import { StorageService, getFormattedUserName } from '../../services/storage';

interface ShareCardRendererProps {
  template: ShareTemplate;
  userName?: string;
  customText?: string;
}

const PRESET_QUOTES = [
  'हे शिव! आप मेरे गुरु हैं, मैं आपका शिष्य हूँ। मुझ पर दया कर दीजिए। 🙏',
  'शिव ही गुरु हैं, गुरु ही शिव हैं। आओ चलें शिव की ओर! 🌺',
  'ॐ नमः शिवाय! शिव गुरु की अहैतुकी दया हम सब पर बनी रहे। 📿',
  'सत्य ही शिव है, शिव ही सुंदर है। हर हर महादेव 🔱',
  'नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय... नमः शिवाय 🕉️',
  'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्... महामृत्युंजय मंत्र 🌺',
  'मन शांत, मन में शिव... शिव शरणं गच्छामि 🙏',
];

export const ShareCardRenderer: React.FC<ShareCardRendererProps> = ({
  template,
  userName: initialUserName,
  customText: initialCustomText,
}) => {
  const { theme } = useTheme();
  const viewShotRef = useRef<any>(null);
  const [userName, setUserName] = useState<string>(initialUserName || 'शिव शिष्य');
  const [customMessage, setCustomMessage] = useState<string>(
    initialCustomText || template.defaultText
  );

  useEffect(() => {
    if (initialUserName) {
      setUserName(initialUserName);
    } else {
      StorageService.getPreferences().then((p) => {
        const formatted = getFormattedUserName(p);
        if (formatted) setUserName(formatted);
      });
    }
  }, [initialUserName]);

  // Customization Options
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16'>('1:1');
  const [usePhotoBg, setUsePhotoBg] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(20);
  const [headerTitle, setHeaderTitle] = useState<string>('शिव चर्चा • पावन संदेश');

  const handleShare = async () => {
    const formattedMessage = `"${customMessage}"\n- ${userName || 'शिव शिष्य'}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`;

    try {
      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        const uri = await viewShotRef.current.capture();

        if (Platform.OS === 'web' && typeof document !== 'undefined') {
          // Web direct image download
          try {
            const link = document.createElement('a');
            link.href = uri;
            link.download = `shiv-charcha-card-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (webErr) {}

          await safeShare({
            title: 'शिव चर्चा शेयर कार्ड',
            message: formattedMessage,
          });
          return;
        }

        // Native iOS/Android Sharing
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          await safeShare({
            title: 'शिव चर्चा शेयर कार्ड',
            message: formattedMessage,
            url: uri,
          });
        }
      } else {
        await safeShare({
          title: 'शिव चर्चा शेयर कार्ड',
          message: formattedMessage,
        });
      }
    } catch (e) {
      await safeShare({
        title: 'शिव चर्चा शेयर कार्ड',
        message: formattedMessage,
      });
    }
  };

  const isVertical = aspectRatio === '9:16';

  return (
    <View style={styles.outerContainer}>
      {/* Aspect Ratio & Photo BG Quick Controls */}
      <View style={styles.topControlRow}>
        <View style={styles.pillGroup}>
          <TouchableOpacity
            style={[
              styles.aspectPill,
              {
                backgroundColor: aspectRatio === '1:1' ? theme.primary : theme.surfaceElevated,
                borderColor: aspectRatio === '1:1' ? theme.accent : theme.border,
              },
            ]}
            onPress={() => setAspectRatio('1:1')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.aspectPillText,
                { color: aspectRatio === '1:1' ? theme.textWhite : theme.textPrimary },
              ]}
            >
              ⬛ 1:1 Square (Status)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.aspectPill,
              {
                backgroundColor: aspectRatio === '9:16' ? theme.primary : theme.surfaceElevated,
                borderColor: aspectRatio === '9:16' ? theme.accent : theme.border,
              },
            ]}
            onPress={() => setAspectRatio('9:16')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.aspectPillText,
                { color: aspectRatio === '9:16' ? theme.textWhite : theme.textPrimary },
              ]}
            >
              📱 9:16 Story / Reel
            </Text>
          </TouchableOpacity>
        </View>

        {template.artworkUrl && (
          <TouchableOpacity
            style={[
              styles.photoBgToggle,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: usePhotoBg ? theme.accent : theme.border,
              },
            ]}
            onPress={() => setUsePhotoBg(!usePhotoBg)}
            activeOpacity={0.8}
          >
            <Text style={[styles.photoBgToggleText, { color: theme.primary }]}>
              {usePhotoBg ? '🖼️ फोटो बैकग्राउंड (ON)' : '🎨 केवल रंग (OFF)'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Captured Card Component (With Outer Inset Padding & Inner Ornamental Frame) */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 0.98 }}
        style={[
          styles.cardContainer,
          isVertical ? styles.cardVertical : styles.cardSquare,
          {
            backgroundColor: template.bgGradient[0],
            borderColor: template.accentColor || theme.accent,
          },
        ]}
      >
        {/* Optional Artwork Overlay */}
        {usePhotoBg && template.artworkUrl && (
          <Image source={{ uri: template.artworkUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        )}

        {/* Inner Framed Container with Horizontal & Vertical Padding */}
        <View style={styles.cardPaddingWrapper}>
          <View
            style={[
              styles.innerBorderFrame,
              {
                borderColor: template.accentColor || theme.accent,
                backgroundColor: usePhotoBg ? 'rgba(15, 23, 42, 0.78)' : 'rgba(0, 0, 0, 0.22)',
              },
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <Text style={[styles.cardOm, { color: template.accentColor || theme.textGold }]}>ॐ</Text>
              <View>
                <Text style={[styles.headerTag, { color: template.accentColor || theme.textGold }]}>
                  {headerTitle}
                </Text>
                <Text style={styles.headerSub}>हर हर महादेव 🔱</Text>
              </View>
            </View>

            {/* Quote Body with Horizontal Padding */}
            <View style={styles.quoteBox}>
              <Text style={[styles.quoteMark, { color: template.accentColor || theme.textGold }]}>“</Text>
              <Text style={[styles.quoteText, { color: '#FFFFFF', fontSize }]}>
                {customMessage}
              </Text>
              <Text style={[styles.quoteMarkRight, { color: template.accentColor || theme.textGold }]}>”</Text>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <Text style={[styles.authorText, { color: template.accentColor || theme.textGold }]}>
                - {userName || 'शिव शिष्य'}
              </Text>
              <View style={styles.brandRow}>
                <Text style={[styles.brandBadge, { color: template.accentColor || theme.textGold }]}>
                  शिव चर्चा ऐप
                </Text>
                <Text style={styles.brandText}>| गुरुभक्ति संदेश</Text>
              </View>
            </View>
          </View>
        </View>
      </ViewShot>

      {/* Control Box: Edit Text, Name, Font Size, Presets */}
      <View style={[styles.controlsBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>✍️ कार्ड कस्टमाइज़ करें</Text>

        {/* Preset Quotes Chooser */}
        <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>💡 लोकप्रिय शिव विचार चुनें:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
          {PRESET_QUOTES.map((quote, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.presetChip,
                { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
              ]}
              onPress={() => setCustomMessage(quote)}
              activeOpacity={0.8}
            >
              <Text style={[styles.presetChipText, { color: theme.textPrimary }]} numberOfLines={1}>
                {quote}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Custom Message Input */}
        <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>अपना विचार / संदेश बदलें:</Text>
        <TextInput
          style={[
            styles.textInput,
            styles.multilineInput,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
          value={customMessage}
          onChangeText={setCustomMessage}
          multiline
          numberOfLines={3}
          placeholder="अपना पावन संदेश लिखें..."
          placeholderTextColor={theme.textMuted}
        />

        {/* User Name Input */}
        <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>आपका नाम (Author Name):</Text>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
          value={userName}
          onChangeText={setUserName}
          placeholder="आपका नाम..."
          placeholderTextColor={theme.textMuted}
        />

        {/* Font Size Adjuster */}
        <View style={styles.fontSizeRow}>
          <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>अक्षर आकार (Font Size):</Text>
          <View style={styles.fontSizeBtns}>
            <TouchableOpacity
              style={[styles.sizeBtn, { backgroundColor: theme.primary }]}
              onPress={() => setFontSize((prev) => Math.max(15, prev - 2))}
              activeOpacity={0.8}
            >
              <Text style={[styles.sizeBtnText, { color: theme.textWhite }]}>A-</Text>
            </TouchableOpacity>

            <Text style={[styles.sizeValText, { color: theme.textPrimary }]}>{fontSize}px</Text>

            <TouchableOpacity
              style={[styles.sizeBtn, { backgroundColor: theme.primary }]}
              onPress={() => setFontSize((prev) => Math.min(32, prev + 2))}
              activeOpacity={0.8}
            >
              <Text style={[styles.sizeBtnText, { color: theme.textWhite }]}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share / Download Action Button */}
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: theme.primary }]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Text style={[styles.shareButtonText, { color: theme.textWhite }]}>
            {Platform.OS === 'web' ? '📥 कार्ड डाउनलोड व शेयर करें' : '🖼️ कार्ड इमेज शेयर करें'}
          </Text>
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
  topControlRow: {
    width: '100%',
    marginBottom: 14,
    alignItems: 'center',
    gap: 8,
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  aspectPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  aspectPillText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  photoBgToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  photoBgToggleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    ...shadows.medium,
  },
  cardSquare: {
    aspectRatio: 1.0,
  },
  cardVertical: {
    aspectRatio: 0.62, // 9:16 approximation
  },
  cardPaddingWrapper: {
    flex: 1,
    padding: 12, // Outer horizontal & vertical breathing padding
  },
  innerBorderFrame: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 18, // Generous horizontal side padding
    paddingVertical: 16, // Generous vertical padding
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardOm: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 4,
  },
  headerTag: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  quoteBox: {
    paddingHorizontal: 12, // Additional horizontal padding so quote text doesn't touch frame borders
    marginVertical: 10,
    alignItems: 'center',
  },
  quoteMark: {
    fontSize: 32,
    lineHeight: 26,
    alignSelf: 'flex-start',
  },
  quoteMarkRight: {
    fontSize: 32,
    lineHeight: 26,
    alignSelf: 'flex-end',
  },
  quoteText: {
    fontWeight: 'bold',
    lineHeight: 28,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginVertical: 2,
  },
  cardFooter: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    paddingTop: 10,
  },
  authorText: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  brandBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  brandText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  controlsBox: {
    width: '100%',
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    ...shadows.soft,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    maxWidth: 220,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },
  multilineInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  fontSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  fontSizeBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sizeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sizeBtnText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  sizeValText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  shareButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    ...shadows.soft,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
