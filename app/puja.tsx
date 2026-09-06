import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { ShivlingPujaCanvas } from '@/components/puja/ShivlingPujaCanvas';

export default function PujaScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="🌸 शिव लिंग पूजा सेवा" subtitle="पुष्प, जल, बेलपत्र व आरती सेवा" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ShivlingPujaCanvas />
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
