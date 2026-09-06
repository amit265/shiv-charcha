import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { JapCounter } from '@/components/jap/JapCounter';

export default function JapScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="📿 108 जाप साधना" subtitle="तृतीय सूत्र — मंत्र माला साधना व रिकॉर्ड" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <JapCounter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
});
