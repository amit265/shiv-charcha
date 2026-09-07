import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, shadows } from '../../theme/colors';

// Custom Asset PNG Images
const DIYA_IMG = require('../../../assets/images/pooja/diya.png');
const GARLAND_IMG = require('../../../assets/images/pooja/garland.png');
const WATER_IMG = require('../../../assets/images/pooja/water.png');

interface ShivlingShrineProps {
  diyaLit: boolean;
  garlandPlaced: boolean;
  isWaterFlowing: boolean;
  isMilkFlowing: boolean;
  flowersCount: number;
  belpatraCount: number;
  isAartiActive: boolean;
  isDhoopActive: boolean;
}

export const ShivlingShrine: React.FC<ShivlingShrineProps> = ({
  diyaLit,
  garlandPlaced,
  isWaterFlowing,
  isMilkFlowing,
  flowersCount,
  belpatraCount,
  isAartiActive,
  isDhoopActive,
}) => {
  const { theme } = useTheme();

  // Animation Refs
  const auraAnim = useRef(new Animated.Value(1)).current;
  const flameAnim = useRef(new Animated.Value(1)).current;
  const streamHeight = useRef(new Animated.Value(0)).current;
  const streamPulse = useRef(new Animated.Value(0.9)).current;
  const kalashTiltAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const garlandDropAnim = useRef(new Animated.Value(-100)).current;
  const showerYAnim = useRef(new Animated.Value(0)).current;
  const aartiOrbitalAnim = useRef(new Animated.Value(0)).current;
  const smokeAnim = useRef(new Animated.Value(0)).current;

  // Divine Aura Pulsing Loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(auraAnim, {
          toValue: 1.25,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(auraAnim, {
          toValue: 1.0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Diya Flame Flicker Loop
  useEffect(() => {
    if (diyaLit || isAartiActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameAnim, {
            toValue: 1.3,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(flameAnim, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      flameAnim.setValue(1);
    }
  }, [diyaLit, isAartiActive]);

  // Garland Smooth Spring Drop & Drape Transition
  useEffect(() => {
    if (garlandPlaced) {
      garlandDropAnim.setValue(-100);
      Animated.spring(garlandDropAnim, {
        toValue: 28,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      garlandDropAnim.setValue(-100);
    }
  }, [garlandPlaced]);

  // Fluid Abhishek Flowing & Kalash Tilt Animation in Perfect Sync
  useEffect(() => {
    if (isWaterFlowing || isMilkFlowing) {
      streamHeight.setValue(0);
      Animated.timing(streamHeight, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      // Tilt Kalash vessel gracefully in line with liquid stream
      Animated.spring(kalashTiltAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(streamPulse, {
            toValue: 1.15,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(streamPulse, {
            toValue: 0.85,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      streamHeight.setValue(0);
      streamPulse.setValue(1);
      rippleAnim.setValue(0);
      // Smoothly tilt Kalash back upright
      Animated.timing(kalashTiltAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isWaterFlowing, isMilkFlowing]);

  // Showering Flower & Belpatra Animation — FALLS ONLY ONCE ON TAP (NO LOOP!)
  useEffect(() => {
    if (flowersCount > 0 || belpatraCount > 0) {
      showerYAnim.setValue(0);
      Animated.timing(showerYAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      showerYAnim.setValue(0);
    }
  }, [flowersCount, belpatraCount]);

  // Dhoop Smoke Rising Loop
  useEffect(() => {
    if (isDhoopActive) {
      Animated.loop(
        Animated.timing(smokeAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      smokeAnim.setValue(0);
    }
  }, [isDhoopActive]);

  // Maha Aarti Orbital Wave Animation (Gentle circular movement with lamps staying UPRIGHT)
  useEffect(() => {
    if (isAartiActive) {
      Animated.loop(
        Animated.timing(aartiOrbitalAnim, {
          toValue: 1,
          duration: 3600,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      aartiOrbitalAnim.setValue(0);
    }
  }, [isAartiActive]);

  // Gentle circular wave trajectory for Aarti Thali (lamps stay upright!)
  const aartiX = aartiOrbitalAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 40, 0, -40, 0],
  });

  const aartiY = aartiOrbitalAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-20, 0, 20, 0, -20],
  });

  const streamScaleY = streamHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 2.2],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.5, 0],
  });

  // Single-pass flower falling interpolation
  const showerTranslateY1 = showerYAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [-35, 120, 125],
  });

  const showerOpacity1 = showerYAnim.interpolate({
    inputRange: [0, 0.2, 0.85, 1],
    outputRange: [0, 1, 1, 0],
  });

  const smokeTranslateY = smokeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const smokeScale = smokeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.8],
  });

  const smokeOpacity = smokeAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.9, 0.6, 0],
  });

  // Kalash tilt & sync translations (vessel mouth aligned pixel-perfectly with water start)
  const kalashRotate = kalashTiltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-80deg'],
  });

  const kalashTranslateX = kalashTiltAnim.interpolate({
    inputRange: [0, 4],
    outputRange: [0, 14],
  });

  const kalashTranslateY = kalashTiltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const totalRestingFlowers = Math.min(flowersCount, 7);
  const totalRestingBelpatra = Math.min(belpatraCount, 7);

  return (
    <View style={styles.container}>
      {/* Altar Stage Background */}
      <View style={styles.stage}>
        {/* Background Divine Aura Glow */}
        <Animated.View
          style={[
            styles.auraGlow,
            {
              transform: [{ scale: auraAnim }],
              backgroundColor: diyaLit || isAartiActive ? 'rgba(255, 160, 0, 0.42)' : 'rgba(255, 111, 0, 0.22)',
            },
          ]}
        />

        {/* Floating Crescent Moon */}
        <View style={styles.crescentMoon}>
          <Text style={styles.moonText}>🌙</Text>
        </View>

        {/* Custom Diya PNG Lamps (Left & Right) with Upright Flickering Flame */}
        {(diyaLit || isAartiActive) && (
          <>
            <View style={styles.leftDiya}>
              <Animated.View style={[styles.flameOuterGlow, { transform: [{ scale: flameAnim }] }]} />
              <Animated.View style={[styles.flameCore, { transform: [{ scale: flameAnim }] }]} />
              <Image source={DIYA_IMG} style={styles.customDiyaImg} resizeMode="contain" />
            </View>

            <View style={styles.rightDiya}>
              <Animated.View style={[styles.flameOuterGlow, { transform: [{ scale: flameAnim }] }]} />
              <Animated.View style={[styles.flameCore, { transform: [{ scale: flameAnim }] }]} />
              <Image source={DIYA_IMG} style={styles.customDiyaImg} resizeMode="contain" />
            </View>
          </>
        )}

        {/* Dhoop Incense Stand & Rising Smoke Plumes */}
        {isDhoopActive && (
          <View style={styles.dhoopStand}>
            <Animated.View
              style={[
                styles.smokePlume,
                {
                  opacity: smokeOpacity,
                  transform: [{ translateY: smokeTranslateY }, { scale: smokeScale }],
                },
              ]}
            >
              <View style={styles.smokeCircle} />
              <View style={styles.smokeCircleSmall} />
            </Animated.View>
            <Text style={styles.dhoopStick}>🕯️</Text>
          </View>
        )}

        {/* Central Shivling Shrine Structure */}
        <View style={styles.shrineFrame}>
          {/* Continuous Fluid Abhishek Stream & Overlapping Vessel (ONLY visible during pouring!) */}
          {(isWaterFlowing || isMilkFlowing) && (
            <View style={styles.fluidStreamContainer}>
              {/* Tilted Kalash Vessel Overlapping Directly at Top Mouth of Liquid Beam */}
              <Animated.View
                style={[
                  styles.tiltingKalash,
                  {
                    transform: [
                      { rotate: kalashRotate },
                      { translateX: kalashTranslateX },
                      { translateY: kalashTranslateY },
                    ],
                  },
                ]}
              >
                <Text style={styles.kalashEmoji}>🏺</Text>
              </Animated.View>

              {/* Fluid Beam Originating Directly from Inside the Vessel Mouth */}
              <Animated.View
                style={[
                  styles.fluidBeamWrapper,
                  {
                    transform: [{ scaleY: streamScaleY }, { scaleX: streamPulse }],
                  },
                ]}
              >
                <Image
                  source={WATER_IMG}
                  style={[
                    styles.customWaterImg,
                    isMilkFlowing && { tintColor: '#FFFDD0' },
                  ]}
                  resizeMode="contain"
                />
              </Animated.View>

              {/* Splashing Ripple Oval at the Top Dome of Shivling */}
              <Animated.View
                style={[
                  styles.splashRipple,
                  {
                    borderColor: isMilkFlowing ? '#FFFFFF' : '#00E5FF',
                    transform: [{ scale: rippleScale }],
                    opacity: rippleOpacity,
                  },
                ]}
              />
            </View>
          )}

          {/* Black Marble Shivling Linga Body */}
          <View style={styles.lingaTopContainer}>
            <View style={styles.lingaDome}>
              {/* Tripund Chandan & Kumkum Tilak */}
              <View style={styles.tripundContainer}>
                <View style={styles.tripundLine} />
                <View style={styles.tripundLineCenter}>
                  <View style={styles.kumkumDot} />
                </View>
                <View style={styles.tripundLine} />
              </View>

              {/* Serpent Vasuki Coiled on Linga */}
              <View style={styles.serpentNeck}>
                <Text style={styles.serpentText}>🐍</Text>
              </View>

              {/* Liquid Gloss Sheen Effect on Linga Dome */}
              {(isWaterFlowing || isMilkFlowing) && (
                <View
                  style={[
                    styles.lingaGlint,
                    { backgroundColor: isMilkFlowing ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 229, 255, 0.35)' },
                  ]}
                />
              )}
            </View>
          </View>

          {/* Single-Pass Devotional Flower & Belpatra Shower (Falls IN FRONT of Shivling) */}
          {(flowersCount > 0 || belpatraCount > 0) && (
            <View style={styles.centerShowerContainer}>
              <Animated.Text
                style={[
                  styles.centerShowerEmoji,
                  {
                    opacity: showerOpacity1,
                    transform: [{ translateY: showerTranslateY1 }],
                  },
                ]}
              >
                {belpatraCount > flowersCount ? '🍃' : (flowersCount % 2 === 0 ? '🌸' : '🌺')}
              </Animated.Text>
            </View>
          )}

          {/* Custom Garland PNG Draped on Linga with Smooth Spring Drop Animation */}
          {garlandPlaced && (
            <Animated.View
              style={[
                styles.garlandOverlay,
                {
                  transform: [{ translateY: garlandDropAnim }],
                },
              ]}
            >
              <Image source={GARLAND_IMG} style={styles.customGarlandImg} resizeMode="contain" />
            </Animated.View>
          )}

          {/* Base Pedestal (Jaladhari / Yoni Base) */}
          <View style={styles.jaladhariBase}>
            <View style={styles.jaladhariLip} />
            <View style={styles.jaladhariSpout}>
              <Text style={styles.spoutArrow}>▶</Text>
            </View>

            {/* Accumulated Resting Emoji Flowers & Belpatras on Jaladhari Base */}
            <View style={styles.restingItemsContainer}>
              {Array.from({ length: totalRestingFlowers }).map((_, i) => (
                <Text key={`flw_${i}`} style={[styles.restingEmojiText, { left: 4 + i * 13 }]}>
                  {i % 2 === 0 ? '🌸' : '🌼'}
                </Text>
              ))}
              {Array.from({ length: totalRestingBelpatra }).map((_, i) => (
                <Text key={`bel_${i}`} style={[styles.restingEmojiText, { right: 4 + i * 13 }]}>
                  🍃
                </Text>
              ))}
            </View>
          </View>

          {/* Offered Totals Badge below Jaladhari Base */}
          {(flowersCount > 0 || belpatraCount > 0) && (
            <View style={styles.offeredTray}>
              {flowersCount > 0 && <Text style={styles.offeredBadge}>🌸 {flowersCount}</Text>}
              {belpatraCount > 0 && <Text style={styles.offeredBadge}>🍃 {belpatraCount}</Text>}
            </View>
          )}
        </View>

        {/* Maha Aarti Wave Motion Thali (Diyas stay UPRIGHT facing upwards!) */}
        {isAartiActive && (
          <Animated.View
            style={[
              styles.aartiWaveContainer,
              {
                transform: [{ translateX: aartiX }, { translateY: aartiY }],
              },
            ]}
          >
            <View style={styles.aartiThaliPlate}>
              <View style={styles.aartiDiyaItem}>
                <Animated.View style={[styles.flameCoreSmall, { transform: [{ scale: flameAnim }] }]} />
                <Image source={DIYA_IMG} style={styles.aartiDiyaImg} resizeMode="contain" />
              </View>

              <Text style={styles.aartiFlowerText}>🌸</Text>

              <View style={styles.aartiDiyaItem}>
                <Animated.View style={[styles.flameCoreSmall, { transform: [{ scale: flameAnim }] }]} />
                <Image source={DIYA_IMG} style={styles.aartiDiyaImg} resizeMode="contain" />
              </View>
            </View>
          </Animated.View>
        )}

        {/* Bottom Devotional Subtitle */}
        <View style={styles.blessingBanner}>
          <Text style={styles.blessingTitle}>ॐ नमः शिवाय 🙏</Text>
          <Text style={styles.blessingSub}>हर हर महादेव • सर्व मंगल मङ्गल्ये</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.goldPrimary,
    backgroundColor: '#160306',
    ...shadows.medium,
  },
  stage: {
    height: 340,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  auraGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  crescentMoon: {
    position: 'absolute',
    top: 14,
    left: 20,
  },
  moonText: {
    fontSize: 22,
    opacity: 0.9,
  },
  leftDiya: {
    position: 'absolute',
    left: 16,
    bottom: 54,
    alignItems: 'center',
  },
  rightDiya: {
    position: 'absolute',
    right: 16,
    bottom: 54,
    alignItems: 'center',
  },
  customDiyaImg: {
    width: 44,
    height: 44,
  },
  flameOuterGlow: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 26,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 109, 0, 0.55)',
  },
  flameCore: {
    width: 12,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#FFEE58',
    borderWidth: 2,
    borderColor: '#FF6D00',
    marginBottom: -6,
    zIndex: 2,
    ...shadows.gold,
  },
  flameCoreSmall: {
    width: 8,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#FFEE58',
    borderWidth: 1.5,
    borderColor: '#FF6D00',
    marginBottom: -4,
    zIndex: 2,
  },
  dhoopStand: {
    position: 'absolute',
    bottom: 55,
    left: 64,
    alignItems: 'center',
  },
  smokePlume: {
    alignItems: 'center',
    marginBottom: -4,
  },
  smokeCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(230, 230, 240, 0.45)',
  },
  smokeCircleSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(230, 230, 240, 0.35)',
    marginTop: 2,
  },
  dhoopStick: {
    fontSize: 16,
  },
  shrineFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 45,
    position: 'relative',
  },
  tiltingKalash: {
    position: 'absolute',
    top: -24,
    left: -4,
    zIndex: 20,
    alignItems: 'center',
  },
  kalashEmoji: {
    fontSize: 32,
  },
  fluidStreamContainer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    zIndex: 12,
  },
  fluidBeamWrapper: {
    width: 44,
    height: 64,
    alignItems: 'center',
  },
  customWaterImg: {
    width: 40,
    height: 60,
  },
  splashRipple: {
    width: 42,
    height: 14,
    borderRadius: 21,
    borderWidth: 2.5,
    marginTop: -10,
  },
  centerShowerContainer: {
    position: 'absolute',
    top: -30,
    width: 60,
    height: 120,
    zIndex: 30,
    alignItems: 'center',
  },
  centerShowerEmoji: {
    position: 'absolute',
    fontSize: 26,
  },
  lingaTopContainer: {
    alignItems: 'center',
    zIndex: 5,
  },
  lingaDome: {
    width: 84,
    height: 106,
    backgroundColor: '#111115',
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 2,
    borderColor: '#383844',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.medium,
  },
  lingaGlint: {
    position: 'absolute',
    top: 4,
    width: 76,
    height: 98,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
  },
  tripundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
  },
  tripundLine: {
    width: 38,
    height: 3,
    backgroundColor: '#FFF8DC',
    borderRadius: 2,
    marginVertical: 1,
  },
  tripundLineCenter: {
    width: 38,
    height: 3,
    backgroundColor: '#FFF8DC',
    borderRadius: 2,
    marginVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kumkumDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D32F2F',
  },
  serpentNeck: {
    position: 'absolute',
    bottom: 6,
    right: -8,
  },
  serpentText: {
    fontSize: 22,
  },
  garlandOverlay: {
    position: 'absolute',
    top: 0,
    zIndex: 8,
    alignItems: 'center',
  },
  customGarlandImg: {
    width: 96,
    height: 52,
  },
  jaladhariBase: {
    width: 154,
    height: 32,
    backgroundColor: '#262630',
    borderRadius: 16,
    marginTop: -10,
    borderWidth: 2,
    borderColor: colors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 25,
  },
  jaladhariLip: {
    width: 176,
    height: 12,
    backgroundColor: '#383846',
    borderRadius: 6,
    position: 'absolute',
    bottom: -4,
  },
  jaladhariSpout: {
    position: 'absolute',
    right: -16,
    top: 6,
  },
  spoutArrow: {
    fontSize: 14,
    color: colors.goldPrimary,
  },
  restingItemsContainer: {
    position: 'absolute',
    top: -6,
    width: '100%',
    height: 20,
    zIndex: 35,
  },
  restingEmojiText: {
    position: 'absolute',
    fontSize: 13,
  },
  offeredTray: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -22,
    backgroundColor: 'rgba(74, 14, 23, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.goldPrimary,
  },
  offeredBadge: {
    fontSize: 11,
    color: colors.goldLight,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  aartiWaveContainer: {
    position: 'absolute',
    bottom: 50,
    zIndex: 12,
  },
  aartiThaliPlate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 160,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(74, 14, 23, 0.9)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
    ...shadows.gold,
  },
  aartiDiyaItem: {
    alignItems: 'center',
  },
  aartiDiyaImg: {
    width: 32,
    height: 32,
  },
  aartiFlowerText: {
    fontSize: 18,
  },
  blessingBanner: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  blessingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.goldLight,
    letterSpacing: 1,
  },
  blessingSub: {
    fontSize: 10,
    color: '#E0D0C0',
    opacity: 0.9,
    marginTop: 2,
  },
});
