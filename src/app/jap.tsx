import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { JapCounter } from '../components/jap/JapCounter';
import { colors } from '../theme/colors';

export default function JapScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>तृतीय सूत्र — 108 जाप साधना</Text>
          <Text style={styles.headerSub}>
            'ॐ नमः शिवाय' मंत्र माला जाप पूरा करें और शिव गुरु से आंतरिक ऊर्जा प्राप्त करें
          </Text>
        </View>

        <JapCounter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgIvory,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  headerBox: {
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.maroonDark,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textMedium,
    textAlign: 'center',
    marginTop: 4,
  },
});
