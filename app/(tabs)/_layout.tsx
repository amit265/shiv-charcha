import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet, Platform, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';

const TAB_ICONS: Record<string, string> = {
  index: '🏠',
  charcha: '📖',
  sansar: '🔱',
  share: '🖼️',
  profile: '👤',
};

interface CustomFloatingTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomFloatingTabBar({ state, descriptors, navigation }: CustomFloatingTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 6);

  return (
    <View
      style={[
        styles.floatingContainer,
        {
          bottom: bottomInset + 8,
          backgroundColor: theme.navigationBackground,
          borderColor: theme.accent,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const icon = TAB_ICONS[route.name] || '🔱';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            activeOpacity={0.85}
            style={[
              styles.tabItem,
              isFocused && [styles.tabItemActive, { backgroundColor: theme.primary }],
            ]}
          >
            <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
              {icon}
            </Text>
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? theme.textWhite : theme.textMuted },
                isFocused && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomFloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'मुख्य पृष्ठ' }} />
      <Tabs.Screen name="charcha" options={{ title: 'शिव चर्चा' }} />
      <Tabs.Screen name="sansar" options={{ title: 'शिव संसार' }} />
      <Tabs.Screen name="share" options={{ title: 'शेयर स्टूडियो' }} />
      <Tabs.Screen name="profile" options={{ title: 'प्रोफाइल' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    borderRadius: 32,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    borderWidth: 1.8,
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    zIndex: 999,
  },
  tabItem: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  tabItemActive: {
    transform: [{ scale: 1.04 }],
    ...shadows.soft,
  },
  tabIcon: {
    fontSize: 19,
    opacity: 0.7,
  },
  tabIconActive: {
    fontSize: 21,
    opacity: 1.0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: 'bold',
  },
});
