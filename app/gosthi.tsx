import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';
import { useAudio } from '@/context/AudioContext';
import { safeShare } from '@/services/shareService';
import { getTodayCharchaPrompt } from '@/content/charchaPrompts';
import { SmartBanner } from '@/components/common/SmartBanner';

type GosthiTab = 'timer' | 'invite';

interface GosthiPhase {
  id: number;
  title: string;
  durationMinutes: number;
  icon: string;
  description: string;
  instruction: string;
}

const GOSTHI_PHASES: GosthiPhase[] = [
  {
    id: 1,
    title: 'प्रारंभिक मंगलाचरण व 108 जाप',
    durationMinutes: 5,
    icon: '📿',
    description: '3 बार "ॐ" ध्वनि और 108 बार "नमः शिवाय" मंत्र का शांत जाप।',
    instruction: 'सभी उपस्थित शिष्य एक साथ मिलकर 3 बार "ॐ" का उच्चारण करें और फिर 108 बार नमः शिवाय जाप करें।',
  },
  {
    id: 2,
    title: 'प्रथम सूत्र: दया प्रार्थना',
    durationMinutes: 5,
    icon: '🌸',
    description: 'शिव गुरु से भावपूर्वक दया माँगना।',
    instruction: 'सभी शिष्य आँखें बंद कर मन ही मन कहें: "हे शिव! आप मेरे गुरु हैं, मैं आपका शिष्य हूँ, मुझ पर दया कर दीजिए।"',
  },
  {
    id: 3,
    title: 'द्वितीय सूत्र: शिव चर्चा व अनुभव साझा',
    durationMinutes: 25,
    icon: '🗣️',
    description: 'आज के चर्चा विषय पर बातचीत और शिव गुरु के अनुभवों का आदान-प्रदान।',
    instruction: 'उपस्थित शिष्य बारी-बारी से अपने जीवन में शिव गुरु की दया के अनुभव साझा करें या आज के चर्चा विषय पर बात करें।',
  },
  {
    id: 4,
    title: 'समापन आरती व सादा प्रसाद',
    durationMinutes: 10,
    icon: '🛕',
    description: 'गुरु चरणों में कृतज्ञता नमन, आरती और सादा प्रसाद वितरण।',
    instruction: 'शिव गुरु की आरती या भजन गाएँ और सादा प्रसाद (जैसे गुड़-चना या फल) सबमें बाँटें।',
  },
];

