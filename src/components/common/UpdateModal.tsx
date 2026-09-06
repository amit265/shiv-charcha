import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';
import { UpdateCheckResult, UpdateService } from '@/services/updateService';

interface UpdateModalProps {
  visible: boolean;
  updateInfo: UpdateCheckResult | null;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ visible, updateInfo, onClose }) => {
  const { theme } = useTheme();

  if (!visible || !updateInfo) return null;

  const handleUpdatePress = async () => {
    try {
      await Linking.openURL(updateInfo.updateUrl);
    } catch (e) {}
  };

  const handleDismiss = async () => {
    await UpdateService.dismissUpdate(updateInfo.latestVersion);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: theme.accent }]}>
            <Text style={[styles.badgeText, { color: theme.primaryDark }]}>🎉 नया संस्करण उपलब्ध</Text>
          </View>

          <Text style={[styles.title, { color: theme.primary }]}>
            शिव चर्चा v{updateInfo.latestVersion}
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            ऐप में नए पावन फीचर्स व सुधार जोड़े गए हैं:
          </Text>

          {/* Whats New List */}
          <ScrollView style={styles.whatsNewScroll} showsVerticalScrollIndicator={false}>
            {updateInfo.whatsNew.map((item, index) => (
              <View key={index} style={styles.whatsNewRow}>
                <Text style={[styles.bullet, { color: theme.accent }]}>🌸</Text>
                <Text style={[styles.itemText, { color: theme.textPrimary }]}>{item}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.updateBtn, { backgroundColor: theme.primary }]}
              onPress={handleUpdatePress}
              activeOpacity={0.85}
            >
              <Text style={[styles.updateBtnText, { color: theme.textWhite }]}>🚀 अभी अपडेट करें</Text>
            </TouchableOpacity>

            {!updateInfo.forceUpdate && (
              <TouchableOpacity
                style={[styles.laterBtn, { borderColor: theme.border }]}
                onPress={handleDismiss}
                activeOpacity={0.7}
              >
                <Text style={[styles.laterBtnText, { color: theme.textMuted }]}>बाद में</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 14,
  },
  whatsNewScroll: {
    maxHeight: 180,
    marginBottom: 16,
  },
  whatsNewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 12,
    marginRight: 8,
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  updateBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  updateBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  laterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  laterBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
