import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { colors, shadows } from '@/theme/colors';
import { StorageService, defaultPreferences } from '@/services/storage';
import { UserPreferences } from '@/types';
import { safeShare } from '@/services/shareService';
import { APP_CONFIG, APP_LINKS, CROSS_PROMO_APPS } from '@/constants/links';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themeId } = useTheme();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'copyright' | 'disclaimer' | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const p = await StorageService.getPreferences();
    setPrefs(p);
  };

  const toggleSound = async (val: boolean) => {
    await StorageService.savePreferences({ soundEnabled: val });
    setPrefs((prev) => ({ ...prev, soundEnabled: val }));
  };

  const toggleHaptics = async (val: boolean) => {
    await StorageService.savePreferences({ hapticsEnabled: val });
    setPrefs((prev) => ({ ...prev, hapticsEnabled: val }));
  };

  const toggleNotifications = async (val: boolean) => {
    await StorageService.savePreferences({ notificationsEnabled: val });
    setPrefs((prev) => ({ ...prev, notificationsEnabled: val }));
  };

  const handleShareApp = async () => {
    await safeShare({
      title: 'शिव चर्चा ऐप शेयर करें',
      message: `🌸 *${APP_CONFIG.appNameHindi}* 🌸\n\nसाहब श्री हरिंद्रानंद जी एवं दीदी नीलम आनंद जी के विचार, 12 ज्योतिर्लिंग दर्शन, 51 शक्ति पीठ, शिव कथाएँ, स्तोत्र पाठ एवं 108 जाप साधना!\n\nडाउनलोड करें: ${APP_LINKS.playStoreUrl}\n\nहर हर महादेव 🙏`,
    });
  };

  const handleRateApp = async () => {
    const playStoreUrl = APP_LINKS.playStoreUrl;
    try {
      const supported = await Linking.canOpenURL(playStoreUrl);
      if (supported) {
        await Linking.openURL(playStoreUrl);
      } else {
        Alert.alert('रेटिंग', 'प्ले स्टोर लिंक खोलने में असमर्थ। ऐप स्टोर पर "शिव चर्चा" खोजें।');
      }
    } catch (e) {
      Alert.alert('रेटिंग', 'प्ले स्टोर खोलने में असमर्थ।');
    }
  };

  const handleOpenOtherApp = async (appName: string, url: string) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert(appName, `एप डाउनलोड पेज पर जाने के लिए गूगल प्ले स्टोर पर "${appName}" खोजें।`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="⚙️ ऐप सेटिंग्स" subtitle="अनुभव अनुकूलन • कानूनी नीतियाँ • शेयर" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SECTION 1: THEME SELECTOR */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>रंग-सज्जा एवं दृश्य (Theme & Visuals) 🎨</Text>
        <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
          onPress={() => router.push('/theme-selector' as any)}
          activeOpacity={0.8}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={{ fontSize: 22 }}>🎨</Text>
            </View>
            <View style={styles.cardTextCol}>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>ऐप रंग-सज्जा (App Theme)</Text>
              <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>
                वर्तमान थीम: <Text style={{ fontWeight: 'bold', color: theme.primary }}>{theme.nameHindi}</Text>
              </Text>
            </View>
            <View style={[styles.actionBadge, { backgroundColor: theme.primary }]}>
              <Text style={[styles.actionBadgeText, { color: theme.textWhite }]}>बदलें ➔</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* SECTION 2: AUDIO & SOUND SETTINGS */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>ध्वनि एवं अनुभूतियाँ (Sound & Haptics) 🔊</Text>
        <View style={[styles.settingGroupCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={[styles.switchRow, { borderBottomColor: theme.border }]}>
            <View style={styles.switchTextCol}>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>🔊 ध्वनि प्रभाव (Sound Effects)</Text>
              <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>जाप काउंटर व ऐप इंटरैक्शन ध्वनि</Text>
            </View>
            <Switch
              value={prefs.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#D7CCC8', true: theme.accent }}
              thumbColor={prefs.soundEnabled ? theme.primary : '#F5F5F5'}
            />
          </View>

          <View style={[styles.switchRow, { borderBottomColor: theme.border }]}>
            <View style={styles.switchTextCol}>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>📳 कंपन प्रतिक्रिया (Vibration Feedback)</Text>
              <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>जाप मणके स्पर्श करने पर हल्का कंपन</Text>
            </View>
            <Switch
              value={prefs.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#D7CCC8', true: theme.accent }}
              thumbColor={prefs.hapticsEnabled ? theme.primary : '#F5F5F5'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>🔔 दैनिक स्मरण सूचनाएं (Notifications)</Text>
              <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>प्रातः एवं सायं पावन विचार सूचनाएं</Text>
            </View>
            <Switch
              value={prefs.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#D7CCC8', true: theme.accent }}
              thumbColor={prefs.notificationsEnabled ? theme.primary : '#F5F5F5'}
            />
          </View>
        </View>

        {/* SECTION 2.5: LANGUAGE SELECTION */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>भाषा (Language Preference) 🌐</Text>
        <View style={[styles.settingGroupCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => Alert.alert('Language / भाषा', 'App language set to English & Hindi bilingual mode.')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>🌐</Text>
              <View>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>App Language / ऐप भाषा</Text>
                <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>English & हिंदी (Bilingual Mode)</Text>
              </View>
            </View>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>English / हिंदी</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 3: SHARE & RATE APP */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>पुण्य प्रसार एवं समीक्षा (Share & Rate) 🌸</Text>
        <View style={[styles.settingGroupCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: theme.border }]} onPress={handleShareApp} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>📤</Text>
              <View>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>मित्रों एवं परिवार संग शेयर करें</Text>
                <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>शिव गुरु संदेश एवं ऐप लिंक साझा करें</Text>
              </View>
            </View>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>शेयर ➔</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleRateApp} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>⭐</Text>
              <View>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>गूगल प्ले स्टोर पर रेट करें</Text>
                <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>अपना बहुमूल्य अनुभव व 5-स्टार रेटिंग दें</Text>
              </View>
            </View>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>रेट करें ➔</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 4: OUR OTHER APPS (MAHAVYOMA STUDIO CROSS PROMOTION) */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>हमारे अन्य पावन ऐप (Our Devotional Apps) 📱</Text>
        <View style={styles.otherAppsContainer}>
          {CROSS_PROMO_APPS.map((app) => (
            <TouchableOpacity
              key={app.id}
              style={[styles.appPromoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              onPress={() => handleOpenOtherApp(app.title, app.url)}
              activeOpacity={0.85}
            >
              <Text style={styles.appPromoIcon}>{app.icon}</Text>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.appPromoTitle, { color: theme.textPrimary }]}>{app.titleHindi}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      backgroundColor: app.badgeText === 'Live' ? '#2E7D32' : theme.accent,
                      paddingHorizontal: 6,
                      paddingVertical: 1,
                      borderRadius: 6,
                      marginLeft: 8,
                    }}
                  >
                    {app.badgeText}
                  </Text>
                </View>
                <Text style={[styles.appPromoSub, { color: theme.textSecondary }]}>
                  {app.descriptionHindi}
                </Text>
              </View>
              <Text style={[styles.appInstallBtn, { color: theme.primary, borderColor: theme.primary }]}>देखें</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECTION 5: LEGAL LINKS & POLICIES */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>कानूनी जानकारी एवं नीतियाँ (Legal & Policies) 📜</Text>
        <View style={[styles.settingGroupCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.actionRow, { borderBottomColor: theme.border }]}
            onPress={() => setActiveModal('privacy')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>🔒</Text>

              <View>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>गोपनीयता नीति (Privacy Policy)</Text>

                <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>डेटा सुरक्षा एवं निजता नियम</Text>

              </View>

            </View>

            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>पढ़ें ➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, { borderBottomColor: theme.border }]}
            onPress={() => setActiveModal('terms')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>📜</Text>

              <View>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>सेवा की शर्तें (Terms of Service)</Text>

                <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>उपयोग के सामान्य नियम एवं शर्तें</Text>

              </View>

            </View>

            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>पढ़ें ➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, { borderBottomColor: theme.border }]}
            onPress={() => setActiveModal('copyright')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>ℹ️</Text>

              <View>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>सामग्री सर्वाधिकार एवं आभार (Sourcing & Copyright)</Text>

                <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>साहब श्री हरिंद्रानंद जी एवं स्त्रोत आभार</Text>

              </View>

            </View>

            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>पढ़ें ➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setActiveModal('disclaimer')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>🤝</Text>

              <View>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>अस्वीकरण (Disclaimer)</Text>

                <Text style={[styles.itemDesc, { color: theme.textSecondary }]}>भक्ति एवं आध्यात्मिक प्रयोजन घोषणा</Text>

              </View>

            </View>

            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>पढ़ें ➔</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 6: APP INFO FOOTER */}
        <View style={[styles.appInfoCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
          <View style={styles.brandRow}>
            <View style={[styles.brandLogo, { backgroundColor: theme.primary }]}>
              <Text style={{ fontSize: 24 }}>🔱</Text>
            </View>

            <View>
              <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>शिव चर्चा</Text>

              <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>हर हर महादेव • शिव गुरु साधना</Text>

            </View>

          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Text style={[styles.infoDetail, { color: theme.textSecondary }]}>
            संस्करण (Version): <Text style={{ fontWeight: 'bold', color: theme.textPrimary }}>1.0.0 (Build 100)</Text>
          </Text>

          <Text style={[styles.infoDetail, { color: theme.textSecondary, marginTop: 2 }]}>
            विकासक (Developer): <Text style={{ fontWeight: 'bold', color: theme.primary }}>Mahavyoma Studio</Text>
          </Text>

          <Text style={[styles.infoFooterText, { color: theme.textMuted }]}>
            सर्वाधिकार सुरक्षित © 2026 महाव्योम स्टूडियो। सभी शिव भक्तों के कल्याणार्थ समर्पित।
          </Text>

        </View>

      </ScrollView>

      {/* LEGAL MODAL POPUP */}
      <Modal
        visible={activeModal !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>
                {activeModal === 'privacy' && '🔒 गोपनीयता नीति (Privacy Policy)'}
                {activeModal === 'terms' && '📜 सेवा की शर्तें (Terms of Service)'}
                {activeModal === 'copyright' && 'ℹ️ सामग्री आभार एवं कॉपीराइट'}
                {activeModal === 'disclaimer' && '🤝 अस्वीकरण (Disclaimer)'}
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModal(null)}>
                <Text style={{ fontSize: 18, color: theme.textPrimary, fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={true}>
              {activeModal === 'privacy' && (
                <View style={styles.modalContent}>
                  <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>1. निजता एवं डेटा सुरक्षा</Text>
                  <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                    शिव चर्चा ऐप उपयोगकर्ताओं की निजता का पूर्ण सम्मान करता है। यह ऐप आपकी कोई भी व्यक्तिगत जानकारी (जैसे नाम, फोन नंबर, या लोकेशन) किसी तृतीय पक्ष के साथ साझा या विक्रय नहीं करता है।
                  </Text>

                  <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>2. स्थानीय डेटा संग्रहण (Offline-First Storage)</Text>
                  <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                    आपकी जाप संख्या, अध्ययन स्थिति तथा पसंदीदा विषय-सूची केवल आपके मोबाइल फोन में सुरक्षित रूप से स्थानीय (AsyncStorage) में संगृहीत होती है।
                  </Text>

                  <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>3. विश्लेषिकी व विज्ञापन (Analytics & Ads)</Text>
                  <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                    ऐप के सुचारू संचालन एवं रखरखाव हेतु गूगल एडमॉब (AdMob) एवं फायरबेस एनालिटिक्स की मानक सेवाओं का उपयोग किया जा सकता है जो गूगल की गोपनीयता नीतियों के अधीन हैं।
                  </Text>

                  <TouchableOpacity
                    style={{
                      marginTop: 16,
                      padding: 12,
                      backgroundColor: theme.primary,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => Linking.openURL(APP_LINKS.privacyPolicyUrl)}
                  >
                    <Text style={{ color: theme.textWhite, fontWeight: 'bold', fontSize: 14 }}>
                      🌐 अधिकारी वेबसाइट पर गोपनीयता नीति खोलें
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeModal === 'terms' && (
                <View style={styles.modalContent}>
                  <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>1. उपयोग के नियम</Text>
                  <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                    शिव चर्चा ऐप का उपयोग केवल व्यक्तिगत, भक्तिमय तथा गैर-व्यावसायिक आध्यात्मिक उद्देश्यों के लिए ही किया जा सकता है।
                  </Text>

                  <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>2. बौद्धिक संपदा एवं सामग्री</Text>
                  <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                    ऐप में प्रस्तुत विचार, स्तोत्र पाठ, चित्र एवं ऑडियो भक्तिमयी परंपरा से संबंधित हैं। किसी भी व्यावसायिक पुनःप्रकाशन से पूर्व उचित अनुमति आवश्यक है।
                  </Text>

                  <TouchableOpacity
                    style={{
                      marginTop: 16,
                      padding: 12,
                      backgroundColor: theme.primary,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => Linking.openURL(APP_LINKS.termsOfServiceUrl)}
                  >
                    <Text style={{ color: theme.textWhite, fontWeight: 'bold', fontSize: 14 }}>
                      🌐 आधिकारिक वेबसाइट पर सेवा शर्तें खोलें
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeModal === 'copyright' && (
                <View style={styles.modalContent}>
                  <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>पावन प्रेरणा व विचार आभार 🌸</Text>
                  <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                    शिव चर्चा के तीन मुख्य सूत्रों तथा शिव को गुरु मानने की विचारधारा के मूल प्रेरक साहब श्री हरिंद्रानंद जी एवं दीदी माँ नीलम आनंद जी हैं। हम उनके पावन चरणों में कोटि-कोटि नमन व आभार व्यक्त करते हैं।
                  </Text>

                  <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>स्तोत्र व पौराणिक ग्रन्थ</Text>
                  <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                    12 ज्योतिर्लिंग कथाएँ, शक्ति पीठ विवरण, शिव तांडव स्तोत्र, द्वादश ज्योतिर्लिंग स्तोत्र एवं नामावली पारंपरिक पौराणिक शास्त्रों व सार्वजनिक ज्ञानकोश पर आधारित हैं।
                  </Text>
                </View>
              )}

              {activeModal === 'disclaimer' && (
                <View style={styles.modalContent}>
                  <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>भक्ति एवं आध्यात्मिक प्रयोजन</Text>
                  <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                    यह ऐप शिव भक्तों के आध्यात्मिक कल्याण, नियमित साधना एवं ज्ञान संवर्धन हेतु निष्काम भाव से तैयार किया गया है। ऐप में निहित समस्त विषय-वस्तु जन-कल्याणार्थ एवं धार्मिक जागरूकता फैलाने के उद्देश्य से प्रस्तुत की गई है।
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseFooterBtn, { backgroundColor: theme.primary }]}
              onPress={() => setActiveModal(null)}
            >
              <Text style={[styles.modalCloseFooterText, { color: theme.textWhite }]}>समझ गया / बंद करें</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 10,
  },
  settingCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    ...shadows.soft,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  actionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingGroupCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 14,
    borderWidth: 1,
    ...shadows.soft,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  actionIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  otherAppsContainer: {
    marginBottom: 14,
  },
  appPromoCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.soft,
  },
  appPromoIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  appPromoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  appPromoSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  appInstallBtn: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 8,
  },
  appInfoCard: {
    borderRadius: 20,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  infoDetail: {
    fontSize: 13,
    lineHeight: 20,
  },
  infoFooterText: {
    fontSize: 11,
    marginTop: 12,
    lineHeight: 16,
    textAlign: 'center',
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
    ...shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    marginVertical: 14,
  },
  modalContent: {
    paddingVertical: 4,
  },
  modalHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  modalBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  modalCloseFooterBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  modalCloseFooterText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
