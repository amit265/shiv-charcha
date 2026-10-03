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

type ModalStep = 'consent' | 'loading' | 'playing' | 'success';

export function RewardedAdModal({ visible, onDismiss, onRewardGranted }: Props) {
  const { theme } = useTheme();
  const [step, setStep] = useState<ModalStep>('consent');
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION_SECONDS);
  const [progressAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setStep((prev) => (prev !== 'consent' ? 'consent' : prev));
        setSecondsLeft((prev) => (prev !== AD_DURATION_SECONDS ? AD_DURATION_SECONDS : prev));
      }, 0);
    }
  }, [visible]);

  const handleAcceptConsent = () => {
    setStep('loading');

    const shown = AdManager.showRewardedAd(
      () => {
        void AdManager.grantAdFree().then(() => {
          setStep('success');
        });
      },
      () => {
        if (step !== 'success') {
          onDismiss();
        }
      }
    );

    if (!shown) {
      startAdLoading();
    }
  };

  const startAdLoading = () => {
    let isMounted = true;
    let fallbackTimeout: ReturnType<typeof setTimeout>;
    let rewardedAd: any = null;
    let unsubLoaded: (() => void) | null = null;
    let unsubEarned: (() => void) | null = null;
    let unsubClosed: (() => void) | null = null;

    try {
      rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      unsubLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        if (!isMounted) return;
        clearTimeout(fallbackTimeout);
        try {
          rewardedAd.show();
        } catch {
          setStep('playing');
        }
      });

      unsubEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        if (!isMounted) return;
        void AdManager.grantAdFree().then(() => {
          setStep('success');
        });
      });

      unsubClosed = rewardedAd.addAdEventListener('closed', () => {
        if (!isMounted) return;
        AdManager.setAdRecentlyClosed();
        if (step !== 'success') {
          onDismiss();
        }
      });

      fallbackTimeout = setTimeout(() => {
        if (isMounted) {
          setStep('playing');
        }
      }, 8000);

      rewardedAd.load();
    } catch {
      setStep('playing');
    }
  };

  useEffect(() => {
    if (!visible || step !== 'playing') return;

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
          void AdManager.grantAdFree().then(() => {
            setStep('success');
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      animation.stop();
    };
  }, [visible, step, progressAnim]);

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
          {step === 'consent' ? (
            /* STEP 1: USER CONSENT PROMPT */
            <View style={styles.consentContainer}>
              <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <Text style={styles.headerTitle}>🎁 15 मिनट विज्ञापन-मुक्त अनुभव</Text>
                <Text style={styles.headerSubtitle}>Ad-Free Devotional Mode</Text>
              </View>

              <View style={styles.consentBody}>
                <Text style={{ fontSize: 44, marginBottom: 12 }}>🔱</Text>
                <Text style={[styles.consentQuestion, { color: theme.textPrimary }]}>
                  क्या आप 15 मिनट के लिए सम्पूर्ण ऐप को विज्ञापन-मुक्त बनाना चाहते हैं?
                </Text>

                <View style={[styles.consentNoteBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                  <Text style={[styles.consentNoteText, { color: theme.primary }]}>
                    🌸 1 छोटा प्रायोजित वीडियो विज्ञापन देखने के पश्चात् 15 मिनट तक कोई भी Banner या Native विज्ञापन नहीं दिखेगा।
                  </Text>
                </View>

                <View style={styles.consentActions}>
                  <Pressable
                    style={[styles.acceptBtn, { backgroundColor: theme.primary }]}
                    onPress={handleAcceptConsent}
                  >
                    <Text style={styles.acceptBtnText}>▶️ हाँ, वीडियो देखें (Watch Ad)</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.cancelBtn, { borderColor: theme.border }]}
                    onPress={onDismiss}
                  >
                    <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>रद्द करें (Cancel)</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : step === 'loading' ? (
            /* STEP 2: AD LOADING */
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textPrimary }]}>विज्ञापन लोड हो रहा है...</Text>
              <Text style={[styles.loadingSubtext, { color: theme.textSecondary }]}>Loading rewarded devotional video...</Text>
            </View>
          ) : step === 'success' ? (
            /* STEP 3: SUCCESS & TIMER REWARD CONFIRMATION */
            <View style={styles.completionContainer}>
              <Text style={{ fontSize: 60 }}>🎉</Text>
              <Text style={[styles.successTitle, { color: theme.primary }]}>बहुत बढ़िया! (Ad-Free Active)</Text>
              <Text style={[styles.successSubtitle, { color: theme.textPrimary }]}>
                आपने 15 मिनट के लिए 100% विज्ञापन-मुक्त साधना अनलॉक कर ली है!
              </Text>
              <View style={[styles.timerBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                <Text style={[styles.timerBadgeText, { color: theme.primary }]}>
                  ⏱️ 15:00 मिनट शेष (Live Countdown Active)
                </Text>
              </View>
              <Pressable style={[styles.claimButton, { backgroundColor: theme.primary }]} onPress={handleClaimReward}>
                <Text style={styles.claimButtonText}>✓ साधना जारी रखें (Continue)</Text>
              </Pressable>
            </View>
          ) : (
            /* STEP 4: VIDEO PLAYING (SIMULATED / BACKUP) */
            <>
              <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <Text style={styles.headerTitle}>🎬 Devotional Ad Video</Text>
                <Text style={styles.headerSubtitle}>Watch to enjoy 15 minutes ad-free</Text>
              </View>

              <View style={[styles.videoPlaceholder, { backgroundColor: theme.surfaceElevated }]}>
                <Text style={{ fontSize: 48 }}>🎬</Text>
                <Text style={[styles.videoLabel, { color: theme.textPrimary }]}>प्रायोजित वीडियो चल रहा है...</Text>
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
                  style={[styles.skipButton, { borderColor: theme.border }]}
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
  timerBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    marginBottom: 6,
  },
  timerBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  claimButton: {
    marginTop: 14,
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
  consentContainer: {
    width: '100%',
  },
  consentBody: {
    padding: 20,
    alignItems: 'center',
  },
  consentQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 14,
  },
  consentNoteBox: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
  },
  consentNoteText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  consentActions: {
    width: '100%',
    gap: 10,
  },
  acceptBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