export default function GosthiScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { playSoundEffect } = useAudio();
  const [activeTab, setActiveTab] = useState<GosthiTab>('timer');

  const todayPrompt = getTodayCharchaPrompt();

  // Timer State
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(GOSTHI_PHASES[0].durationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Invite Generator State
  const [hostName, setHostName] = useState<string>('');
  const [gosthiDate, setGosthiDate] = useState<string>(
    new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  );
  const [gosthiTime, setGosthiTime] = useState<string>('सायं 05:00 बजे');
  const [gosthiAddress, setGosthiAddress] = useState<string>('');

  const triggerHaptic = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {}
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prevSecs) => {
          if (prevSecs > 1) {
            return prevSecs - 1;
          }
          // Phase finished
          triggerHaptic();
          void playSoundEffect('chime');
          setCurrentPhaseIndex((prevIdx) => {
            if (prevIdx < GOSTHI_PHASES.length - 1) {
              const nextIdx = prevIdx + 1;
              setTimeout(() => {
                setSecondsRemaining(GOSTHI_PHASES[nextIdx].durationMinutes * 60);
              }, 0);
              return nextIdx;
            }
            setIsRunning(false);
            return prevIdx;
          });
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, playSoundEffect]);

  const handleStartPause = () => {
    triggerHaptic();
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    triggerHaptic();
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setSecondsRemaining(GOSTHI_PHASES[0].durationMinutes * 60);
  };

  const handleNextPhase = () => {
    triggerHaptic();
    if (currentPhaseIndex < GOSTHI_PHASES.length - 1) {
      const nextIdx = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIdx);
      setSecondsRemaining(GOSTHI_PHASES[nextIdx].durationMinutes * 60);
    }
  };

  const handlePrevPhase = () => {
    triggerHaptic();
    if (currentPhaseIndex > 0) {
      const prevIdx = currentPhaseIndex - 1;
      setCurrentPhaseIndex(prevIdx);
      setSecondsRemaining(GOSTHI_PHASES[prevIdx].durationMinutes * 60);
    }
  };

  const formatMinutesSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPhase = GOSTHI_PHASES[currentPhaseIndex];
  const phaseTotalSeconds = currentPhase.durationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((phaseTotalSeconds - secondsRemaining) / phaseTotalSeconds) * 100));

  const handleShareInvite = async () => {
    triggerHaptic();
    const nameStr = hostName.trim() ? hostName.trim() : 'शिव शिष्य परिवार';
    const addrStr = gosthiAddress.trim() ? gosthiAddress.trim() : 'निवास स्थान';

    const inviteMsg = `🌸 *पावन शिव चर्चा गोष्ठी निमंत्रण* 🌸\n\n*"जहाँ दो या दो से अधिक लोग शिव की चर्चा करते हैं, वह स्थान तीर्थ बन जाता है।"*\n- साहब श्री हरिंद्रानंद जी\n\nआप सभी गुरु भाइयों एवं गुरु बहनों को हमारे घर आयोजित पावन शिव चर्चा गोष्ठी में सादर आमंत्रित किया जाता है।\n\n📅 *दिनांक*: ${gosthiDate}\n⏰ *समय*: ${gosthiTime}\n📍 *स्थान*: ${addrStr}\n👤 *आयोजक*: ${nameStr}\n\n💡 *आज का चर्चा विषय*: "${todayPrompt.title}"\n\nआइए, मिलकर शिव गुरु की महिमा का आनंद लें।\nहर हर महादेव 🙏\nशिव चर्चा ऐप - https://mahavyomastudio.com/apps/shiv-charcha`;

    await safeShare({
      title: 'शिव चर्चा गोष्ठी निमंत्रण',
      message: inviteMsg,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🏡 शिव चर्चा गोष्ठी सहायिका" subtitle="45-मिनट गोष्ठी टाइमर व निमंत्रण" showBack />

      {/* TOP TAB CONTROLS */}
      <View style={[styles.tabBar, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'timer' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
          onPress={() => {
            triggerHaptic();
            setActiveTab('timer');
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabBtnText, { color: activeTab === 'timer' ? theme.textWhite : theme.textPrimary }]}>
            ⏱️ 45-मिनट गोष्ठी टाइमर
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'invite' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
          onPress={() => {
            triggerHaptic();
            setActiveTab('invite');
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabBtnText, { color: activeTab === 'invite' ? theme.textWhite : theme.textPrimary }]}>
            💌 व्हाट्सएप निमंत्रण कार्ड
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= TAB 1: GOSTHI TIMER ================= */}
        {activeTab === 'timer' && (
          <View style={styles.tabSection}>
            {/* Active Phase Display Card */}
            <View style={[styles.timerCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
              <View style={styles.phaseBadgeRow}>
                <View style={[styles.phaseBadge, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.phaseBadgeText, { color: theme.textWhite }]}>
                    चरण {currentPhase.id} of 4 • {currentPhase.durationMinutes} मिनट
                  </Text>
                </View>
                <Text style={[styles.statusText, { color: isRunning ? theme.accent : theme.textMuted }]}>
                  {isRunning ? '▶️ गोष्ठी जारी है' : '⏸️ विराम'}
                </Text>
              </View>

              <Text style={styles.phaseIcon}>{currentPhase.icon}</Text>
              <Text style={[styles.phaseTitle, { color: theme.primary }]}>{currentPhase.title}</Text>
              <Text style={[styles.phaseDesc, { color: theme.textSecondary }]}>{currentPhase.description}</Text>

              {/* Huge Timer Count */}
              <Text style={[styles.timerCount, { color: theme.textPrimary }]}>
                {formatMinutesSeconds(secondsRemaining)}
              </Text>

              {/* Progress Bar */}
              <View style={[styles.progressBarBg, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: theme.accent }]} />
              </View>

              {/* Instruction Box */}
              <View style={[styles.instructionBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Text style={[styles.instructionTitle, { color: theme.secondary }]}>📋 इस चरण में क्या करें:</Text>
                <Text style={[styles.instructionText, { color: theme.textPrimary }]}>{currentPhase.instruction}</Text>
              </View>

              {/* Quick Jump to Japa Counter if Phase 1 */}
              {currentPhase.id === 1 && (
                <TouchableOpacity
                  style={[styles.japJumpBtn, { backgroundColor: theme.primary }]}
                  onPress={() => router.push('/jap' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.japJumpBtnText, { color: theme.textWhite }]}>📿 डिजिटल रुद्राक्ष काउंटर खोलें ➔</Text>
                </TouchableOpacity>
              )}

              {/* Timer Controls Row */}
              <View style={styles.timerBtnRow}>
                <TouchableOpacity style={[styles.stepBtn, { backgroundColor: theme.surfaceElevated }]} onPress={handlePrevPhase} activeOpacity={0.8}>
                  <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>⏮️ पिछला</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mainPlayBtn, { backgroundColor: isRunning ? '#DC2626' : theme.accent }]}
                  onPress={handleStartPause}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.mainPlayBtnText, { color: isRunning ? '#FFFFFF' : theme.primaryDark }]}>
                    {isRunning ? '⏸️ रोकें (Pause)' : '▶️ शुरू करें (Start)'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.stepBtn, { backgroundColor: theme.surfaceElevated }]} onPress={handleNextPhase} activeOpacity={0.8}>
                  <Text style={[styles.stepBtnText, { color: theme.textPrimary }]}>अगला ⏭️</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
                <Text style={[styles.resetBtnText, { color: theme.textMuted }]}>🔄 पुनः शुरू करें (Reset)</Text>
              </TouchableOpacity>
            </View>

            {/* All 4 Phases Timeline Overview */}
            <View style={styles.timelineOverview}>
              <Text style={[styles.timelineTitle, { color: theme.primary }]}>📋 45-मिनट शिव चर्चा गोष्ठी संरचना</Text>
              {GOSTHI_PHASES.map((p, idx) => {
                const isCurrent = idx === currentPhaseIndex;
                const isPast = idx < currentPhaseIndex;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.timelineItem,
                      { backgroundColor: theme.cardBg, borderColor: isCurrent ? theme.accent : theme.border },
                      isCurrent && { borderWidth: 1.8 },
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setCurrentPhaseIndex(idx);
                      setSecondsRemaining(p.durationMinutes * 60);
                      setIsRunning(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.timelineIcon}>{p.icon}</Text>
                    <View style={styles.timelineTextCol}>
                      <Text style={[styles.timelineItemTitle, { color: isCurrent ? theme.primary : theme.textPrimary }]}>
                        {p.title}
                      </Text>
                      <Text style={[styles.timelineItemSub, { color: theme.textSecondary }]}>
                        {p.durationMinutes} मिनट • {p.description}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16 }}>{isPast ? '✅' : isCurrent ? '▶️' : '⏳'}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ================= TAB 2: WHATSAPP INVITATION GENERATOR ================= */}
        {activeTab === 'invite' && (
          <View style={styles.tabSection}>
            <View style={[styles.inviteCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
              <Text style={[styles.inviteHeading, { color: theme.primary }]}>💌 शिव चर्चा गोष्ठी निमंत्रण बनाएँ</Text>
              <Text style={[styles.inviteSub, { color: theme.textSecondary }]}>
                विवरण दर्ज करें और एक क्लिक में सुंदर व्हाट्सएप निमंत्रण कार्ड शेयर करें।
              </Text>

              {/* Input Form */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.primary }]}>👤 आयोजक का नाम (Host Name):</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.surfaceElevated, color: theme.textPrimary, borderColor: theme.border }]}
                  placeholder="उदा. गुरु भाई रमेश शर्मा"
                  placeholderTextColor={theme.textMuted}
                  value={hostName}
                  onChangeText={setHostName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.primary }]}>📅 दिनांक (Date):</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.surfaceElevated, color: theme.textPrimary, borderColor: theme.border }]}
                  placeholder="उदा. आगामी रविवार (12 अक्टूबर)"
                  placeholderTextColor={theme.textMuted}
                  value={gosthiDate}
                  onChangeText={setGosthiDate}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.primary }]}>⏰ समय (Time):</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.surfaceElevated, color: theme.textPrimary, borderColor: theme.border }]}
                  placeholder="उदा. शाम 05:00 बजे"
                  placeholderTextColor={theme.textMuted}
                  value={gosthiTime}
                  onChangeText={setGosthiTime}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.primary }]}>📍 स्थान / पता (Address):</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.surfaceElevated, color: theme.textPrimary, borderColor: theme.border }]}
                  placeholder="उदा. मकान नं 45, शिव नगर, पटना"
                  placeholderTextColor={theme.textMuted}
                  value={gosthiAddress}
                  onChangeText={setGosthiAddress}
                />
              </View>

              {/* Live Preview Box */}
              <View style={[styles.previewBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
                <Text style={[styles.previewHeader, { color: theme.primary }]}>👁️ निमंत्रण कार्ड पूर्वावलोकन (Preview):</Text>
                <Text style={[styles.previewText, { color: theme.textPrimary }]}>
                  🌸 *पावन शिव चर्चा गोष्ठी निमंत्रण* 🌸{'\n\n'}
                  *{'"'}जहाँ दो या दो से अधिक लोग शिव की चर्चा करते हैं, वह स्थान तीर्थ बन जाता है।{'"'}*{'\n'}
                  - साहब श्री हरिंद्रानंद जी{'\n\n'}
                  📅 *दिनांक*: {gosthiDate}{'\n'}
                  ⏰ *समय*: {gosthiTime}{'\n'}
                  📍 *स्थान*: {gosthiAddress.trim() ? gosthiAddress : 'निवास स्थान'}{'\n'}
                  👤 *आयोजक*: {hostName.trim() ? hostName : 'शिव शिष्य परिवार'}{'\n\n'}
                  💡 *आज का चर्चा विषय*: {`"${todayPrompt.title}"`}{'\n\n'}
                  हर हर महादेव 🙏
                </Text>
              </View>

              {/* Share Button */}
              <TouchableOpacity
                style={[styles.shareInviteBtn, { backgroundColor: '#25D366' }]}
                onPress={handleShareInvite}
                activeOpacity={0.88}
              >
                <Text style={styles.shareInviteBtnText}>📲 व्हाट्सएप पर निमंत्रण भेजें</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <SmartBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  tabSection: {
    width: '100%',
  },

  /* TIMER CARD STYLES */
  timerCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.2,
    alignItems: 'center',
    marginBottom: 20,
    ...shadows.soft,
  },
  phaseBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  phaseBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  phaseIcon: {
    fontSize: 48,
    marginVertical: 4,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  phaseDesc: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  timerCount: {
    fontSize: 56,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
    marginVertical: 8,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
  },
  instructionBox: {
    width: '100%',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  japJumpBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  japJumpBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  timerBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  stepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainPlayBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  mainPlayBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetBtn: {
    marginTop: 14,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* TIMELINE OVERVIEW STYLES */
  timelineOverview: {
    width: '100%',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  timelineIcon: {
    fontSize: 24,
  },
  timelineTextCol: {
    flex: 1,
  },
  timelineItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timelineItemSub: {
    fontSize: 11,
    marginTop: 2,
  },

  /* INVITATION GENERATOR STYLES */
  inviteCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.2,
    ...shadows.soft,
  },
  inviteHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inviteSub: {
    fontSize: 12,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 13,
  },
  previewBox: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginVertical: 16,
  },
  previewHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 13,
    lineHeight: 20,
  },
  shareInviteBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  shareInviteBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
