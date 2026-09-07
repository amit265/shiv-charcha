import React, { useState, useEffect } from 'react';
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
  const { playSoundEffect, playTrack, pauseTrack, isPlaying } = useAudio();

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
      playSoundEffect('chime');
    } else if (type === 'belpatra') {
      setOfferings((prev) => ({ ...prev, belpatra: prev.belpatra + 1 }));
      playSoundEffect('chime');
    } else if (type === 'water') {
      setOfferings((prev) => ({ ...prev, waterCount: prev.waterCount + 1 }));
      setIsWaterFlowing(true);
      playSoundEffect('water');
      setTimeout(() => setIsWaterFlowing(false), 4500);
    } else if (type === 'milk') {
      setOfferings((prev) => ({ ...prev, milkCount: prev.milkCount + 1 }));
      setIsMilkFlowing(true);
      playSoundEffect('water');
      setTimeout(() => setIsMilkFlowing(false), 4500);
    } else if (type === 'diya') {
      setOfferings((prev) => ({ ...prev, diyaLit: !prev.diyaLit }));
      playSoundEffect('chime');
    } else if (type === 'garland') {
      setOfferings((prev) => ({ ...prev, garlandPlaced: !prev.garlandPlaced }));
      playSoundEffect('chime');
    } else if (type === 'bell') {
      playSoundEffect('bell');
    } else if (type === 'shankh') {
      playSoundEffect('shankh');
    }

    // Sankalp Completion Check
    if (mode === 'sankalp') {
      const nextTotal = totalOfferingsCount + 1;
      if (nextTotal >= sankalpTarget) {
        playSoundEffect('bell');
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
      playSoundEffect('bell');
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
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=om-namah-shivaya-114422.mp3',
        coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400',
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

      {/* Digital Shivling Shrine Canvas */}
      <ShivlingShrine
        diyaLit={offerings.diyaLit}
        garlandPlaced={offerings.garlandPlaced}
        isWaterFlowing={isWaterFlowing}
        isMilkFlowing={isMilkFlowing}
        flowersCount={offerings.flowers}
        belpatraCount={offerings.belpatra}
        isAartiActive={mode === 'aarti'}
        isDhoopActive={offerings.dhoopActive}
      />

      {/* Devotional Sanskrit Mantra Card */}
      <PujaMantraCard activeOffering={activeOffering} />

      {/* Puja Action Buttons Grid */}
      <View style={[styles.actionsBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <View style={styles.actionHeader}>
          <Text style={[styles.barTitle, { color: theme.textGold }]}>🌸 पूजन द्रव्य अर्पित करें</Text>

          <TouchableOpacity style={styles.chantingToggleBtn} onPress={toggleBackgroundChanting}>
            <Text style={styles.chantingToggleText}>
              {isPlaying ? '🔊 शिव धुन बंद करें' : '🎵 शिव धुन चलाएं'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsGrid}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
            onPress={() => handleOffering('flower')}
            activeOpacity={0.7}
          >
            {offerings.flowers > 0 && <Text style={styles.badgeCount}>{offerings.flowers}</Text>}
            <Text style={styles.actionIcon}>🌸</Text>
            <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>पुष्प</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
            onPress={() => handleOffering('belpatra')}
            activeOpacity={0.7}
          >
            {offerings.belpatra > 0 && <Text style={styles.badgeCount}>{offerings.belpatra}</Text>}
            <Text style={styles.actionIcon}>🍃</Text>
            <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>बेलपत्र</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
            onPress={() => handleOffering('water')}
            activeOpacity={0.7}
          >
            {offerings.waterCount > 0 && <Text style={styles.badgeCount}>{offerings.waterCount}</Text>}
            <Text style={styles.actionIcon}>💧</Text>
            <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>जलधारा</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
            onPress={() => handleOffering('milk')}
            activeOpacity={0.7}
          >
            {offerings.milkCount > 0 && <Text style={styles.badgeCount}>{offerings.milkCount}</Text>}
            <Text style={styles.actionIcon}>🥛</Text>
            <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>दुग्धधारा</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: offerings.diyaLit ? colors.goldPrimary : theme.border }]}
            onPress={() => handleOffering('diya')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🪔</Text>
            <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>दीपक</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: offerings.garlandPlaced ? colors.goldPrimary : theme.border }]}
            onPress={() => handleOffering('garland')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🌺</Text>
            <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>पुष्पमाला</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
            onPress={() => handleOffering('bell')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>घंटी</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
            onPress={() => handleOffering('shankh')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🐚</Text>
            <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>शंखनाद</Text>
          </TouchableOpacity>
        </View>

        {/* Action Row: Reset & Share */}
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
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  barTitle: {
    fontSize: 14,
    fontWeight: 'bold',
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
