import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { shadows } from '../../theme/colors';

export type OfferingType = 'flower' | 'belpatra' | 'water' | 'milk' | 'diya' | 'garland' | 'bell' | 'shankh' | null;

interface MantraInfo {
  title: string;
  icon: string;
  sanskrit: string;
  hindi: string;
}

export const MANTRAS: Record<NonNullable<OfferingType>, MantraInfo> = {
  flower: {
    title: 'पुष्प समर्पण मन्त्र',
    icon: '🌸',
    sanskrit: 'नानासुगन्धिपुष्पाणि यथाकालोद्भवानि च।\nमयाहृतानि पूजार्थं गृहाण परमेश्वर॥',
    hindi: 'हे परमेश्वर! ऋतु अनुसार उत्पन्न सुगन्धित पुष्प आपकी सेवा में अर्पित हैं, स्वीकार करें।',
  },
  belpatra: {
    title: 'बिल्वपत्र समर्पण मन्त्र',
    icon: '🍃',
    sanskrit: 'त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रयायुधम्।\nत्रिजन्मपापसंहारं एकबिल्वं शिवार्पणम्॥',
    hindi: 'तीन दल, तीनों गुणों के प्रतीक, तीन नेत्रों वाले शिवजी को तीन जन्मों के पाप हरने वाला एक बिल्वपत्र अर्पित है।',
  },
  water: {
    title: 'जलधारा मन्त्र',
    icon: '💧',
    sanskrit: 'गङ्गा तरङ्ग रमणीय जटा कलापं,\nमयाहृतं स्नानजलं गृहाण देवदेवेश॥',
    hindi: 'गंगा की पावन तरंगों से सुशोभित जटावाले हे देवाधिदेव! यह शीतल जलधारा स्वीकार करें।',
  },
  milk: {
    title: 'दुग्धधारा मन्त्र',
    icon: '🥛',
    sanskrit: 'कामधेनुसमुद्भूतं सर्वेषां जीवनं परम्।\nपावनं यज्ञहेतुश्च पयः स्नानार्थं गृहाण नः॥',
    hindi: 'समस्त जीवों का पोषण करने वाला, पवित्र दुग्ध आपकी प्रसन्नता हेतु समर्पित है।',
  },
  diya: {
    title: 'दीप दर्शन मन्त्र',
    icon: '🪔',
    sanskrit: 'साज्यं च वर्तिसंयुक्तं वह्निना योजितं मया।\nदीपं गृहाण देवेश त्रैलोक्यतिमिरापहम्॥',
    hindi: 'तीनों लोकों का अंधकार दूर करने वाले हे देवेश! यह ज्योतिर्मय दीपक स्वीकार करें।',
  },
  garland: {
    title: 'पुष्पमाला समर्पण मन्त्र',
    icon: '🌺',
    sanskrit: 'पुष्पमालां ग्रथितां वै सुमंगलां शिवप्रियाम्।\nमयाहृतां गृहाण त्वं भक्त्या दत्ते महेश्वर॥',
    hindi: 'अत्यंत मंगलकारी पुष्पों की यह सुंदर माला भक्तिभावपूर्वक आपको समर्पित है।',
  },
  bell: {
    title: 'घण्टानाद मन्त्र',
    icon: '🔔',
    sanskrit: 'आगमनाथं तु देवानां गमनाथं तु रक्षसाम्।\nकुरु घण्टारवं तत्र देवतास्थानसन्निधौ॥',
    hindi: 'शुभ शक्तियों का आगमन और नकारात्मकता का नाश करने वाली यह दिव्य घंटी की ध्वनि गूँज रही है।',
  },
  shankh: {
    title: 'शंखनाद मन्त्र',
    icon: '🐚',
    sanskrit: 'त्वं पुरा सागरोत्पन्नो विष्णुना विधृतः करे।\nनिर्मितः सर्वदेवैश्च पाञ्चजन्य नमोऽस्तु ते॥',
    hindi: 'समस्त देवों द्वारा वंदित, क्षीरसागर से उत्पन्न यह पवित्र शंख ध्वनि वातावरण में शिव भक्ति भर रही है।',
  },
};

interface PujaMantraCardProps {
  activeOffering: OfferingType;
}

export const PujaMantraCard: React.FC<PujaMantraCardProps> = ({ activeOffering }) => {
  const { theme } = useTheme();

  if (!activeOffering) {
    return (
      <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.defaultTitle, { color: theme.textGold }]}>🌸 शिव पूजा भावना 🌸</Text>
        <Text style={[styles.defaultSub, { color: theme.textSecondary }]}>
          नीचे दिए गए पूजन द्रव्यों (जल, पुष्प, बेलपत्र, घंटी, शंख) पर टैप करके भावपूर्वक अर्पित करें और पवित्र मंत्र देखें।
        </Text>
      </View>
    );
  }

  const info = MANTRAS[activeOffering];

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>{info.icon}</Text>
        <Text style={[styles.title, { color: theme.textGold }]}>{info.title}</Text>
      </View>

      <Text style={[styles.sanskritText, { color: theme.primary }]}>{info.sanskrit}</Text>
      <Text style={[styles.hindiText, { color: theme.textPrimary }]}>{info.hindi}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginVertical: 12,
    ...shadows.soft,
  },
  defaultTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  defaultSub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  sanskritText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: 6,
    fontStyle: 'italic',
  },
  hindiText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.9,
    marginTop: 4,
  },
});
