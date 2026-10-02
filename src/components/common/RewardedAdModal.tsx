import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';
import { AdManager, getGoogleAdUnitId } from '@/services/analytics/AdManager';

const AD_DURATION_SECONDS = 30;
const SKIP_LOCK_SECONDS = 5;
const adUnitId = getGoogleAdUnitId('rewarded');

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onRewardGranted: () => void;
};

export function RewardedAdModal({ visible, onDismiss, onRewardGranted }: Props) {
  const { theme } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION_SECONDS);
  const [completed, setCompleted] = useState(false);
  const [progressAnim] = useState(() => new Animated.Value(0));
  const [isLoadingRealAd, setIsLoadingRealAd] = useState(true);
  const [useSimulatedAd, setUseSimulatedAd] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let isMounted = true;
    let fallbackTimeout: ReturnType<typeof setTimeout>;
    let rewardedAd: any = null;
    let unsubLoaded: (() => void) | null = null;
    let unsubEarned: (() => void) | null = null;
    let unsubClosed: (() => void) | null = null;

    const initTimer = setTimeout(() => {
      if (!isMounted) return;

      try {
        rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        });

        unsubLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
          if (!isMounted) return;
          clearTimeout(fallbackTimeout);
          setIsLoadingRealAd(false);
          try {
            rewardedAd.show();
          } catch {
            setUseSimulatedAd(true);
          }
        });

        unsubEarned = rewardedAd.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            if (!isMounted) return;
            void AdManager.grantAdFree().then(() => {
              onRewardGranted();
            });
          }
        );

        unsubClosed = rewardedAd.addAdEventListener(
          'closed',
          () => {
            if (!isMounted) return;
            AdManager.setAdRecentlyClosed();
            onDismiss();
          }
        );

        fallbackTimeout = setTimeout(() => {
          if (isMounted) {
            setIsLoadingRealAd(false);
            setUseSimulatedAd(true);
          }
        }, 10000);

        rewardedAd.load();
      } catch {
        setIsLoadingRealAd(false);
        setUseSimulatedAd(true);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      clearTimeout(fallbackTimeout);
      if (unsubLoaded) unsubLoaded();
      if (unsubEarned) unsubEarned();
      if (unsubClosed) unsubClosed();
    };
  }, [visible, onDismiss, onRewardGranted]);

  useEffect(() => {
    if (!visible || !useSimulatedAd) return;

    progressAnim.setValue(0);
    const animation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: AD_DURATION_SECONDS * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    animation.start();

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      animation.stop();
    };
  }, [visible, useSimulatedAd, progressAnim]);

  async function handleClaimReward() {
    await AdManager.grantAdFree();
    onRewardGranted();
  }

  const canSkip = secondsLeft <= AD_DURATION_SECONDS - SKIP_LOCK_SECONDS;
  const progressDeg = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          {isLoadingRealAd ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textPrimary }]}>विज्ञापन लोड हो रहा है...</Text>
              <Text style={[styles.loadingSubtext, { color: theme.textSecondary }]}>Please wait a moment...</Text>
            </View>
          ) : completed ? (
            <View style={styles.completionContainer}>
              <Text style={{ fontSize: 60 }}>🎉</Text>
              <Text style={[styles.successTitle, { color: theme.primary }]}>बहुत बढ़िया!</Text>
              <Text style={[styles.successSubtitle, { color: theme.textPrimary }]}>आपने 15 मिनट के लिए विज्ञापन हटा दिए!</Text>
              <Text style={[styles.successNote, { color: theme.textSecondary }]}>Ads removed for 15 minutes</Text>
              <Pressable style={[styles.claimButton, { backgroundColor: theme.primary }]} onPress={handleClaimReward}>
                <Text style={styles.claimButtonText}>✓ Ad-Free Mode सक्रिय करें</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <Text style={styles.headerTitle}>🎬 Devotional Ad Video</Text>
                <Text style={styles.headerSubtitle}>Watch to enjoy 15 minutes ad-free</Text>
              </View>

              <View style={[styles.videoPlaceholder, { backgroundColor: theme.surfaceElevated }]}>
                <Text style={{ fontSize: 48 }}>🎬</Text>
                <Text style={[styles.videoLabel, { color: theme.textPrimary }]}>विज्ञापन चल रहा है...</Text>
                <Text style={[styles.videoSublabel, { color: theme.textSecondary }]}>Ad is playing</Text>
              </View>

              <View style={styles.timerContainer}>
                <View style={[styles.ringOuter, { borderColor: theme.borderGold }]}>
                  <Animated.View
                    style={[
                      styles.ringProgress,
                      { borderColor: theme.primary, transform: [{ rotate: progressDeg }] },
                    ]}
                  />
                  <View style={styles.ringInner}>
                    <Text style={[styles.timerNumber, { color: theme.primary }]}>{secondsLeft}</Text>
                    <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>sec</Text>
                  </View>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={[styles.footerNote, { color: theme.textSecondary }]}>
                  {canSkip
                    ? 'आप अब छोड़ सकते हैं (कोई पुरस्कार नहीं)'
                    : `${SKIP_LOCK_SECONDS - (AD_DURATION_SECONDS - secondsLeft)} सेकंड में छोड़ने का विकल्प`}
                </Text>
                <Pressable
                  style={[
                    styles.skipButton,
                    { borderColor: theme.border },
                  ]}
                  onPress={canSkip ? onDismiss : undefined}
                >
                  <Text style={[styles.skipText, { color: theme.primary }]}>
                    {canSkip ? 'Skip (No Reward)' : `Skip in ${SKIP_LOCK_SECONDS - (AD_DURATION_SECONDS - secondsLeft)}s`}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 24,
    width: '100%',
    overflow: 'hidden',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    height: 280,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  loadingSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  videoPlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  videoSublabel: {
    fontSize: 12,
    marginTop: 2,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ringOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringProgress: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  ringInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerLabel: {
    fontSize: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  skipText: {
    fontWeight: '600',
    fontSize: 13,
  },
  completionContainer: {
    alignItems: 'center',
    padding: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  successSubtitle: {
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },
  successNote: {
    fontSize: 12,
    marginTop: 4,
  },
  claimButton: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
