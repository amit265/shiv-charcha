import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { colors, shadows } from '@/theme/colors';
import { sacredDates } from '@/content/dates';
import { getTodayPanchang, PanchangData } from '@/services/panchangService';

const HINDI_MONTHS = [
  'जनवरी',
  'फरवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितंबर',
  'अक्टूबर',
  'नवंबर',
  'दिसंबर',
];

type CalendarFilter = 'all' | 'sahab_shri' | 'vrat' | 'festivals';

export default function DedicatedCalendarScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [selectedDayNum, setSelectedDayNum] = useState<number>(today.getDate());
  const [activeFilter, setActiveFilter] = useState<CalendarFilter>('all');

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
    setSelectedDayNum(1);
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
    setSelectedDayNum(1);
  };

  const selectedMonthText = `${HINDI_MONTHS[currentMonthIndex]} ${currentYear}`;
  const firstDayOfMonthDate = new Date(currentYear, currentMonthIndex, 1);
  const samplePanchang = getTodayPanchang(firstDayOfMonthDate);

  // Dynamic days calculation
  const totalDays = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Day of week of the 1st day of the month (0 = Sun, 1 = Mon, ... 6 = Sat)
  const firstDayOfWeek = firstDayOfMonthDate.getDay();
  const leadingPaddingCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // Currently selected date Panchang
  const selectedDateObj = new Date(currentYear, currentMonthIndex, selectedDayNum);
  const selectedPanchang: PanchangData = getTodayPanchang(selectedDateObj);

  // Filtered Sacred Dates
  const filteredSacredDates = sacredDates.filter((item) => {
    if (activeFilter === 'sahab_shri') return item.category === 'sahab_shri' || item.category === 'didi_maa';
    if (activeFilter === 'vrat') return item.title.includes('व्रत') || item.title.includes('मासिक') || item.title.includes('त्रयोदशी');
    if (activeFilter === 'festivals') return item.category === 'devotional' || item.title.includes('पर्व') || item.title.includes('मास');
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="शिव चर्चा कैलेंडर" subtitle="पंचांग • पावन तिथि व स्मरण दिवस" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Month Selector Bar with Hindu Panchang Subheader */}
        <View style={[styles.monthHeaderCard, { backgroundColor: theme.primaryDark, borderColor: theme.accent }]}>
          <View style={styles.monthHeaderNav}>
            <TouchableOpacity style={styles.monthArrow} onPress={handlePrevMonth} activeOpacity={0.7}>
              <Text style={[styles.arrowText, { color: theme.textGold }]}>◀</Text>
            </TouchableOpacity>
            <View style={styles.monthTextGroup}>
              <Text style={[styles.monthTitle, { color: theme.textGold }]}>{selectedMonthText}</Text>
              <Text style={[styles.monthPanchangSub, { color: theme.textWhite }]}>
                🪔 {samplePanchang.hindiMonth} माह • {samplePanchang.samvatStr}
              </Text>
            </View>
            <TouchableOpacity style={styles.monthArrow} onPress={handleNextMonth} activeOpacity={0.7}>
              <Text style={[styles.arrowText, { color: theme.textGold }]}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsScroll}>
          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'all' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'all' ? theme.textWhite : theme.textPrimary }]}>
              🔥 सभी तिथियाँ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'sahab_shri' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('sahab_shri')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'sahab_shri' ? theme.textWhite : theme.textPrimary }]}>
              🔱 साहब श्री व दीदी माँ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'vrat' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('vrat')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'vrat' ? theme.textWhite : theme.textPrimary }]}>
              📿 व्रत व प्रदोष
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'festivals' && { backgroundColor: theme.primary, borderColor: theme.accent }]}
            onPress={() => setActiveFilter('festivals')}
          >
            <Text style={[styles.filterPillText, { color: activeFilter === 'festivals' ? theme.textWhite : theme.textPrimary }]}>
              🌸 शिव महापर्व
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Calendar Grid View */}
        <View style={[styles.calendarCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
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
              const isSelected = dayNum === selectedDayNum;
              const isTodayCell =
                today.getFullYear() === currentYear &&
                today.getMonth() === currentMonthIndex &&
                today.getDate() === dayNum;

              const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
              const dayStr = String(dayNum).padStart(2, '0');
              const matchKey = `${dayStr}-${monthStr}`;
              const matchedEvent = sacredDates.find((item) => item.date === matchKey);

              return (
                <TouchableOpacity
                  key={dayNum}
                  style={[
                    styles.dayCell,
                    isMonday && { backgroundColor: theme.surfaceElevated },
                    matchedEvent && { backgroundColor: 'rgba(230, 81, 0, 0.15)', borderWidth: 1, borderColor: theme.accent },
                    isSelected && { backgroundColor: theme.primary, borderWidth: 2, borderColor: theme.accent },
                    isTodayCell && !isSelected && { borderWidth: 1.5, borderColor: theme.primary },
                  ]}
                  onPress={() => setSelectedDayNum(dayNum)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dayNumText,
                      {
                        color: isSelected
                          ? theme.textWhite
                          : matchedEvent
                          ? theme.primary
                          : isMonday
                          ? theme.primary
                          : theme.textPrimary,
                        fontWeight: isSelected || isTodayCell || matchedEvent || isMonday ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {dayNum}
                  </Text>

                  {matchedEvent?.category === 'sahab_shri' && <Text style={styles.dotIcon}>🔱</Text>}
                  {matchedEvent?.category === 'didi_maa' && <Text style={styles.dotIcon}>🌺</Text>}
                  {matchedEvent?.category === 'devotional' && <Text style={styles.dotIcon}>📿</Text>}
                  {!matchedEvent && isMonday && <Text style={styles.dotIcon}>🌸</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* INTERACTIVE SELECTED DAY PANCHANG & DEVOTIONAL CARD */}
        {(() => {
          const selectedMonthStr = String(currentMonthIndex + 1).padStart(2, '0');
          const selectedDayStr = String(selectedDayNum).padStart(2, '0');
          const selectedMatchKey = `${selectedDayStr}-${selectedMonthStr}`;
          const selectedEvent = sacredDates.find((item) => item.date === selectedMatchKey);

          return (
            <View style={[styles.dayDetailCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
              <View style={styles.dayDetailHeaderRow}>
                <View style={[styles.dayBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.accent }]}>
                  <Text style={[styles.dayBadgeText, { color: theme.primary }]}>
                    📅 {selectedPanchang.dayNameHindi}, {selectedPanchang.gregorianDateStr}
                  </Text>
                </View>
                <Text style={[styles.samvatTag, { color: theme.textMuted }]}>{selectedPanchang.samvatStr}</Text>
              </View>

              <Text style={[styles.panchangSummaryTitle, { color: theme.primary }]}>
                🪔 {selectedPanchang.hindiMonth} ({selectedPanchang.paksha}, {selectedPanchang.tithiName})
              </Text>

              {/* Event Callout if day has a sacred date */}
              {selectedEvent && (
                <TouchableOpacity
                  style={[styles.specialNoteBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold, marginBottom: 10 }]}
                  onPress={() => router.push(`/date/${selectedEvent.id}` as any)}
                  activeOpacity={0.88}
                >
                  <Text style={[{ fontSize: 14, fontWeight: 'bold', color: theme.primary, marginBottom: 2 }]}>
                    🌺 {selectedEvent.title}
                  </Text>
                  <Text style={[{ fontSize: 12, color: theme.textSecondary }]}>{selectedEvent.subtitle}</Text>
                  <Text style={[{ fontSize: 11, color: theme.secondary, fontWeight: 'bold', marginTop: 4 }]}>
                    पावन विवरण व महिमा पढ़ें ➔
                  </Text>
                </TouchableOpacity>
              )}

              <View style={[styles.specialNoteBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Text style={[styles.specialNoteText, { color: theme.textPrimary }]}>
                  {selectedPanchang.specialNote}
                </Text>
              </View>

              {/* Quick Action CTAs */}
              <View style={styles.dayActionsRow}>
                <TouchableOpacity
                  style={[styles.sadhnaCtaBtn, { backgroundColor: theme.primary }]}
                  onPress={() => router.push('/jap' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.sadhnaCtaText, { color: theme.textWhite }]}>📿 108 जाप करें</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sadhnaCtaOutlineBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}
                  onPress={() => router.push('/teaching/t-three-sutras' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.sadhnaCtaOutlineText, { color: theme.primary }]}>🌸 3 सूत्र समझें</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })()}

        {/* Highlighted Sacred Dates List */}
        <Text style={[styles.listSectionTitle, { color: theme.primary }]}>महत्वपूर्ण शिव चर्चा तिथियाँ 🌺</Text>

        {filteredSacredDates.map((item) => (
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
    paddingBottom: 120,
  },
  monthHeaderCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    ...shadows.medium,
  },
  monthHeaderNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthTextGroup: {
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthPanchangSub: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  monthArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 12,
  },
  filterPillsScroll: {
    marginBottom: 14,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 8,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  calendarCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  weekCell: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '13%',
    textAlign: 'center',
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
  dayNumText: {
    fontSize: 13,
  },
  dotIcon: {
    fontSize: 8,
    marginTop: 1,
  },
  dayDetailCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    ...shadows.soft,
  },
  dayDetailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  samvatTag: {
    fontSize: 11,
  },
  panchangSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  specialNoteBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  specialNoteText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  dayActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sadhnaCtaBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  sadhnaCtaText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sadhnaCtaOutlineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  sadhnaCtaOutlineText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  listSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dateCard: {
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    marginBottom: 14,
    borderWidth: 1,
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
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  cardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});
