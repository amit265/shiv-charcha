import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { quotesList, ShivQuote } from '@/content/quotes';
import { shivaBackgrounds } from '@/constants/shivaImages';
import { colors, shadows } from '@/theme/colors';
import { safeShare } from '@/services/shareService';
import { useAudio } from '@/context/AudioContext';
import { NativeAdCard } from '@/components/common/NativeAdCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReelItemProps {
  quote: ShivQuote;
  index: number;
  onClose: () => void;
}

const SingleReelItem: React.FC<ReelItemProps> = ({ quote, index, onClose }) => {
  const insets = useSafeAreaInsets();
  const { playSoundEffect } = useAudio();
  const viewShotRef = useRef<any>(null);

  const [bgIndex, setBgIndex] = useState<number>(index % shivaBackgrounds.length);
  const [likes, setLikes] = useState<number>(Math.floor(108 + ((index * 37) % 500)));
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const triggerHaptic = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {}
  };

  const handleLike = () => {
    triggerHaptic();
    playSoundEffect('chime');
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleCycleBg = () => {
    triggerHaptic();
    setBgIndex((prev) => (prev + 1) % shivaBackgrounds.length);
  };

  const handleShare = async () => {
    triggerHaptic();
    const shareMessage = `🌸 *शिव चर्चा पावन विचार* 🌸\n\n"${quote.quote}"\n\n- ${quote.author}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`;

    try {
      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        const uri = await viewShotRef.current.capture();

        if (Platform.OS === 'web' && typeof document !== 'undefined') {
          try {
            const link = document.createElement('a');
            link.href = uri;
            link.download = `shiv-charcha-quote-${quote.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (e) {}

          await safeShare({
            title: quote.category,
            message: shareMessage,
          });
          return;
        }

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          await safeShare({
            title: quote.category,
            message: shareMessage,
            url: uri,
          });
        }
      } else {
        await safeShare({
          title: quote.category,
          message: shareMessage,
        });
      }
    } catch (err) {
      await safeShare({
        title: quote.category,
        message: shareMessage,
      });
    }
  };

  const handleSaveImage = async () => {
    triggerHaptic();
    setIsSaving(true);
    try {
      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        const uri = await viewShotRef.current.capture();

        if (Platform.OS === 'web' && typeof document !== 'undefined') {
          const link = document.createElement('a');
          link.href = uri;
          link.download = `shiv-charcha-quote-${quote.id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          Alert.alert('सफलता 🙏', 'शिव चर्चा चित्र क्लिपबोर्ड/डाउनलोड में सहेजा गया!');
        } else if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('सफलता 🙏', 'चित्र शेयरिंग उपलब्ध है!');
        }
      }
    } catch (err) {
      Alert.alert('त्रुटि', 'चित्र सहेजने में समस्या आई।');
    } finally {
      setIsSaving(false);
    }
  };

  const topInsetPadding = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44) + 8;
  const bottomInsetPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0) + 12;

  return (
    <View style={styles.reelItemContainer}>
      {/* ViewShot Container for Image Capturing */}
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }} style={styles.viewShotFrame}>
        <ImageBackground
          source={shivaBackgrounds[bgIndex]}
          style={styles.bgImage}
          resizeMode="cover"
        >
          {/* Dark Overlay Vignette for High Contrast Typography */}
          <View style={styles.darkGradientOverlay} />

          {/* Top Bar inside Reel */}
          <View style={[styles.topHeader, { paddingTop: topInsetPadding }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode="tail">
                🌺 {quote.category}
              </Text>
            </View>

            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{index + 1} / {quotesList.length}</Text>
            </View>
          </View>

          {/* Center Card with Devotional Quote */}
          <View style={styles.quoteCardCenter}>
            <View style={styles.omWatermark}>
              <Text style={styles.omText}>ॐ</Text>
            </View>

            <Text style={styles.quoteSymbolOpen}>“</Text>
            <Text
              style={[
                styles.quoteBodyText,
                quote.quote.length > 120
                  ? { fontSize: 17, lineHeight: 25 }
                  : quote.quote.length > 70
                  ? { fontSize: 19, lineHeight: 28 }
                  : { fontSize: 21, lineHeight: 31 },
              ]}
            >
              {quote.quote}
            </Text>
            <Text style={styles.quoteSymbolClose}>”</Text>

            <View style={styles.authorDivider} />
            <Text style={styles.authorText}>- {quote.author}</Text>
            <Text style={styles.appBrandingText}>शिव चर्चा • हर हर महादेव 🙏</Text>
          </View>
        </ImageBackground>
      </ViewShot>

      {/* Right Actions Bar Overlay */}
      <View style={[styles.rightActionsPanel, { bottom: bottomInsetPadding + 50 }]}>
        {/* Heart / Blessing Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.8}>
          <View style={[styles.actionIconCircle, isLiked && styles.actionIconCircleActive]}>
            <Text style={styles.actionEmoji}>{isLiked ? '❤️' : '🌸'}</Text>
          </View>
          <Text style={styles.actionLabel}>{likes}</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.8}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionEmoji}>📤</Text>
          </View>
          <Text style={styles.actionLabel}>शेयर</Text>
        </TouchableOpacity>

        {/* Save Image Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleSaveImage} activeOpacity={0.8}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionEmoji}>💾</Text>
          </View>
          <Text style={styles.actionLabel}>{isSaving ? '...' : 'सहेजें'}</Text>
        </TouchableOpacity>

        {/* Cycle Wallpaper Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleCycleBg} activeOpacity={0.8}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionEmoji}>🎨</Text>
          </View>
          <Text style={styles.actionLabel}>वॉलपेपर</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Hint Indicator */}
      <View style={[styles.bottomHint, { paddingBottom: bottomInsetPadding }]}>
        <Text style={styles.hintText}>ऊपर स्क्रॉल करें 👆</Text>
      </View>
    </View>
  );
};
const FullScreenNativeAdReel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const [adLoaded, setAdLoaded] = useState<boolean | null>(null);
  const topInsetPadding = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44) + 8;
  const bottomInsetPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0) + 12;

  return (
    <View style={styles.reelItemContainer}>
      <View style={styles.bgImage}>
        <View style={styles.darkGradientOverlay} />
        <View style={[styles.topHeader, { paddingTop: topInsetPadding }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode="tail">
              📢 प्रायोजित संदेश
            </Text>
          </View>
        </View>

        {adLoaded !== false ? (
          <View style={adLoaded ? styles.quoteCardCenter : styles.hiddenAdContainer}>
            {adLoaded && (
              <Text style={{ fontSize: 13, color: colors.goldLight, marginBottom: 12, fontWeight: 'bold' }}>
                🌸 प्रायोजित संदेश
              </Text>
            )}
            <NativeAdCard
              forceShow
              onAdLoaded={() => setAdLoaded(true)}
              onAdFailedToLoad={() => setAdLoaded(false)}
            />
          </View>
        ) : (
          <View style={styles.quoteCardCenter}>
            <View style={styles.omWatermark}>
              <Text style={styles.omText}>🕉️</Text>
            </View>
            <Text style={styles.quoteBodyText}>
              {'"'}हर हर महादेव • ॐ नमः शिवाय{'"'}
            </Text>
            <View style={styles.authorDivider} />
            <Text style={styles.authorText}>शिव महिमा 🔱</Text>
          </View>
        )}
      </View>
      <View style={[styles.bottomHint, { paddingBottom: bottomInsetPadding }]}>
        <Text style={styles.hintText}>ऊपर स्क्रॉल करें 👆</Text>
      </View>
    </View>
  );
};

export default function ReelsScreen() {
  const router = useRouter();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)' as any);
    }
  };

  const mixedData = React.useMemo(() => {
    const items: Array<{ id: string; type: 'quote' | 'ad'; quote?: ShivQuote; quoteIndex?: number }> = [];
    quotesList.forEach((quote, idx) => {
      items.push({ id: quote.id, type: 'quote', quote, quoteIndex: idx });
      if ((idx + 1) % 5 === 0) {
        items.push({ id: `ad-${idx}`, type: 'ad' });
      }
    });
    return items;
  }, []);

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={mixedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          if (item.type === 'ad') {
            return <FullScreenNativeAdReel onClose={handleClose} />;
          }
          return <SingleReelItem quote={item.quote!} index={item.quoteIndex!} onClose={handleClose} />;
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  reelItemContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
    backgroundColor: '#000000',
  },
  viewShotFrame: {
    width: '100%',
    height: '100%',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 5, 8, 0.58)',
  },
  topHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  closeIcon: {
    fontSize: 16,
    color: colors.bgIvory,
    fontWeight: 'bold',
  },
  categoryBadge: {
    backgroundColor: colors.maroonPrimary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.goldPrimary,
    maxWidth: '58%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: colors.goldLight,
    textAlign: 'center',
  },
  counterBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 12,
    color: colors.bgIvory,
    fontWeight: '600',
  },
  quoteCardCenter: {
    width: '86%',
    backgroundColor: 'rgba(54, 8, 15, 0.72)',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
    borderWidth: 1.8,
    borderColor: colors.goldPrimary,
    ...shadows.gold,
  },
  hiddenAdContainer: {
    height: 0,
    width: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  omWatermark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  omText: {
    fontSize: 26,
    color: colors.maroonDark,
    fontWeight: 'bold',
  },
  quoteSymbolOpen: {
    fontSize: 36,
    color: colors.goldPrimary,
    fontWeight: 'bold',
    marginBottom: -10,
    alignSelf: 'flex-start',
  },
  quoteBodyText: {
    fontSize: 21,
    lineHeight: 32,
    fontWeight: 'bold',
    color: colors.goldLight,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  quoteSymbolClose: {
    fontSize: 36,
    color: colors.goldPrimary,
    fontWeight: 'bold',
    marginTop: -10,
    alignSelf: 'flex-end',
  },
  authorDivider: {
    width: 60,
    height: 2,
    backgroundColor: colors.goldPrimary,
    marginVertical: 14,
  },
  authorText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.bgIvory,
  },
  appBrandingText: {
    fontSize: 11,
    color: colors.goldPrimary,
    marginTop: 8,
    opacity: 0.9,
  },
  rightActionsPanel: {
    position: 'absolute',
    right: 14,
    alignItems: 'center',
    zIndex: 10,
  },
  actionBtn: {
    alignItems: 'center',
    marginBottom: 18,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
    ...shadows.soft,
  },
  actionIconCircleActive: {
    backgroundColor: colors.maroonPrimary,
    borderColor: colors.goldLight,
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.bgIvory,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 10,
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
});
