import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { ShivlingPujaCanvas } from '@/components/puja/ShivlingPujaCanvas';
import { colors } from '@/theme/colors';

export default function PujaScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>शिव लिंग पूजा एवं अभिषेक सेवा</Text>
          <Text style={styles.headerSub}>
            भक्ति भाव से पुष्प, बेलपत्र, जलधारा, दुग्धधारा अर्पित करें व शंखनाद करें
          </Text>
        </View>

        <ShivlingPujaCanvas />
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
