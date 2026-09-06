import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { colors, shadows } from '@/theme/colors';

const { width } = Dimensions.get('window');

const AVATAR_OPTIONS = ['🙏', '🔱', '🕉️', '📿', '🌺', '🌸', '🛕'];

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (userName: string, avatarIcon: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const { theme } = useTheme();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userName, setUserName] = useState('शिव शिष्य');
  const [selectedAvatar, setSelectedAvatar] = useState('🙏');

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 2 | 3);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    onComplete(userName.trim() || 'शिव शिष्य', selectedAvatar);
  };

  const handleSkip = () => {
    onComplete(userName.trim() || 'शिव शिष्य', selectedAvatar);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleSkip}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          {/* Step Indicator */}
          <View style={styles.stepIndicatorRow}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: s === step ? theme.primary : theme.border,
                    width: s === step ? 28 : 10,
                  },
                ]}
              />
            ))}
          </View>

          {/* Skip Button */}
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>स्किप करें ➔</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* SLIDE 1: WELCOME & 3 SUTRAS */}
          {step === 1 && (
            <View style={styles.slideContainer}>
              <View style={[styles.iconHeroCircle, { backgroundColor: theme.surfaceElevated, borderColor: theme.accent }]}>
                <Text style={{ fontSize: 54 }}>🌸</Text>
              </View>

              <Text style={[styles.slideTitle, { color: theme.primary }]}>
                पावन शिव गुरु शरण में आपका स्वागत है 🙏
              </Text>
              <Text style={[styles.slideSub, { color: theme.textSecondary }]}>
                साहब श्री हरिंद्रानंद जी एवं दीदी नीलम आनंद जी द्वारा प्रतिपादित 3 सूत्र
              </Text>

              <View style={[styles.sutraContainer, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <View style={styles.sutraItem}>
                  <Text style={styles.sutraNumber}>१</Text>
                  <View style={styles.sutraTextCol}>
                    <Text style={[styles.sutraTitle, { color: theme.textPrimary }]}>पहला सूत्र — दया माँगना</Text>
                    <Text style={[styles.sutraDesc, { color: theme.textSecondary }]}>
                      "हे शिव! आप मेरे गुरु हैं, मुझ पर दया कर दीजिए।"
                    </Text>
                  </View>
                </View>

                <View style={styles.sutraDivider} />

                <View style={styles.sutraItem}>
                  <Text style={styles.sutraNumber}>२</Text>
                  <View style={styles.sutraTextCol}>
                    <Text style={[styles.sutraTitle, { color: theme.textPrimary }]}>दूसरा सूत्र — चर्चा करना</Text>
                    <Text style={[styles.sutraDesc, { color: theme.textSecondary }]}>
                      "अन्य लोगों से शिव गुरु की चर्चा करना तथा शिव को गुरु मानने की प्रेरणा देना।"
                    </Text>
                  </View>
                </View>

                <View style={styles.sutraDivider} />

                <View style={styles.sutraItem}>
                  <Text style={styles.sutraNumber}>३</Text>
                  <View style={styles.sutraTextCol}>
                    <Text style={[styles.sutraTitle, { color: theme.textPrimary }]}>तीसरा सूत्र — नमः शिवाय प्रणाम</Text>
                    <Text style={[styles.sutraDesc, { color: theme.textSecondary }]}>
                      "नमः शिवाय मंत्र से अपने गुरु शिव को 108 बार नमन/प्रणाम करना।"
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* SLIDE 2: PERSONALIZED NAME & AVATAR */}
          {step === 2 && (
            <View style={styles.slideContainer}>
              <View style={[styles.iconHeroCircle, { backgroundColor: theme.surfaceElevated, borderColor: theme.accent }]}>
                <Text style={{ fontSize: 54 }}>{selectedAvatar}</Text>
              </View>

              <Text style={[styles.slideTitle, { color: theme.primary }]}>
                आपका पावन नाम एवं पहचान ✍️
              </Text>
              <Text style={[styles.slideSub, { color: theme.textSecondary }]}>
                आप इस ऐप में किस नाम व प्रतीक से पहचाने जाना चाहते हैं? (ऐच्छिक)
              </Text>

              <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>आपका नाम लिखें:</Text>
                <TextInput
                  style={[
                    styles.nameInput,
                    {
                      backgroundColor: theme.surfaceElevated,
                      color: theme.textPrimary,
                      borderColor: theme.border,
                    },
                  ]}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="जैसे: शिव शिष्य, अमित, प्रिया..."
                  placeholderTextColor={theme.textMuted}
                />

                <Text style={[styles.label, { color: theme.textPrimary, marginTop: 18 }]}>
                  प्रतीक चिन्ह चुनें:
                </Text>
                <View style={styles.avatarRow}>
                  {AVATAR_OPTIONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.avatarOptionBtn,
                        {
                          backgroundColor: selectedAvatar === icon ? theme.primary : theme.surfaceElevated,
                          borderColor: selectedAvatar === icon ? theme.accent : theme.border,
                        },
                      ]}
                      onPress={() => setSelectedAvatar(icon)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontSize: 24 }}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* SLIDE 3: APP HIGHLIGHTS */}
          {step === 3 && (
            <View style={styles.slideContainer}>
              <View style={[styles.iconHeroCircle, { backgroundColor: theme.surfaceElevated, borderColor: theme.accent }]}>
                <Text style={{ fontSize: 54 }}>🔱</Text>
              </View>

              <Text style={[styles.slideTitle, { color: theme.primary }]}>
                आपकी साधना यात्रा प्रारंभ होने को तैयार है! ✨
              </Text>
              <Text style={[styles.slideSub, { color: theme.textSecondary }]}>
                शिव चर्चा ऐप की मुख्य सुविधाएं
              </Text>

              <View style={styles.featuresGrid}>
                <View style={[styles.featureBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                  <Text style={styles.featureIcon}>📿</Text>
                  <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>108 जाप साधना</Text>
                  <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>डिजिटल रुद्राक्ष माला व ध्वनि</Text>
                </View>

                <View style={[styles.featureBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                  <Text style={styles.featureIcon}>🛕</Text>
                  <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>शिव संसार</Text>
                  <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>12 ज्योतिर्लिंग व 51 शक्ति पीठ</Text>
                </View>

                <View style={[styles.featureBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                  <Text style={styles.featureIcon}>🖼️</Text>
                  <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>शेयर स्टूडियो</Text>
                  <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>पावन विचार कार्ड साझा करें</Text>
                </View>

                <View style={[styles.featureBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                  <Text style={styles.featureIcon}>🎶</Text>
                  <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>भक्ति संगीत</Text>
                  <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>भजन, स्तोत्र व ऑडियो साधना</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* BOTTOM ACTION BUTTON */}
        <View style={[styles.bottomBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={[styles.primaryActionText, { color: theme.textWhite }]}>
              {step < 3 ? 'आगे बढ़ें ➔' : 'जय शिव गुरु • ऐप प्रारंभ करें ➔'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  slideContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  iconHeroCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    ...shadows.soft,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  slideSub: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  sutraContainer: {
    width: '100%',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    ...shadows.soft,
  },
  sutraItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  sutraNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.goldPrimary,
    backgroundColor: colors.maroonDark,
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 12,
  },
  sutraTextCol: {
    flex: 1,
  },
  sutraTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  sutraDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  sutraDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 4,
  },
  formCard: {
    width: '100%',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    ...shadows.soft,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nameInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  avatarOptionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  featuresGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureBox: {
    width: (width - 52) / 2,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
    ...shadows.soft,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  primaryActionBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadows.soft,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
