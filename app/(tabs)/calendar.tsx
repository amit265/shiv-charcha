import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { colors, shadows } from '@/theme/colors';
import { sacredDates } from '@/content/dates';

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<string>('सितम्बर 2026');

  // Days simulation for calendar grid
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <Header title="शिव चर्चा कैलेंडर" subtitle="पावन स्मरण दिवस • विशेष तिथि" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Month Selector Bar */}
        <View style={styles.monthHeader}>
          <TouchableOpacity style={styles.monthArrow} activeOpacity={0.7}>
            <Text style={styles.arrowText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{selectedMonth}</Text>
          <TouchableOpacity style={styles.monthArrow} activeOpacity={0.7}>
            <Text style={styles.arrowText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid View */}
        <View style={styles.calendarCard}>
          {/* Weekday headers */}
          <View style={styles.weekRow}>
            {['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'].map((day, idx) => (
              <Text key={idx} style={[styles.weekCell, idx === 1 && styles.mondayHighlight]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {daysInMonth.map((dayNum) => {
              const isSpecial = dayNum === 17 || dayNum === 8 || dayNum === 25;
              const isMonday = dayNum % 7 === 2;

              return (
                <TouchableOpacity
                  key={dayNum}
                  style={[
                    styles.dayCell,
                    isMonday && styles.mondayBg,
                    isSpecial && styles.specialDayBg,
                  ]}
                  onPress={() => {
                    if (dayNum === 17) router.push('/date/date-harindranand-ji' as any);
                    else if (dayNum === 25) router.push('/date/date-neelam-anand-ji' as any);
                    else if (dayNum === 8) router.push('/date/date-mahashivratri' as any);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dayNumText,
                      isSpecial && styles.specialDayText,
                      isMonday && styles.mondayText,
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {isSpecial && <Text style={styles.dotIcon}>🌺</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Highlighted Sacred Dates List */}
        <Text style={styles.listSectionTitle}>महत्वपूर्ण शिव चर्चा तिथियाँ 🌺</Text>

        {sacredDates.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.dateCard}
            onPress={() => router.push(`/date/${item.id}` as any)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.dateThumb} />
            <View style={styles.dateMeta}>
              <Text style={styles.dateBadge}>📅 {item.date}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.subtitle}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.maroonPrimary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.goldPrimary,
  },
  monthArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 12,
    color: colors.goldLight,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.goldLight,
  },
  calendarCard: {
    backgroundColor: colors.cardBgAmber,
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderGold,
    ...shadows.soft,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  weekCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textMedium,
    width: '13%',
    textAlign: 'center',
  },
  mondayHighlight: {
    color: colors.saffronDark,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dayCell: {
    width: '14.28%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 10,
  },
  mondayBg: {
    backgroundColor: 'rgba(230, 81, 0, 0.1)',
  },
  specialDayBg: {
    backgroundColor: colors.maroonPrimary,
    borderWidth: 1,
    borderColor: colors.goldPrimary,
  },
  dayNumText: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '500',
  },
  specialDayText: {
    color: colors.goldLight,
    fontWeight: 'bold',
  },
  mondayText: {
    color: colors.saffronDark,
    fontWeight: 'bold',
  },
  dotIcon: {
    fontSize: 8,
    marginTop: 1,
  },
  listSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.maroonDark,
    marginBottom: 12,
  },
  dateCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  dateThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
  },
  dateMeta: {
    flex: 1,
  },
  dateBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.saffronDark,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 2,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textMedium,
    marginTop: 4,
    lineHeight: 16,
  },
});
