import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  message = 'शिव चर्चा सामग्री लोड हो रही है...',
  subMessage = 'ॐ नमः शिवाय • कृपया प्रतीक्षा करें',
  fullScreen = true,
}: LoadingScreenProps) {
  const { theme } = useTheme();

  // Pulse animation for the central emblem
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [opacityAnim] = useState(() => new Animated.Value(0.7));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 1000,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [scaleAnim, opacityAnim]);

  return (
    <View
      style={[
        styles.container,
        fullScreen ? styles.fullScreenContainer : styles.inlineContainer,
        { backgroundColor: fullScreen ? '#0B132B' : theme.surfaceElevated },
      ]}
    >
      {/* GLOWING EMBLEM CONTAINER */}
      <Animated.View
        style={[
          styles.emblemCircle,
          {
            backgroundColor: 'rgba(255, 179, 0, 0.12)',
            borderColor: theme.borderGold,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.emblemText}>🔱</Text>
      </Animated.View>

      {/* SPINNER ACTIVITY INDICATOR */}
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>

      {/* MESSAGES */}
      <Text style={[styles.messageText, { color: theme.textGold }]}>{message}</Text>
      <Text style={[styles.subMessageText, { color: theme.textSecondary }]}>{subMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  inlineContainer: {
    width: SCREEN_WIDTH - 32,
    minHeight: 220,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 16,
    ...shadows.medium,
  },
  emblemCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...shadows.gold,
  },
  emblemText: {
    fontSize: 42,
  },
  spinnerWrapper: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subMessageText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
