import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { colors, shadows } from '../../theme/colors';

type DeviceMode = 'iphone' | 'ipad' | 'full';

interface WebDeviceFrameProps {
  children: React.ReactNode;
}

export const WebDeviceFrame: React.FC<WebDeviceFrameProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const saved = window.sessionStorage?.getItem('shiv_charcha_web_mode') as DeviceMode;
      if (saved && ['iphone', 'ipad', 'full'].includes(saved)) {
        return saved;
      }
    }
    return 'iphone';
  });

  const changeMode = (mode: DeviceMode) => {
    setDeviceMode(mode);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.sessionStorage?.setItem('shiv_charcha_web_mode', mode);
    }
  };

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.webWrapper}>
      {/* Top Device Switcher Control Bar */}
      <View style={styles.switcherBar}>
        <View style={styles.brandTag}>
          <Text style={styles.brandOm}>ॐ</Text>
          <Text style={styles.brandTitle}>शिव चर्चा • हर हर महादेव</Text>
        </View>

        <View style={styles.modeButtonsRow}>
          <TouchableOpacity
            style={[styles.modeBtn, deviceMode === 'iphone' && styles.modeBtnActive]}
            onPress={() => changeMode('iphone')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, deviceMode === 'iphone' && styles.modeBtnTextActive]}>
              📱 iPhone साइज
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, deviceMode === 'ipad' && styles.modeBtnActive]}
            onPress={() => changeMode('ipad')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, deviceMode === 'ipad' && styles.modeBtnTextActive]}>
              📱 iPad साइज
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, deviceMode === 'full' && styles.modeBtnActive]}
            onPress={() => changeMode('full')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, deviceMode === 'full' && styles.modeBtnTextActive]}>
              🖥️ फुल स्क्रीन
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Frame Container */}
      <View style={styles.canvasContainer}>
        {deviceMode === 'full' ? (
          <View style={styles.fullScreenFrame}>{children}</View>
        ) : (
          <View
            style={[
              styles.deviceMockup,
              deviceMode === 'iphone' ? styles.iphoneDimensions : styles.ipadDimensions,
            ]}
          >
            {/* Notch / Dynamic Island */}
            {deviceMode === 'iphone' && (
              <View style={styles.iphoneNotch}>
                <View style={styles.cameraDot} />
              </View>
            )}

            {/* App View Screen */}
            <View style={styles.screenInner}>{children}</View>

            {/* Bottom Home Indicator */}
            <View style={styles.homeIndicatorBar}>
              <View style={styles.homeIndicator} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#1E1417',
    ...(Platform.OS === 'web' ? { minHeight: '100vh' as any } : {}),
    width: '100%',
  },
  switcherBar: {
    height: 52,
    backgroundColor: colors.maroonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.goldPrimary,
    zIndex: 9999,
  },
  brandTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandOm: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.goldPrimary,
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  modeButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 8,
  },
  modeBtnActive: {
    backgroundColor: colors.goldPrimary,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.bgIvory,
  },
  modeBtnTextActive: {
    color: colors.maroonDark,
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    ...(Platform.OS === 'web' ? { overflow: 'auto' as any } : {}),
  },
  fullScreenFrame: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.bgIvory,
  },
  deviceMockup: {
    backgroundColor: colors.bgIvory,
    borderRadius: 44,
    borderWidth: 10,
    borderColor: '#3B070C',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  iphoneDimensions: {
    width: 393,
    height: 852,
    maxWidth: '100%',
  },
  ipadDimensions: {
    width: 820,
    height: 1080,
    maxWidth: '100%',
  },
  iphoneNotch: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 110,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000000',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 14,
  },
  cameraDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111122',
  },
  screenInner: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  homeIndicatorBar: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.maroonPrimary,
    opacity: 0.5,
  },
});
