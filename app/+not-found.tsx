import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '@/context/ThemeContext';
import { APP_LINKS } from '@/constants/links';

export default function NotFoundScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    // Gracefully handle any unmatched deep link path by redirecting to home tab
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'शिव चर्चा', headerShown: false }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.primary }]}>जय शिव शंकर 🙏</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
