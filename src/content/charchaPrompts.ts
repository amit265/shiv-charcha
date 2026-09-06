export interface CharchaPrompt {
  id: string;
  title: string;
  topicHindi: string;
  questionPrompt: string;
  sahibJiQuote: string;
  suggestedAction: string;
}

export const charchaPrompts: CharchaPrompt[] = [
  {
    id: 'p-1',
    title: 'शिव को गुरु क्यों माना जाए?',
    topicHindi: 'शिव केवल देव नहीं, संपूर्ण जगत के चेतना स्वरूप आदि गुरु हैं।',
    questionPrompt: 'आज किसी मित्र या परिजन से चर्चा करें: "क्या आप जानते हैं कि शिव किसी एक सम्प्रदाय के नहीं, संपूर्ण मानव जाति के जगतगुरु हैं?"',
    sahibJiQuote: 'शिव गुरु सब जीवों के हैं, किसी पर उनका एकाधिकार नहीं है। - साहब श्री हरिंद्रानंद जी',
    suggestedAction: 'आज कम से कम 1 व्यक्ति से शिव को गुरु मानने की प्रेरणा साझा करें।',
  },
  {
    id: 'p-2',
    title: 'दया माँगने की अनुभूति',
    topicHindi: 'प्रथम सूत्र दया माँगने से मन में शांति व विनम्रता आती है।',
    questionPrompt: 'आज किसी गुरु भाई या गुरु बहिन से पूछें: "जब आपने पहली बार शिव गुरु से दया माँगी थी, तो आपको कैसा अनुभव हुआ था?"',
    sahibJiQuote: 'दया माँगने का अर्थ है गुरु के चरणों में अपने अहंकार को सौंप देना। - दीदी माँ नीलम आनंद जी',
    suggestedAction: 'अपनी दया माँगने का अनुभव आज किसी अन्य शिष्य से साझा करें।',
  },
  {
    id: 'p-3',
    title: '108 नमः शिवाय जाप की महिमा',
    topicHindi: 'तृतीय सूत्र नमः शिवाय जाप मन की तरंगों को शांत करता है।',
    questionPrompt: 'आज चर्चा करें: "नमः शिवाय मंत्र केवल जाप नहीं, गुरु शिव को नमन करने का पावन माध्यम है।"',
    sahibJiQuote: 'जब मन बेचैन हो, तो 108 बार नमः शिवाय कहकर गुरु की शरण में बैठ जाएं। - साहब श्री हरिंद्रानंद जी',
    suggestedAction: 'किसी को 108 मणके माला जाप करने का महत्व समझाएं।',
  },
  {
    id: 'p-4',
    title: 'शिव गुरु की अहैतुकी कृपा',
    topicHindi: 'शिव गुरु बिना किसी कर्मकांड के केवल निष्कपट भाव से प्रसन्न होते हैं।',
    questionPrompt: 'आज चर्चा करें: "शिव गुरु को प्रसन्न करने के लिए किसी बड़े अनुष्ठान की आवश्यकता नहीं, केवल शुद्ध भाव पर्याप्त है।"',
    sahibJiQuote: 'भाव ही भक्ति का प्राण है। शिव गुरु केवल सच्चा भाव देखते हैं। - साहब श्री हरिंद्रानंद जी',
    suggestedAction: 'आज अपने दैनिक कार्यों में शिव गुरु की उपस्थिति का अनुभव करें व बताएं।',
  },
  {
    id: 'p-5',
    title: 'शिव चर्चा का सामाजिक महत्व',
    topicHindi: 'शिव की चर्चा करने से समाज में सात्विकता और भ्रातृत्व बढ़ता है।',
    questionPrompt: 'आज चर्चा करें: "जब दो लोग शिव गुरु की चर्चा करते हैं, तो वह स्थान तीर्थ बन जाता है।"',
    sahibJiQuote: 'जहाँ शिव गुरु की चर्चा होती है, वहाँ शिव स्वयं विराजमान होते हैं। - दीदी माँ नीलम आनंद जी',
    suggestedAction: 'आज किसी भी सामान्य बातचीत को शिव गुरु की ओर मोड़ें।',
  },
];

/**
 * Returns today's featured Charcha Prompt based on the day of the year.
 */
export const getTodayCharchaPrompt = (): CharchaPrompt => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % charchaPrompts.length;
  return charchaPrompts[index];
};
