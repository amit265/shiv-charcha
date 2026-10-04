import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Modal,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library/legacy';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header';
import { SmartBanner } from '@/components/common/SmartBanner';
import { useTheme } from '@/context/ThemeContext';
import { wallpapersData } from '@/content/wallpapers';
import { shivaBackgrounds, shivaHdUrls } from '@/constants/shivaImages';
import { shadows } from '@/theme/colors';
import { WallpaperItem } from '@/types';
import { safeShare } from '@/services/shareService';
import { setWallpaperDirect, WallpaperDestination } from '@/services/wallpaperService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type FilterCategory = 'all' | 'jyotirlinga' | 'swaroop' | 'himalaya' | 'mantra';

export default function GalleryScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperItem | null>(null);
  const [showMockClock, setShowMockClock] = useState<boolean>(true);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showSetModal, setShowSetModal] = useState<boolean>(false);
  const [wallpaperTargetItem, setWallpaperTargetItem] = useState<WallpaperItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const triggerHaptic = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {}
  };

  const filteredWallpapers = wallpapersData.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'jyotirlinga':
        return '🛕 ज्योतिर्लिंग';
      case 'swaroop':
        return '🔱 शिव स्वरूप';
      case 'himalaya':
        return '🏔️ हिमालय धाम';
      case 'mantra':
        return '📜 पावन मंत्र';
      default:
        return '🌸 शिव भक्ति';
    }
  };

  const downloadWallpaperToCache = async (item: WallpaperItem): Promise<string> => {
    const idx = item.imageIndex || 0;
    const assetSource = shivaBackgrounds[idx];
    const resolvedAsset = Image.resolveAssetSource(assetSource);
    const localAssetUri = resolvedAsset?.uri;

    const filename = `shiv_wallpaper_${item.id || idx}.webp`;
    const destinationFile = new File(Paths.cache, filename);

    // 1. Use local bundled asset first (instant, 0ms network latency, works 100% offline!)
    if (localAssetUri) {
      try {
        const downloadedFile = await File.downloadFileAsync(localAssetUri, destinationFile, { idempotent: true });
        return downloadedFile.uri;
      } catch (e) {
        console.warn('Local asset resolve error, using raw uri:', e);
        return localAssetUri;
      }
    }

    // 2. Fallback to remote CDN URL if needed
    const hdUrl = shivaHdUrls[idx];
    if (hdUrl) {
      const downloadedFile = await File.downloadFileAsync(hdUrl, destinationFile, { idempotent: true });
      return downloadedFile.uri;
    }

    throw new Error('No valid image URI found for wallpaper');
  };

  const handleApplyDirectWallpaper = async (item: WallpaperItem, destination: WallpaperDestination) => {
    triggerHaptic();
    setIsSaving(true);
    try {
      const localFileUri = await downloadWallpaperToCache(item);
      const applied = await setWallpaperDirect(localFileUri, destination);

      if (applied) {
        const destLabel = destination === 'home' ? 'होम स्क्रीन' : destination === 'lock' ? 'लॉक स्क्रीन' : 'होम व लॉक स्क्रीन';
        Alert.alert(
          '🌸 हर हर महादेव!',
          `"${item.title}" वॉलपेपर आपकी ${destLabel} पर सफलतापूर्वक सेट कर दिया गया है!`,
          [{ text: 'जय हो! 🙏' }]
        );
      } else {
        await handleSaveToGallery(item);
      }
    } catch (error) {
      console.warn('Direct wallpaper error:', error);
      Alert.alert(
        'सूचना',
        'चित्र को आपकी फोटो गैलरी में सहेजा जा रहा है, ताकि आप सेटिंग्स से लगा सकें।',
        [{ text: 'सहेजें', onPress: () => handleSaveToGallery(item) }]
      );
    } finally {
      setIsSaving(false);
      setShowSetModal(false);
    }
  };

  const handleSaveToGallery = async (item: WallpaperItem) => {
    triggerHaptic();
    setIsSaving(true);
    try {
      if (Platform.OS === 'web') {
        Alert.alert(
          'वॉलपेपर सहेजें',
          'वेब ब्राउज़र पर चित्र पर राइट-क्लिक करके या प्रेस करके डाउनलोड करें।'
        );
        return;
      }

      // Request media library permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'अनुमति आवश्यक है',
          'चित्र आपकी फोन गैलरी में सहेजने के लिए फोटो एक्सेस अनुमति की आवश्यकता है। कृपया सेटिंग्स से अनुमति प्रदान करें।',
          [{ text: 'ठीक है' }]
        );
        return;
      }

      // Download HD image file to cache directory first
      const localFileUri = await downloadWallpaperToCache(item);

      // Save local file URI directly to device photo gallery
      await MediaLibrary.saveToLibraryAsync(localFileUri);

      Alert.alert(
        '🌸 वॉलपेपर सहेजा गया!',
        `"${item.title}" चित्र (HD) आपकी फोन फोटो गैलरी में सफलतापूर्वक सहेज लिया गया है।\n\nआप अपने फोन की सेटिंग्स से भी इसे होम या लॉक स्क्रीन पर लगा सकते हैं।`,
        [
          { text: 'वॉलपेपर लगाने की विधि ➔', onPress: () => setShowGuideModal(true) },
          { text: 'जय हो! 🙏' },
        ]
      );
    } catch (error) {
      console.warn('Save wallpaper error:', error);
      Alert.alert(
        'त्रुटि',
        'चित्र आपकी फोटो गैलरी में सहेजने में विफल। कृपया पुन: प्रयास करें।',
        [{ text: 'शेयर करें', onPress: () => handleShareWallpaper(item) }, { text: 'बंद करें' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareWallpaper = async (item: WallpaperItem) => {
    triggerHaptic();
    try {
      if (Platform.OS === 'web') {
        await safeShare({
          title: item.title,
          message: `🌸 *शिव चर्चा पावन वॉलपेपर*: "${item.title}"\n\n${item.description || ''}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
        });
        return;
      }

      // Download HD image file to local cache first
      const localFileUri = await downloadWallpaperToCache(item);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(localFileUri, {
          mimeType: 'image/jpeg',
          dialogTitle: `🌸 ${item.title} - शिव चर्चा`,
          UTI: 'public.jpeg',
        });
      } else {
        await safeShare({
          title: item.title,
          message: `🌸 *शिव चर्चा पावन वॉलपेपर*: "${item.title}"\n\n${item.description || ''}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
        });
      }
    } catch (e) {
      console.warn('Share wallpaper error:', e);
      await safeShare({
        title: item.title,
        message: `🌸 *शिव चर्चा पावन वॉलपेपर*: "${item.title}"\n\n${item.description || ''}\n\nशिव चर्चा ऐप - हर हर महादेव 🙏`,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🖼️ पावन गैलरी व वॉलपेपर" subtitle="उच्च गुणवत्ता वाले 20 शिव वॉलपेपर" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro Section */}
        <View style={styles.introHeader}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>पावन शिव वॉलपेपर संग्रह 🖼️</Text>
          <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
            भगवान शिव के 20 उच्च गुणवत्ता (HD) वॉलपेपर देखें, लॉक-स्क्रीन पर देखें और अपने फोन पर सहेजें।
          </Text>
        </View>

        {/* Category Filter Pills Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: activeCategory === 'all' ? theme.primary : theme.surfaceElevated,
                borderColor: activeCategory === 'all' ? theme.accent : theme.border,
              },
            ]}
            onPress={() => {
              triggerHaptic();
              setActiveCategory('all');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: activeCategory === 'all' ? theme.textWhite : theme.textPrimary },
              ]}
            >
              🔥 सभी ({wallpapersData.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: activeCategory === 'jyotirlinga' ? theme.primary : theme.surfaceElevated,
                borderColor: activeCategory === 'jyotirlinga' ? theme.accent : theme.border,
              },
            ]}
            onPress={() => {
              triggerHaptic();
              setActiveCategory('jyotirlinga');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: activeCategory === 'jyotirlinga' ? theme.textWhite : theme.textPrimary },
              ]}
            >
              🛕 ज्योतिर्लिंग
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: activeCategory === 'swaroop' ? theme.primary : theme.surfaceElevated,
                borderColor: activeCategory === 'swaroop' ? theme.accent : theme.border,
              },
            ]}
            onPress={() => {
              triggerHaptic();
              setActiveCategory('swaroop');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: activeCategory === 'swaroop' ? theme.textWhite : theme.textPrimary },
              ]}
            >
              🔱 शिव स्वरूप
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: activeCategory === 'himalaya' ? theme.primary : theme.surfaceElevated,
                borderColor: activeCategory === 'himalaya' ? theme.accent : theme.border,
              },
            ]}
            onPress={() => {
              triggerHaptic();
              setActiveCategory('himalaya');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: activeCategory === 'himalaya' ? theme.textWhite : theme.textPrimary },
              ]}
            >
              🏔️ हिमालय धाम
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: activeCategory === 'mantra' ? theme.primary : theme.surfaceElevated,
                borderColor: activeCategory === 'mantra' ? theme.accent : theme.border,
              },
            ]}
            onPress={() => {
              triggerHaptic();
              setActiveCategory('mantra');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: activeCategory === 'mantra' ? theme.textWhite : theme.textPrimary },
              ]}
            >
              📜 पावन मंत्र
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 2-Column Responsive Image Grid */}
        <View style={styles.grid}>
          {filteredWallpapers.map((item) => {
            const imgSource = shivaBackgrounds[item.imageIndex || 0];
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
                onPress={() => {
                  triggerHaptic();
                  setSelectedWallpaper(item);
                  setShowMockClock(true);
                }}
                activeOpacity={0.88}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={imgSource} style={styles.image} resizeMode="cover" />
                  <View style={[styles.categoryBadge, { backgroundColor: 'rgba(0,0,0,0.65)' }]}>
                    <Text style={styles.categoryBadgeText}>{getCategoryLabel(item.category)}</Text>
                  </View>
                </View>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                  {item.title}
                </Text>

                <View style={styles.cardBtnRow}>
                  <TouchableOpacity
                    style={[styles.previewBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedWallpaper(item);
                      setShowMockClock(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.previewBtnText, { color: theme.primary }]}>👁️ देखें</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handleSaveToGallery(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.saveBtnText, { color: theme.textWhite }]}>⬇️ सहेजें</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* FULL-SCREEN WALLPAPER PREVIEW MODAL WITH MOCK LOCK SCREEN CLOCK TOGGLE */}
      {selectedWallpaper && (
        <Modal
          visible={Boolean(selectedWallpaper)}
          animationType="fade"
          transparent={false}
          onRequestClose={() => setSelectedWallpaper(null)}
        >
          <View style={styles.fullScreenModalBg}>
            <StatusBar hidden />

            {/* Background Fullscreen Wallpaper */}
            <Image
              source={shivaBackgrounds[selectedWallpaper.imageIndex || 0]}
              style={styles.fullScreenImage}
              resizeMode="cover"
            />

            {/* Mock Phone Lock-Screen Clock & Date Widget Overlay */}
            {showMockClock && (
              <View style={[styles.mockClockOverlay, { paddingTop: Math.max(insets.top, 50) }]} pointerEvents="none">
                <Text style={styles.mockClockTime}>07:30</Text>
                <Text style={styles.mockClockDate}>
                  {new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
                <Text style={styles.mockClockSub}>ॐ नमः शिवाय 🙏</Text>
              </View>
            )}

            {/* Top Modal Header Overlay Controls */}
            <View style={[styles.modalTopBar, { paddingTop: Math.max(insets.top, 16) }]}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => {
                  triggerHaptic();
                  setSelectedWallpaper(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕ बंद करें</Text>
              </TouchableOpacity>

              {/* Toggle Mock Lock-Screen Clock Button */}
              <TouchableOpacity
                style={[
                  styles.toggleClockBtn,
                  showMockClock && { backgroundColor: theme.accent, borderColor: theme.accent },
                ]}
                onPress={() => {
                  triggerHaptic();
                  setShowMockClock((prev) => !prev);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleClockText, showMockClock && { color: theme.primaryDark }]}>
                  {showMockClock ? '📱 घड़ी ओवरले: ON' : '📱 घड़ी ओवरले: OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Modal Action Controls */}
            <View style={[styles.modalBottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <Text style={styles.modalTitleText}>{selectedWallpaper.title}</Text>
              <Text style={styles.modalDescText}>{selectedWallpaper.description}</Text>

              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalActionBtnSave, { backgroundColor: theme.accent }]}
                  onPress={() => {
                    triggerHaptic();
                    setWallpaperTargetItem(selectedWallpaper);
                    setShowSetModal(true);
                  }}
                  activeOpacity={0.85}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color={theme.primaryDark} size="small" />
                  ) : (
                    <Text style={[styles.modalActionBtnSaveText, { color: theme.primaryDark }]}>
                      ✨ वॉलपेपर सेट करें
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalActionBtnShare, { backgroundColor: 'rgba(255,255,255,0.22)' }]}
                  onPress={() => handleShareWallpaper(selectedWallpaper)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalActionBtnShareText}>📤 शेयर</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalActionBtnGuide, { backgroundColor: 'rgba(255,255,255,0.22)' }]}
                  onPress={() => handleSaveToGallery(selectedWallpaper)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalActionBtnGuideText}>⬇️ सहेजें</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* DIRECT WALLPAPER TARGET SELECTION MODAL */}
      <Modal
        visible={showSetModal && Boolean(wallpaperTargetItem)}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSetModal(false)}
      >
        <View style={styles.guideModalOverlay}>
          <View style={[styles.guideModalCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
            <Text style={[styles.guideTitle, { color: theme.primary }]}>✨ वॉलपेपर कहाँ सेट करें?</Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary, textAlign: 'center', marginBottom: 16 }}>
              {wallpaperTargetItem?.title}
            </Text>

            <TouchableOpacity
              style={[styles.setOptionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
              onPress={() => wallpaperTargetItem && handleApplyDirectWallpaper(wallpaperTargetItem, 'home')}
              activeOpacity={0.8}
            >
              <Text style={[styles.setOptionBtnText, { color: theme.primary }]}>📱 होम स्क्रीन पर लगाएँ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.setOptionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
              onPress={() => wallpaperTargetItem && handleApplyDirectWallpaper(wallpaperTargetItem, 'lock')}
              activeOpacity={0.8}
            >
              <Text style={[styles.setOptionBtnText, { color: theme.primary }]}>🔒 लॉक स्क्रीन पर लगाएँ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.setOptionBtn, { backgroundColor: theme.primary, borderColor: theme.accent }]}
              onPress={() => wallpaperTargetItem && handleApplyDirectWallpaper(wallpaperTargetItem, 'both')}
              activeOpacity={0.8}
            >
              <Text style={[styles.setOptionBtnText, { color: theme.textWhite }]}>✨ दोनों स्क्रीन पर लगाएँ (Home + Lock)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.setOptionBtn, { backgroundColor: 'transparent', borderColor: theme.border }]}
              onPress={() => wallpaperTargetItem && handleSaveToGallery(wallpaperTargetItem)}
              activeOpacity={0.8}
            >
              <Text style={[styles.setOptionBtnText, { color: theme.textSecondary }]}>⬇️ केवल फोन गैलरी में सहेजें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.guideCloseBtn, { backgroundColor: 'rgba(0,0,0,0.1)', marginTop: 8 }]}
              onPress={() => setShowSetModal(false)}
              activeOpacity={0.85}
            >
              <Text style={[styles.guideCloseBtnText, { color: theme.textPrimary }]}>✕ रद्द करें</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* WALLPAPER APPLICATION GUIDANCE MODAL */}
      <Modal
        visible={showGuideModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGuideModal(false)}
      >
        <View style={styles.guideModalOverlay}>
          <View style={[styles.guideModalCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
            <Text style={[styles.guideTitle, { color: theme.primary }]}>📱 फोन पर वॉलपेपर कैसे लगाएँ?</Text>

            <View style={styles.guideStepItem}>
              <View style={[styles.guideStepNum, { backgroundColor: theme.primary }]}>
                <Text style={styles.guideStepNumText}>1</Text>
              </View>
              <Text style={[styles.guideStepText, { color: theme.textPrimary }]}>
                <Text style={{ fontWeight: 'bold' }}>{'"'}✨ वॉलपेपर सेट करें{'"'}</Text> बटन दबाकर सीधे होम या लॉक स्क्रीन पर लगाएँ।
              </Text>
            </View>

            <View style={styles.guideStepItem}>
              <View style={[styles.guideStepNum, { backgroundColor: theme.primary }]}>
                <Text style={styles.guideStepNumText}>2</Text>
              </View>
              <Text style={[styles.guideStepText, { color: theme.textPrimary }]}>
                या चित्र को फोन गैलरी में सहेजकर सेटिंग्स से चुनें।
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.guideCloseBtn, { backgroundColor: theme.primary }]}
              onPress={() => setShowGuideModal(false)}
              activeOpacity={0.85}
            >
              <Text style={[styles.guideCloseBtnText, { color: theme.textWhite }]}>समझ गया 🙏</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SmartBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  introHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48.5%',
    borderRadius: 18,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1.2,
    ...shadows.soft,
  },
  cardImageContainer: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#0F172A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBtnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  previewBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  previewBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  /* FULL SCREEN PREVIEW MODAL STYLES */
  fullScreenModalBg: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  fullScreenImage: {
    ...StyleSheet.absoluteFill,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  mockClockOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  mockClockTime: {
    fontSize: 64,
    fontWeight: '300',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  mockClockDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: -6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  mockClockSub: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  modalCloseBtn: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  toggleClockBtn: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  toggleClockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalBottomBar: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 20,
  },
  modalTitleText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalDescText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 17,
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modalActionBtnSave: {
    flex: 1.4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionBtnSaveText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalActionBtnShare: {
    flex: 0.8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modalActionBtnShareText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalActionBtnGuide: {
    flex: 0.8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modalActionBtnGuideText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  setOptionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  setOptionBtnText: {
    fontSize: 13.5,
    fontWeight: 'bold',
  },
  guideModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guideModalCard: {
    width: '100%',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  guideStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  guideStepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guideStepNumText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  guideStepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  guideCloseBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  guideCloseBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
