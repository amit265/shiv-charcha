import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, AppState } from 'react-native';
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
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { WebDeviceFrame } from '@/components/common/WebDeviceFrame';
import { colors } from '@/theme/colors';
import { useDeepLinkHandler } from '@/hooks/useDeepLinkHandler';
import { RemoteConfigProvider } from '@/context/RemoteConfigContext';
import { UpdateService, UpdateCheckResult } from '@/services/updateService';
import { UpdateModal } from '@/components/common/UpdateModal';
import { Analytics } from '@/services/analytics/analytics';
import { AdStateProvider } from '@/context/AdStateContext';
import { AdManager } from '@/services/analytics/AdManager';

// Prevent native splash screen from auto-hiding until initial mount is done
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { theme } = useTheme();
  const [updateInfo, setUpdateInfo] = useState<UpdateCheckResult | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Deep link handler hook for cold start & foreground URL handling
  useDeepLinkHandler();

  useEffect(() => {
    Analytics.logScreen('App_Launch');
    AdManager.initialize();
    checkForAppUpdates();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void AdManager.showAppOpenAd();
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  const checkForAppUpdates = async () => {
    const result = await UpdateService.checkForUpdates();
    if (result && result.hasUpdate) {
      setUpdateInfo(result);
      setShowUpdateModal(true);
    }
  };

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: '⚙️ सेटिंग्स' }} />
        <Stack.Screen name="theme-selector" options={{ title: '🎨 अपना रंग चुनें', presentation: 'modal' }} />
        <Stack.Screen name="puja" options={{ title: '🌸 शिव लिंग पूजा सेवा', presentation: 'modal' }} />
        <Stack.Screen name="jap" options={{ title: '📿 108 जाप साधना', presentation: 'card' }} />
        <Stack.Screen name="book/[id]" options={{ title: '📖 पुस्तक अध्ययन' }} />
        <Stack.Screen name="teaching/[id]" options={{ title: '💡 शिव गुरु ज्ञान' }} />
        <Stack.Screen name="date/[id]" options={{ title: '📅 पावन दिवस स्मरण' }} />
        <Stack.Screen name="reels" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="gallery" options={{ title: '🖼️ पावन गैलरी व वॉलपेपर' }} />
        <Stack.Screen name="ringtones" options={{ title: '🔔 भक्तिमय ध्वनियाँ' }} />
        <Stack.Screen name="calendar" options={{ title: '📅 शिव चर्चा कैलेंडर' }} />
        <Stack.Screen name="audio-hub" options={{ title: '🎧 ऑडियो अमृत वाणी' }} />

        {/* Shiv Sansar Sub-Routes */}
        <Stack.Screen name="sansar/stories/index" options={{ title: '📖 शिव कथाएँ' }} />
        <Stack.Screen name="sansar/stories/[id]" options={{ title: '📖 शिव कथा' }} />
        <Stack.Screen name="sansar/jyotirlinga/index" options={{ title: '🛕 12 ज्योतिर्लिंग' }} />
        <Stack.Screen name="sansar/jyotirlinga/[id]" options={{ title: '🛕 ज्योतिर्लिंग दर्शन' }} />
        <Stack.Screen name="sansar/shakti-peeth/index" options={{ title: '🌺 शक्ति पीठ' }} />
        <Stack.Screen name="sansar/shakti-peeth/[id]" options={{ title: '🌺 शक्ति पीठ दर्शन' }} />
        <Stack.Screen name="sansar/family/index" options={{ title: '👨‍👩‍👧 शिव परिवार' }} />
        <Stack.Screen name="sansar/swaroop/index" options={{ title: '🔱 शिव के स्वरूप' }} />
        <Stack.Screen name="sansar/symbols/index" options={{ title: '🕉️ शिव के प्रतीक' }} />
        <Stack.Screen name="sansar/temples/index" options={{ title: '🛕 प्रसिद्ध शिव मंदिर' }} />
        <Stack.Screen name="sansar/yatra" options={{ title: '📍 शिव यात्रा' }} />
        <Stack.Screen name="sansar/festivals/index" options={{ title: '📅 शिव पर्व एवं उत्सव' }} />
        <Stack.Screen name="sansar/stotra/index" options={{ title: '📿 शिव स्तोत्र व मंत्र' }} />
        <Stack.Screen name="sansar/stotra/[id]" options={{ title: '📿 शिव स्तोत्र पाठ' }} />
      </Stack>

      {/* Global Persistent Mini-Player */}
      <MiniPlayer />

      {/* Devotional In-App Update Modal */}
      <UpdateModal
        visible={showUpdateModal}
        updateInfo={updateInfo}
        onClose={() => setShowUpdateModal(false)}
      />
    </>
  );
}

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

      // Custom animated intro transitions
      logoScale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.5)) });
      logoOpacity.value = withTiming(1, { duration: 600 });
      logoRotation.value = withTiming(720, { duration: 1200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });

      // Delay text animation by 350ms so it slides up nicely
      textTranslateY.value = withDelay(350, withTiming(0, { duration: 1000, easing: Easing.out(Easing.cubic) }));
      textOpacity.value = withDelay(350, withTiming(1, { duration: 1000 }));

      // Custom smooth exit transition after 2.8 seconds
      const timeout = setTimeout(() => {
        splashOpacity.value = withTiming(0, { duration: 600 });
        setTimeout(() => {
          setIsSplashVisible(false);
          void AdManager.showAppOpenAd();
        }, 650);
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
        <ThemeProvider>
          <AudioProvider>
            <RemoteConfigProvider>
              <AdStateProvider>
                <WebDeviceFrame>
                  <RootNavigator />

                {/* Custom Animated Splash Screen Overlay */}
                {isSplashVisible && (
                  <Animated.View style={[StyleSheet.absoluteFill, styles.splashContainer, animatedSplashStyle]}>
                    <StatusBar style="light" animated />
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
                        <Text style={styles.splashSubtitle}>हर हर महादेव</Text>
                      </Animated.View>
                    </View>

                    {/* Developer Branding */}
                    <Text style={styles.splashDeveloperText}>
                      MAHAVYOMA STUDIO
                    </Text>
                  </Animated.View>
                )}
                </WebDeviceFrame>
              </AdStateProvider>
            </RemoteConfigProvider>
          </AudioProvider>
        </ThemeProvider>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.goldLight,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  splashSubtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.goldPrimary,
    marginTop: 8,
    letterSpacing: 2,
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
