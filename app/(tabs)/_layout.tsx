import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // Dynamic bottom inset to clear 3-button navigation on Android and gesture bar on iOS
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 14 : 0);
  const tabBarHeight = 58 + bottomInset;
  const paddingBottom = bottomInset + 4;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.saffronPrimary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: paddingBottom,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'मुख्य पृष्ठ',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="charcha"
        options={{
          title: 'शिव चर्चा',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>📖</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'कैलेंडर',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>📅</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: 'शेयर स्टूडियो',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>🖼️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'प्रोफाइल',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgIvory,
    borderTopWidth: 2,
    borderTopColor: colors.borderGold,
    paddingTop: 6,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.7,
  },
  tabIconActive: {
    opacity: 1.0,
    transform: [{ scale: 1.15 }],
  },
});
