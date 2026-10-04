import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { ShivlingShrine } from './ShivlingShrine';
import { PujaMantraCard, OfferingType } from './PujaMantraCard';
import { safeShare } from '../../services/shareService';

type PujaMode = 'freeform' | 'sankalp' | 'aarti';

interface OfferingState {
  flowers: number;
  belpatra: number;
  waterCount: number;
  milkCount: number;
  diyaLit: boolean;
  garlandPlaced: boolean;
  dhoopActive: boolean;
}

export const ShivlingPujaCanvas: React.FC = () => {
  const { theme } = useTheme();
  const { playTrack, pauseTrack, isPlaying } = useAudio();

  const [mode, setMode] = useState<PujaMode>('freeform');
  const [activeOffering, setActiveOffering] = useState<OfferingType>(null);
  const [sankalpTarget, setSankalpTarget] = useState<number>(108);
  const [isWaterFlowing, setIsWaterFlowing] = useState<boolean>(false);
  const [isMilkFlowing, setIsMilkFlowing] = useState<boolean>(false);

  const [offerings, setOfferings] = useState<OfferingState>({
    flowers: 0,
    belpatra: 0,
    waterCount: 0,
    milkCount: 0,
    diyaLit: false,
    garlandPlaced: false,
    dhoopActive: false,
  });

  const bellPlayerRef = useRef<any>(null);
  const shankhPlayerRef = useRef<any>(null);
  const waterPlayerRef = useRef<any>(null);
  const damruPlayerRef = useRef<any>(null);

  // Component-level sound effect initialization using expo-audio
  useEffect(() => {
    if (Platform.OS === 'web') return;
    try {
      const { createAudioPlayer } = require('expo-audio');
      bellPlayerRef.current = createAudioPlayer(require('../../../assets/sounds/bell.mp3'));
      shankhPlayerRef.current = createAudioPlayer(require('../../../assets/sounds/shankh.mp3'));
      waterPlayerRef.current = createAudioPlayer(require('../../../assets/sounds/water.mp3'));
      damruPlayerRef.current = createAudioPlayer(require('../../../assets/sounds/damru.mp3'));
    } catch (e) {
      console.warn('ShivlingPujaCanvas sound load warning:', e);
    }

    return () => {
      try {
        if (bellPlayerRef.current && bellPlayerRef.current.remove) bellPlayerRef.current.remove();
        if (shankhPlayerRef.current && shankhPlayerRef.current.remove) shankhPlayerRef.current.remove();
        if (waterPlayerRef.current && waterPlayerRef.current.remove) waterPlayerRef.current.remove();
        if (damruPlayerRef.current && damruPlayerRef.current.remove) damruPlayerRef.current.remove();
      } catch (e) {}
    };
  }, []);

  const playBell = async () => {
    if (bellPlayerRef.current) {
      try {
        if (bellPlayerRef.current.seekTo) bellPlayerRef.current.seekTo(0);
        bellPlayerRef.current.play();
      } catch (e) {}
    }
  };

  const playShankh = async () => {
    if (shankhPlayerRef.current) {
      try {
        if (shankhPlayerRef.current.seekTo) shankhPlayerRef.current.seekTo(0);
        shankhPlayerRef.current.play();
      } catch (e) {}
    }
  };

  const playWater = async () => {
    if (waterPlayerRef.current) {
      try {
        if (waterPlayerRef.current.seekTo) waterPlayerRef.current.seekTo(0);
        waterPlayerRef.current.play();
      } catch (e) {}
    }
  };

  const playDamru = async () => {
    if (damruPlayerRef.current) {
      try {
        if (damruPlayerRef.current.seekTo) damruPlayerRef.current.seekTo(0);
        damruPlayerRef.current.play();
      } catch (e) {}
    }
  };

  const totalOfferingsCount =
    offerings.flowers + offerings.belpatra + offerings.waterCount + offerings.milkCount;

  const triggerHaptic = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {}
  };

  const handleOffering = (type: NonNullable<OfferingType>) => {
    triggerHaptic();
    setActiveOffering(type);

    if (type === 'flower') {
      setOfferings((prev) => ({ ...prev, flowers: prev.flowers + 1 }));
    } else if (type === 'belpatra') {
      setOfferings((prev) => ({ ...prev, belpatra: prev.belpatra + 1 }));
    } else if (type === 'water') {
      setOfferings((prev) => ({ ...prev, waterCount: prev.waterCount + 1 }));
      setIsWaterFlowing(true);
      playWater();
      setTimeout(() => setIsWaterFlowing(false), 4500);
    } else if (type === 'milk') {
      setOfferings((prev) => ({ ...prev, milkCount: prev.milkCount + 1 }));
      setIsMilkFlowing(true);
      playWater();
      setTimeout(() => setIsMilkFlowing(false), 4500);
    } else if (type === 'diya') {
      setOfferings((prev) => ({ ...prev, diyaLit: !prev.diyaLit }));
    } else if (type === 'garland') {
      setOfferings((prev) => ({ ...prev, garlandPlaced: !prev.garlandPlaced }));
    } else if (type === 'bell') {
      playBell();
    } else if (type === 'shankh') {
      playShankh();
    } else if (type === 'damru') {
      playDamru();
    }

    // Sankalp Completion Check
    if (mode === 'sankalp') {
      const nextTotal = totalOfferingsCount + 1;
      if (nextTotal >= sankalpTarget) {
        playBell();
        Alert.alert(
          '🔱 संकल्प पूर्ण हुआ!',
          `हर हर महादेव! आपका ${sankalpTarget} मन्त्र/पुष्प समर्पण का संकल्प सफलतापूर्वक पूर्ण हुआ। शिव गुरु का आशीर्वाद सदा आप पर बना रहे।`,
          [{ text: 'ॐ नमः शिवाय 🙏' }]
        );
      }
    }
  };

  const toggleAartiMode = () => {
    triggerHaptic();
    if (mode === 'aarti') {
      setMode('freeform');
    } else {
      setMode('aarti');
      playBell();
      setOfferings((prev) => ({ ...prev, diyaLit: true }));
    }
  };

  const toggleBackgroundChanting = async () => {
    triggerHaptic();
    if (isPlaying) {
      await pauseTrack();
    } else {
      await playTrack({
        id: 'puja_om_namah_shivaya',
        title: 'ॐ नमः शिवाय (शिव धुन)',
        category: 'mantra',
        artist: 'शिव चर्चा भक्ति धारा',
        audioUrl: 'https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/audio/108_om_namah_shivaya_chant.mp3',
        coverImage: '',
        duration: 300,
      });
    }
  };

  const resetPuja = () => {
    triggerHaptic();
    setOfferings({
      flowers: 0,
      belpatra: 0,
      waterCount: 0,
      milkCount: 0,
      diyaLit: false,
      garlandPlaced: false,
      dhoopActive: false,
    });
    setActiveOffering(null);
  };

  const sharePujaBlessing = async () => {
    triggerHaptic();
    const message =
      `🔱 *शिव लिंग पूजन सेवा - शिव चर्चा ऐप* 🔱\n\n` +
      `आज मैंने भावपूर्वक शिव लिंग पर अर्पण किया:\n` +
      `🌸 पुष्प: ${offerings.flowers} बार\n` +
      `🍃 बिल्वपत्र: ${offerings.belpatra} बार\n` +
      `💧 जलधारा: ${offerings.waterCount} बार\n` +
      `🥛 दुग्धधारा: ${offerings.milkCount} बार\n\n` +
      `*ॐ नमः शिवाय!* शिव गुरु सब पर अपनी असीम अनुकंपा बनाए रखें। 🙏✨\n\n` +
      `आप भी घर बैठे डिजिटल शिव पूजा करें - डाउनलोड करें शिव चर्चा ऐप।`;

    await safeShare({
      title: 'शिव पूजन आशीर्वाद',
      message,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Puja Mode Switcher Pills */}
      <View style={[styles.modeBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'freeform' && { backgroundColor: theme.primary }]}
          onPress={() => setMode('freeform')}
        >
          <Text style={[styles.modeTabText, mode === 'freeform' ? { color: '#FFF' } : { color: theme.textSecondary }]}>
            🌱 स्वतंत्र पूजा
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, mode === 'sankalp' && { backgroundColor: theme.primary }]}
          onPress={() => setMode('sankalp')}
        >
          <Text style={[styles.modeTabText, mode === 'sankalp' ? { color: '#FFF' } : { color: theme.textSecondary }]}>
            📿 संकल्प ({sankalpTarget})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, mode === 'aarti' && { backgroundColor: colors.goldPrimary }]}
          onPress={toggleAartiMode}
        >
          <Text style={[styles.modeTabText, mode === 'aarti' ? { color: colors.maroonDark } : { color: theme.textSecondary }]}>
            🪔 महा आरती
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sankalp Mode Target Selector Bar */}
      {mode === 'sankalp' && (
        <View style={[styles.sankalpBar, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
          <Text style={[styles.sankalpText, { color: theme.textGold }]}>
            संकल्प लक्ष्य ({totalOfferingsCount} / {sankalpTarget}):
          </Text>
          <View style={styles.sankalpBtnRow}>
            {[11, 21, 108].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.sankalpPill,
                  sankalpTarget === count && { backgroundColor: theme.accent },
                ]}
                onPress={() => setSankalpTarget(count)}
              >
                <Text
                  style={[
                    styles.sankalpPillText,
                    sankalpTarget === count ? { color: theme.primaryDark, fontWeight: 'bold' } : { color: theme.textPrimary },
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Digital Shivling Shrine Canvas with Overlay Offering Buttons distributed along the borders */}
      <ShivlingShrine
        diyaLit={offerings.diyaLit}
        garlandPlaced={offerings.garlandPlaced}
        isWaterFlowing={isWaterFlowing}
        isMilkFlowing={isMilkFlowing}
        flowersCount={offerings.flowers}
        belpatraCount={offerings.belpatra}
        isAartiActive={mode === 'aarti'}
        isDhoopActive={offerings.dhoopActive}
      >
        {/* Top Floating Header Bar on Shrine Canvas */}
        <View style={styles.topHeaderBar}>
          {/* Top-Left Floating Reset Button */}
          <TouchableOpacity style={styles.topLeftResetBtn} onPress={resetPuja} activeOpacity={0.75}>
            <Text style={styles.topLeftResetText}>↺ रीसेट</Text>
          </TouchableOpacity>

          {/* Top-Center Temple Sound Instruments: Ghanti, Shankh & Damru */}
          <View style={styles.topCenterInstrumentsRow}>
            <TouchableOpacity
              style={styles.topInstrumentPill}
              onPress={() => handleOffering('bell')}
              activeOpacity={0.75}
            >
              <Text style={styles.topInstrumentIcon}>🔔</Text>
              <Text style={styles.topInstrumentLabel}>घंटी</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topInstrumentPill}
              onPress={() => handleOffering('shankh')}
              activeOpacity={0.75}
            >
              <Text style={styles.topInstrumentIcon}>🐚</Text>
              <Text style={styles.topInstrumentLabel}>शंख</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topInstrumentPill}
              onPress={() => handleOffering('damru')}
              activeOpacity={0.75}
            >
              <Text style={styles.topInstrumentIcon}>🪘</Text>
              <Text style={styles.topInstrumentLabel}>डमरू</Text>
            </TouchableOpacity>
          </View>

          {/* Top-Right Shiv Dhun Audio Toggle */}
          <TouchableOpacity style={styles.topRightChantingBtn} onPress={toggleBackgroundChanting} activeOpacity={0.75}>
            <Text style={styles.topRightChantingText}>
              {isPlaying ? '🔊 धुन बंद' : '🎵 शिव धुन'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Left Border Column (3 offering buttons equally scattered & vertically centered) */}
        <View style={styles.leftBorderColumn}>
          <TouchableOpacity
            style={styles.borderPillBtn}
            onPress={() => handleOffering('flower')}
            activeOpacity={0.75}
          >
            <Text style={styles.borderIcon}>🌸</Text>
            <Text style={styles.borderLabel}>पुष्प</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.borderPillBtn}
            onPress={() => handleOffering('belpatra')}
            activeOpacity={0.75}
          >
            <Text style={styles.borderIcon}>🍃</Text>
            <Text style={styles.borderLabel}>बेलपत्र</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.borderPillBtn}
            onPress={() => handleOffering('water')}
            activeOpacity={0.75}
          >
            <Text style={styles.borderIcon}>🏺</Text>
            <Text style={styles.borderLabel}>जलधारा</Text>
          </TouchableOpacity>
        </View>

        {/* Right Border Column (3 offering buttons equally scattered & vertically centered) */}
        <View style={styles.rightBorderColumn}>
          <TouchableOpacity
            style={[styles.borderPillBtn, offerings.garlandPlaced && styles.borderPillActiveGold]}
            onPress={() => handleOffering('garland')}
            activeOpacity={0.75}
          >
            <Text style={styles.borderIcon}>🌺</Text>
            <Text style={styles.borderLabel}>माला</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.borderPillBtn, offerings.diyaLit && styles.borderPillActiveGold]}
            onPress={() => handleOffering('diya')}
            activeOpacity={0.75}
          >
            <Text style={styles.borderIcon}>🪔</Text>
            <Text style={styles.borderLabel}>दीपक</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.borderPillBtn}
            onPress={() => handleOffering('milk')}
            activeOpacity={0.75}
          >
            <Text style={styles.borderIcon}>🏺</Text>
            <Text style={styles.borderLabel}>दुग्धधारा</Text>
          </TouchableOpacity>
        </View>
      </ShivlingShrine>

      {/* Devotional Sanskrit Mantra Card */}
      <PujaMantraCard activeOffering={activeOffering} />

      {/* Action Row: Reset & Share */}
      <View style={[styles.actionsBar, { backgroundColor: theme.cardBg, borderColor: theme.border, marginTop: 8 }]}>
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.resetBtn} onPress={resetPuja} activeOpacity={0.7}>
            <Text style={[styles.resetText, { color: theme.textSecondary }]}>↺ पुन: पूजा आरम्भ करें</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: theme.primary }]}
            onPress={sharePujaBlessing}
            activeOpacity={0.8}
          >
            <Text style={styles.shareBtnText}>✨ पूजा आशीर्वाद शेयर करें</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  modeBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sankalpBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  sankalpText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sankalpBtnRow: {
    flexDirection: 'row',
  },
  sankalpPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginLeft: 6,
  },
  sankalpPillText: {
    fontSize: 12,
  },
  actionsBar: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    ...shadows.soft,
  },
  topHeaderBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 60,
  },
  topLeftResetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 4, 8, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  topLeftResetText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF8DC',
  },
  topCenterInstrumentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topInstrumentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 4, 8, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    marginHorizontal: 3,
  },
  topInstrumentIcon: {
    fontSize: 15,
  },
  topInstrumentLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF8DC',
    marginLeft: 3,
  },
  topRightChantingBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 4, 8, 0.85)',
    borderWidth: 1,
    borderColor: colors.goldPrimary,
  },
  topRightChantingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  leftBorderColumn: {
    position: 'absolute',
    left: 10,
    top: 60,
    bottom: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 60,
  },
  rightBorderColumn: {
    position: 'absolute',
    right: 10,
    top: 60,
    bottom: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 60,
  },
  borderPillBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(20, 4, 8, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.soft,
  },
  borderPillActiveGold: {
    borderColor: colors.goldPrimary,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  borderBadgeCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.goldPrimary,
    color: colors.maroonDark,
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 10,
  },
  borderIcon: {
    fontSize: 20,
  },
  borderLabel: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#FFF8DC',
    marginTop: 1,
  },
  chantingToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  chantingToggleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.goldPrimary,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '23%',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.goldPrimary,
    color: colors.maroonDark,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.15)',
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  resetText: {
    fontSize: 11,
  },
  shareBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    ...shadows.soft,
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
