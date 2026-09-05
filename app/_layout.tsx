import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { AudioProvider } from '@/context/AudioContext';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { WebDeviceFrame } from '@/components/common/WebDeviceFrame';
import { colors } from '@/theme/colors';

// Prevent native splash screen from auto-hiding until initial mount is done
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Reanimated splash values
  const logoScale = useSharedValue(0.4);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const textTranslateY = useSharedValue(35);
  const textOpacity = useSharedValue(0);
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    setIsAppReady(true);
  }, []);

  useEffect(() => {
    if (isAppReady) {
      // Hide native plain splash screen immediately
      SplashScreen.hideAsync().catch(() => {});

      // Custom animated intro transitions (matching thakur-prasad style)
      logoScale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.5)) });
      logoOpacity.value = withTiming(1, { duration: 600 });
      logoRotation.value = withTiming(720, { duration: 1200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });

      // Delay text animation by 350ms so it slides up nicely
      textTranslateY.value = withDelay(350, withTiming(0, { duration: 1000, easing: Easing.out(Easing.cubic) }));
      textOpacity.value = withDelay(350, withTiming(1, { duration: 1000 }));

      // Custom smooth exit transition after 2.8 seconds
      const timeout = setTimeout(() => {
        splashOpacity.value = withTiming(0, { duration: 600 }, (finished) => {
          if (finished) {
            runOnJS(setIsSplashVisible)(false);
          }
        });
      }, 2800);

      return () => clearTimeout(timeout);
    }
  }, [isAppReady]);

  // Reanimated animated style mappings
  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotateY: `${logoRotation.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
    opacity: textOpacity.value,
  }));

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AudioProvider>
          <WebDeviceFrame>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: colors.maroonPrimary,
                },
                headerTintColor: colors.goldLight,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                contentStyle: {
                  backgroundColor: colors.bgIvory,
                },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="puja" options={{ title: '🌸 शिव लिंग पूजा सेवा', presentation: 'modal' }} />
              <Stack.Screen name="jap" options={{ title: '📿 108 जाप साधना', presentation: 'card' }} />
              <Stack.Screen name="book/[id]" options={{ title: '📖 पुस्तक अध्ययन' }} />
              <Stack.Screen name="teaching/[id]" options={{ title: '💡 शिव गुरु ज्ञान' }} />
              <Stack.Screen name="date/[id]" options={{ title: '📅 पावन दिवस स्मरण' }} />
              <Stack.Screen name="gallery" options={{ title: '🖼️ पावन गैलरी व वॉलपेपर' }} />
              <Stack.Screen name="ringtones" options={{ title: '🔔 भक्तिमय ध्वनियाँ' }} />
            </Stack>

            {/* Global Persistent Mini-Player */}
            <MiniPlayer />

            {/* Custom Animated Splash Screen Overlay */}
            {isSplashVisible && (
              <Animated.View style={[StyleSheet.absoluteFill, styles.splashContainer, animatedSplashStyle]}>
                <View style={styles.splashContent}>
                  {/* Rotating & Scaling App Icon */}
                  <Animated.View style={[styles.splashIconWrapper, animatedLogoStyle]}>
                    <Image
                      source={require('../assets/images/splash-icon.png')}
                      style={styles.splashIconImage}
                      resizeMode="contain"
                    />
                  </Animated.View>

                  {/* Fading & Sliding Brand Text */}
                  <Animated.View style={[styles.splashTextContainer, animatedTextStyle]}>
                    <Text style={styles.splashTitle}>शिव चर्चा</Text>
                    <Text style={styles.splashSubtitle}>महाव्योम स्टूडियो</Text>
                    <Text style={styles.splashTagline}>देखें • सुनें • छुएँ • करें • सीखें • साझा करें</Text>
                  </Animated.View>
                </View>

                {/* Developer Branding */}
                <Text style={styles.splashDeveloperText}>
                  MAHAVYOMA STUDIO
                </Text>
              </Animated.View>
            )}
          </WebDeviceFrame>
        </AudioProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    backgroundColor: colors.maroonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashIconWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  splashIconImage: {
    width: 140,
    height: 140,
    borderRadius: 28,
  },
  splashTextContainer: {
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.goldLight,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  splashSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.goldPrimary,
    marginTop: 6,
    letterSpacing: 1.5,
  },
  splashTagline: {
    fontSize: 13,
    color: colors.bgIvory,
    opacity: 0.9,
    marginTop: 16,
    letterSpacing: 1,
  },
  splashDeveloperText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255, 215, 0, 0.7)',
  },
});
