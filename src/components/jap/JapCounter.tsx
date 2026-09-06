import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { StorageService } from '../../services/storage';
import { safeShare } from '../../services/shareService';

interface JapCounterProps {
  targetCount?: number;
  onComplete?: () => void;
}

export const JapCounter: React.FC<JapCounterProps> = ({ targetCount = 108, onComplete }) => {
  const { theme } = useTheme();
  const [count, setCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  const handleTap = async () => {
    if (isCompleted) return;

    const nextCount = count + 1;
    setCount(nextCount);

    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {}

    if (nextCount >= targetCount) {
      setIsCompleted(true);
      setShowCompletionModal(true);
      await StorageService.recordJapCompletion(targetCount);
      if (onComplete) onComplete();
    }
  };

  const handleReset = () => {
    setCount(0);
    setIsCompleted(false);
    setShowCompletionModal(false);
  };

  const handleShareCard = async () => {
    await safeShare({
      title: '108 जाप पूर्ण',
      message: `आज का 108 जाप पूरा हुआ 🙏\n\n'ॐ नमः शिवाय'\nशिव गुरु की अहैतुकी दया हम सब पर बनी रहे।\n\n— शिव चर्चा ऐप द्वारा`,
    });
  };

  const progressPercent = Math.min(100, Math.round((count / targetCount) * 100));

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryDark, borderColor: theme.accent }]}>
      <Text style={[styles.mantraText, { color: theme.textGold }]}>ॐ नमः शिवाय</Text>
      <Text style={[styles.subText, { color: theme.textWhite }]}>तृतीय सूत्र — 108 जाप साधना</Text>

      {/* Counter Ring Touch Area */}
      <TouchableOpacity
        style={styles.ringContainer}
        activeOpacity={0.85}
        onPress={handleTap}
        disabled={isCompleted}
      >
        <View style={[styles.outerRing, { borderColor: theme.accent }]}>
          <View style={[styles.innerCircle, { backgroundColor: theme.cardBgMaroon, borderColor: theme.borderGold }]}>
            <Text style={[styles.countNumber, { color: theme.textGold }]}>{count}</Text>
            <Text style={[styles.targetLabel, { color: theme.textWhite }]}>/ {targetCount}</Text>
            <Text style={[styles.tapPrompt, { color: theme.textGold }]}>{isCompleted ? 'जाप पूर्ण 🙏' : 'यहाँ स्पर्श करें'}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: theme.accent }]} />
      </View>
      <Text style={[styles.percentText, { color: theme.textWhite }]}>{progressPercent}% जाप पूर्ण</Text>

      {/* Actions */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={[styles.resetBtn, { borderColor: theme.borderGold }]} onPress={handleReset} activeOpacity={0.7}>
          <Text style={[styles.resetText, { color: theme.textGold }]}>↺ पुनः आरम्भ करें</Text>
        </TouchableOpacity>
      </View>

      {/* Completion Modal */}
      <Modal visible={showCompletionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}>
            <Text style={styles.modalEmoji}>🌺🙏📿</Text>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>आज का 108 जाप पूरा हुआ</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
              हे शिव! आप मेरे गुरु हैं, मैं आपका शिष्य हूँ। मुझ पर दया कर दीजिए।
            </Text>

            <TouchableOpacity style={[styles.shareCardBtn, { backgroundColor: theme.primary }]} onPress={handleShareCard} activeOpacity={0.8}>
              <Text style={[styles.shareCardBtnText, { color: theme.textWhite }]}>📤 108 जाप कार्ड साझा करें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowCompletionModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeModalText, { color: theme.textSecondary }]}>बन्द करें</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.goldPrimary,
    ...shadows.medium,
  },
  mantraText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.goldLight,
    letterSpacing: 1,
  },
  subText: {
    fontSize: 13,
    color: colors.bgIvory,
    opacity: 0.85,
    marginTop: 4,
    marginBottom: 20,
  },
  ringContainer: {
    marginVertical: 12,
  },
  outerRing: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 4,
    borderColor: colors.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    ...shadows.gold,
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.maroonDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  countNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  targetLabel: {
    fontSize: 14,
    color: colors.bgIvory,
    opacity: 0.7,
    marginTop: -4,
  },
  tapPrompt: {
    fontSize: 11,
    color: colors.goldPrimary,
    marginTop: 6,
    fontWeight: '600',
  },
  progressBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.goldPrimary,
  },
  percentText: {
    fontSize: 12,
    color: colors.goldPrimary,
    marginTop: 6,
    fontWeight: 'bold',
  },
  controlsRow: {
    marginTop: 16,
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  resetText: {
    fontSize: 12,
    color: colors.bgIvory,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.maroonPrimary,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.goldPrimary,
    width: '90%',
    maxWidth: 360,
  },
  modalEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.goldLight,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: colors.bgIvory,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  shareCardBtn: {
    backgroundColor: colors.goldPrimary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  shareCardBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  closeModalBtn: {
    marginTop: 12,
    paddingVertical: 8,
  },
  closeModalText: {
    fontSize: 13,
    color: colors.bgIvory,
    opacity: 0.8,
  },
});
