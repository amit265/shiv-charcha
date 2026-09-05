import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '../../theme/colors';
import { useAudio } from '../../context/AudioContext';

interface OfferingState {
  flowers: number;
  belpatra: number;
  waterCount: number;
  milkCount: number;
  diyaLit: boolean;
  garlandPlaced: boolean;
}

export const ShivlingPujaCanvas: React.FC = () => {
  const { playSoundEffect } = useAudio();
  const [offerings, setOfferings] = useState<OfferingState>({
    flowers: 0,
    belpatra: 0,
    waterCount: 0,
    milkCount: 0,
    diyaLit: false,
    garlandPlaced: false,
  });

  const triggerHaptic = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleOffering = (type: 'flower' | 'belpatra' | 'water' | 'milk' | 'diya' | 'garland' | 'bell' | 'shankh') => {
    triggerHaptic();

    if (type === 'flower') {
      setOfferings(prev => ({ ...prev, flowers: prev.flowers + 1 }));
      playSoundEffect('chime');
    } else if (type === 'belpatra') {
      setOfferings(prev => ({ ...prev, belpatra: prev.belpatra + 1 }));
      playSoundEffect('chime');
    } else if (type === 'water') {
      setOfferings(prev => ({ ...prev, waterCount: prev.waterCount + 1 }));
      playSoundEffect('chime');
    } else if (type === 'milk') {
      setOfferings(prev => ({ ...prev, milkCount: prev.milkCount + 1 }));
      playSoundEffect('chime');
    } else if (type === 'diya') {
      setOfferings(prev => ({ ...prev, diyaLit: !prev.diyaLit }));
      playSoundEffect('chime');
    } else if (type === 'garland') {
      setOfferings(prev => ({ ...prev, garlandPlaced: !prev.garlandPlaced }));
      playSoundEffect('chime');
    } else if (type === 'bell') {
      playSoundEffect('bell');
    } else if (type === 'shankh') {
      playSoundEffect('shankh');
    }
  };

  const resetPuja = () => {
    setOfferings({
      flowers: 0,
      belpatra: 0,
      waterCount: 0,
      milkCount: 0,
      diyaLit: false,
      garlandPlaced: false,
    });
  };

  return (
    <View style={styles.container}>
      {/* Devotional Canvas Stage */}
      <View style={styles.stage}>
        {/* Background Aura */}
        <View style={styles.auraGlow} />

        {/* Diya Flames on sides if lit */}
        {offerings.diyaLit && (
          <View style={styles.diyaContainer}>
            <Text style={styles.diyaFlame}>🪔✨</Text>
          </View>
        )}

        {/* Shivling Shrine Visualization */}
        <View style={styles.shivlingFrame}>
          <Text style={styles.shivlingEmoji}>🕉️</Text>
          <View style={styles.shivlingBase}>
            <Text style={styles.shivlingIcon}>🪨</Text>
          </View>

          {/* Garland on Shivling */}
          {offerings.garlandPlaced && (
            <View style={styles.garlandOverlay}>
              <Text style={styles.garlandText}>🌸🌼🌺🌼🌸</Text>
            </View>
          )}

          {/* Flowers & Bel Patra Offered Count Badge */}
          {(offerings.flowers > 0 || offerings.belpatra > 0) && (
            <View style={styles.offeringBadge}>
              <Text style={styles.offeringBadgeText}>
                {offerings.flowers > 0 ? `🌸 x${offerings.flowers} ` : ''}
                {offerings.belpatra > 0 ? `🍃 x${offerings.belpatra}` : ''}
              </Text>
            </View>
          )}

          {/* Abhishek Liquids */}
          {(offerings.waterCount > 0 || offerings.milkCount > 0) && (
            <View style={styles.liquidStream}>
              <Text style={styles.liquidText}>
                {offerings.waterCount > 0 ? '💧' : ''}
                {offerings.milkCount > 0 ? '🥛' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Closing Devotional Blessing */}
        <View style={styles.blessingBox}>
          <Text style={styles.blessingText}>ॐ नमः शिवाय 🙏</Text>
          <Text style={styles.subBlessing}>शिव गुरु का आशीर्वाद सदा आपके साथ है</Text>
        </View>
      </View>

      {/* Interactive Worship Actions Bar */}
      <View style={styles.actionsBar}>
        <Text style={styles.barTitle}>पूजा सेवा भाव अर्पित करें:</Text>
        <View style={styles.buttonsGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOffering('flower')} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🌸</Text>
            <Text style={styles.actionLabel}>पुष्प</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOffering('belpatra')} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🍃</Text>
            <Text style={styles.actionLabel}>बेलपत्र</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOffering('water')} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>💧</Text>
            <Text style={styles.actionLabel}>जलधारा</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOffering('milk')} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🥛</Text>
            <Text style={styles.actionLabel}>दुग्धधारा</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOffering('diya')} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🪔</Text>
            <Text style={styles.actionLabel}>दीपक</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOffering('garland')} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🌺</Text>
            <Text style={styles.actionLabel}>माला</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOffering('bell')} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionLabel}>घंटी</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOffering('shankh')} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🐚</Text>
            <Text style={styles.actionLabel}>शंखनाद</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={resetPuja} activeOpacity={0.7}>
          <Text style={styles.resetText}>↺ पुनः पूजा आरम्भ करें</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.maroonDark,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.goldPrimary,
    ...shadows.medium,
  },
  stage: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#200408',
  },
  auraGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 111, 0, 0.25)',
  },
  diyaContainer: {
    position: 'absolute',
    top: 20,
    right: 24,
  },
  diyaFlame: {
    fontSize: 28,
  },
  shivlingFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shivlingEmoji: {
    fontSize: 32,
    marginBottom: -8,
  },
  shivlingBase: {
    alignItems: 'center',
  },
  shivlingIcon: {
    fontSize: 84,
  },
  garlandOverlay: {
    position: 'absolute',
    top: 36,
  },
  garlandText: {
    fontSize: 16,
  },
  offeringBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: colors.maroonPrimary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.goldPrimary,
  },
  offeringBadgeText: {
    fontSize: 12,
    color: colors.goldLight,
    fontWeight: 'bold',
  },
  liquidStream: {
    position: 'absolute',
    top: 10,
  },
  liquidText: {
    fontSize: 22,
  },
  blessingBox: {
    position: 'absolute',
    bottom: 12,
    alignItems: 'center',
  },
  blessingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  subBlessing: {
    fontSize: 11,
    color: colors.bgIvory,
    opacity: 0.8,
    marginTop: 2,
  },
  actionsBar: {
    backgroundColor: colors.maroonPrimary,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.goldPrimary,
  },
  barTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.goldPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  actionBtn: {
    width: '23%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
  },
  actionIcon: {
    fontSize: 22,
  },
  actionLabel: {
    fontSize: 11,
    color: colors.bgIvory,
    marginTop: 4,
    fontWeight: '500',
  },
  resetBtn: {
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  resetText: {
    fontSize: 12,
    color: colors.goldPrimary,
    opacity: 0.9,
  },
});
