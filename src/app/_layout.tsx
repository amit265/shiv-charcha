import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioProvider } from '../context/AudioContext';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.maroonPrimary,
            },
            headerTintColor: colors.goldLight,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: colors.bgIvory,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="puja" options={{ title: '🌸 शिव लिंग पूजा सेवा', presentation: 'modal' }} />
          <Stack.Screen name="jap" options={{ title: '📿 108 जाप साधना', presentation: 'card' }} />
          <Stack.Screen name="book/[id]" options={{ title: '📖 पुस्तक अध्ययन' }} />
          <Stack.Screen name="teaching/[id]" options={{ title: '💡 शिव गुरु ज्ञान' }} />
          <Stack.Screen name="date/[id]" options={{ title: '📅 पावन दिवस स्मरण' }} />
          <Stack.Screen name="gallery" options={{ title: '🖼️ पावन गैलरी व वॉलपेपर' }} />
          <Stack.Screen name="ringtones" options={{ title: '🔔 भक्तिमय ध्वनियाँ' }} />
        </Stack>

        {/* Global Persistent Mini-Player */}
        <MiniPlayer />
      </AudioProvider>
    </SafeAreaProvider>
  );
}
