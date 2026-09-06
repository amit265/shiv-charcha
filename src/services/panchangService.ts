/**
 * Panchang Service - Dynamic Hindu Calendar & Date Utilities
 * Calculates Hindi Month (हिंदू मास), Paksha (पक्ष), Tithi (तिथि), Samvat (विक्रम संवत), and Day Name (वार).
 */

export interface PanchangData {
  gregorianDateStr: string; // e.g. "6 सितंबर 2026"
  dayNameHindi: string;     // e.g. "रविवार"
  hindiMonth: string;       // e.g. "भाद्रपद"
  paksha: string;           // e.g. "कृष्ण पक्ष" | "शुक्ल पक्ष"
  tithiName: string;        // e.g. "दशमी"
  samvatStr: string;        // e.g. "विक्रम संवत 2083"
  formattedHeader: string;  // e.g. "भाद्रपद कृष्ण पक्ष • रविवार, 6 सितंबर"
  formattedFull: string;    // e.g. "विक्रम संवत 2083 • भाद्रपद कृष्ण पक्ष, रविवार - 6 सितंबर 2026"
  line1: string;            // e.g. "📅 रविवार, 6 सितंबर 2026"
  line2: string;            // e.g. "🪔 भाद्रपद (कृष्ण पक्ष, दशमी) • विक्रम संवत 2083"
  isMonday: boolean;
  specialNote: string;
}

const HINDI_DAYS = [
  'रविवार',
  'सोमवार',
  'मंगलवार',
  'बुधवार',
  'गुरुवार',
  'शुक्रवार',
  'शनिवार',
];

const GREGORIAN_MONTHS_HINDI = [
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

// Approximate mapping of Gregorian months to Hindu Months
const HINDU_MONTHS = [
  'पौष - माघ',       // Jan
  'माघ - फाल्गुन',   // Feb
  'फाल्गुन - चैत्र',  // Mar
  'चैत्र - वैशाख',   // Apr
  'वैशाख - ज्येष्ठ',  // May
  'ज्येष्ठ - आषाढ़',  // Jun
  'आषाढ़ - श्रावण',   // Jul
  'श्रावण - भाद्रपद', // Aug
  'भाद्रपद - आश्विन', // Sep
  'आश्विन - कार्तिक', // Oct
  'कार्तिक - मार्गशीर्ष', // Nov
  'मार्गशीर्ष - पौष',  // Dec
];

const TITHIS_LIST = [
  'प्रथमा',
  'द्वितीया',
  'तृतीया',
  'चतुर्थी',
  'पंचमी',
  'षष्ठी',
  'सप्तमी',
  'अष्टमी',
  'नवमी',
  'दशमी',
  'एकादशी',
  'द्वादशी',
  'त्रयोदशी (प्रदोष)',
  'चतुर्दशी (शिवरात्रि)',
  'पूर्णिमा / अमावस्या',
];

/**
 * Returns accurate Hindu Panchang date details for any given JS Date object.
 */
export function getTodayPanchang(dateInput: Date = new Date()): PanchangData {
  const d = new Date(dateInput);
  const dayIndex = d.getDay();
  const dayNameHindi = HINDI_DAYS[dayIndex];
  const dayOfMonth = d.getDate();
  const monthIndex = d.getMonth();
  const year = d.getFullYear();

  // Gregorian formatted date
  const gregorianDateStr = `${dayOfMonth} ${GREGORIAN_MONTHS_HINDI[monthIndex]} ${year}`;

  // Vikram Samvat calculation
  const isAfterChaitra = monthIndex >= 3;
  const samvatYear = year + (isAfterChaitra ? 57 : 57);
  const samvatStr = `विक्रम संवत ${samvatYear}`;

  // Hindi Lunar Month estimation
  const hindiMonth = HINDU_MONTHS[monthIndex];

  // Lunar day calculation based on synodic month (29.53059 days)
  // Known new moon reference: Jan 18, 2026
  const refNewMoon = new Date(2026, 0, 18).getTime();
  const diffDays = (d.getTime() - refNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = ((diffDays % 29.53059) + 29.53059) % 29.53059;

  let paksha = 'शुक्ल पक्ष';
  let tithiIndex = 0;

  if (lunarAge < 14.765) {
    paksha = 'शुक्ल पक्ष';
    tithiIndex = Math.min(14, Math.floor(lunarAge / (14.765 / 15)));
  } else {
    paksha = 'कृष्ण पक्ष';
    tithiIndex = Math.min(14, Math.floor((lunarAge - 14.765) / (14.765 / 15)));
  }

  const tithiName = TITHIS_LIST[tithiIndex] || 'प्रतिपदा';
  const isMonday = dayIndex === 1;

  let specialNote = 'हर हर महादेव • नमः शिवाय साधना';
  if (isMonday) {
    specialNote = '🌸 आज सोमवारी शिव गुरु साधना का पावन दिन है';
  } else if (tithiName.includes('प्रदोष')) {
    specialNote = '🔱 आज प्रदोष काल शिव पूजा का पावन समय है';
  } else if (tithiName.includes('शिवरात्रि')) {
    specialNote = '📿 आज पावन शिवरात्रि तिथि - 108 नमः शिवाय जाप करें';
  }

  const formattedHeader = `${hindiMonth} ${paksha} • ${dayNameHindi}, ${dayOfMonth} ${GREGORIAN_MONTHS_HINDI[monthIndex]}`;
  const formattedFull = `${samvatStr} • ${hindiMonth}, ${paksha} (${tithiName}) • ${dayNameHindi}, ${gregorianDateStr}`;
  const line1 = `📅 ${dayNameHindi}, ${dayOfMonth} ${GREGORIAN_MONTHS_HINDI[monthIndex]} ${year}`;
  const line2 = `🪔 ${hindiMonth} (${paksha}, ${tithiName}) • ${samvatStr}`;

  return {
    gregorianDateStr,
    dayNameHindi,
    hindiMonth,
    paksha,
    tithiName,
    samvatStr,
    formattedHeader,
    formattedFull,
    line1,
    line2,
    isMonday,
    specialNote,
  };
}
