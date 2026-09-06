import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { colors, shadows } from '@/theme/colors';
import { sacredDates } from '@/content/dates';

const HINDI_MONTHS = [
  'जनवरी',
  'फरवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितम्बर',
  'अक्टूबर',
  'नवम्बर',
  'दिसम्बर',
];

export default function DedicatedCalendarScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(8); // Default: September (8)

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const selectedMonthText = `${HINDI_MONTHS[currentMonthIndex]} ${currentYear}`;

  // Dynamic days calculation
  const totalDays = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Day of week of the 1st day of the month (0 = Sun, 1 = Mon, ... 6 = Sat)
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  const leadingPaddingCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="शिव चर्चा कैलेंडर" subtitle="पावन स्मरण दिवस • विशेष तिथि" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Month Selector Bar */}
        <View style={[styles.monthHeader, { backgroundColor: theme.primaryDark, borderColor: theme.accent }]}>
          <TouchableOpacity style={styles.monthArrow} onPress={handlePrevMonth} activeOpacity={0.7}>
            <Text style={[styles.arrowText, { color: theme.textGold }]}>◀</Text>
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: theme.textGold }]}>{selectedMonthText}</Text>
          <TouchableOpacity style={styles.monthArrow} onPress={handleNextMonth} activeOpacity={0.7}>
            <Text style={[styles.arrowText, { color: theme.textGold }]}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid View */}
        <View style={[styles.calendarCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          {/* Weekday headers */}
          <View style={[styles.weekRow, { borderBottomColor: theme.border }]}>
            {['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'].map((day, idx) => (
              <Text
                key={idx}
                style={[
                  styles.weekCell,
                  { color: idx === 1 ? theme.primary : theme.textSecondary },
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {/* Blank leading cells for weekday offset */}
            {leadingPaddingCells.map((padIndex) => (
              <View key={`pad-${padIndex}`} style={styles.dayCell} />
            ))}

            {daysInMonth.map((dayNum) => {
              const cellIndex = firstDayOfWeek + dayNum - 1;
              const isMonday = cellIndex % 7 === 1;
              const isSpecial =
                (currentMonthIndex === 8 && (dayNum === 17 || dayNum === 25)) ||
                (currentMonthIndex === 2 && dayNum === 8);

              return (
                <TouchableOpacity
                  key={dayNum}
                  style={[
                    styles.dayCell,
                    isMonday && { backgroundColor: theme.surfaceElevated },
                    isSpecial && { backgroundColor: theme.primary, borderWidth: 1, borderColor: theme.accent },
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
                      {
                        color: isSpecial
                          ? theme.textWhite
                          : isMonday
                          ? theme.primary
                          : theme.textPrimary,
                        fontWeight: isSpecial || isMonday ? 'bold' : 'normal',
                      },
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
        <Text style={[styles.listSectionTitle, { color: theme.primary }]}>महत्वपूर्ण शिव चर्चा तिथियाँ 🌺</Text>

        {sacredDates.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.dateCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => router.push(`/date/${item.id}` as any)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.dateThumb} />
            <View style={styles.dateMeta}>
              <Text style={[styles.dateBadge, { color: theme.primary }]}>📅 {item.date}</Text>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.cardSub, { color: theme.textSecondary }]}>{item.subtitle}</Text>
              <Text style={[styles.cardDesc, { color: theme.textMuted }]} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
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
