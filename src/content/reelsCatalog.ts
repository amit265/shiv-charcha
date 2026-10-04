export interface ShivReel {
  id: string;
  youtubeVideoId: string;
  title: string;
  subTitle: string;
  category: 'sutras' | 'gosthi' | 'sahib_ji' | 'mahadev';
  likesCount: number;
  sharesCount: number;
  teachingId?: string;
  youtubeUrl: string;
}

export const shivReelsCatalog: ShivReel[] = [
  {
    id: 'reel-sutra-1',
    youtubeVideoId: 'S-7BfM2L8-k', // Default sample YouTube Short
    title: 'पहला सूत्र: दया क्यों माँगते हैं?',
    subTitle: 'साहब श्री हरिंद्रानंद जी का अनमोल संदेश',
    category: 'sutras',
    likesCount: 1240,
    sharesCount: 380,
    teachingId: 't-sutra-1-daya',
    youtubeUrl: 'https://youtube.com/shorts/S-7BfM2L8-k',
  },
  {
    id: 'reel-sutra-2',
    youtubeVideoId: 'Z6K5Y3kG9rQ',
    title: 'दूसरा सूत्र: शिव चर्चा कैसे करें?',
    subTitle: 'चर्चा करने का सही भाव और तरीका',
    category: 'sutras',
    likesCount: 980,
    sharesCount: 290,
    teachingId: 't-sutra-2-charcha',
    youtubeUrl: 'https://youtube.com/shorts/Z6K5Y3kG9rQ',
  },
  {
    id: 'reel-sutra-3',
    youtubeVideoId: 'V9f-1H4wK8E',
    title: 'तीसरा सूत्र: 108 नमः शिवाय का महत्व',
    subTitle: 'रुद्राक्ष माला और दैनिक पंचाक्षर जाप',
    category: 'sutras',
    likesCount: 1560,
    sharesCount: 510,
    teachingId: 't-sutra-3-jap',
    youtubeUrl: 'https://youtube.com/shorts/V9f-1H4wK8E',
  },
  {
    id: 'reel-gosthi-1',
    youtubeVideoId: 'P3X-9wK7J2Y',
    title: 'घर पर शिव चर्चा गोष्ठी का आनंद',
    subTitle: '45-मिनट की आदर्श गोष्ठी विधि',
    category: 'gosthi',
    likesCount: 870,
    sharesCount: 210,
    teachingId: 't-gosthi-meaning',
    youtubeUrl: 'https://youtube.com/shorts/P3X-9wK7J2Y',
  },
  {
    id: 'reel-sahib-ji-1',
    youtubeVideoId: 'K9j8-L2m4Np',
    title: 'शिव केवल भगवान नहीं, साक्षात् गुरु हैं',
    subTitle: 'साहब श्री का पावन उद्घोष',
    category: 'sahib_ji',
    likesCount: 2100,
    sharesCount: 840,
    teachingId: 't-harindranand-ji',
    youtubeUrl: 'https://youtube.com/shorts/K9j8-L2m4Np',
  },
  {
    id: 'reel-mahadev-1',
    youtubeVideoId: 'M7X4W9pQ1zY',
    title: 'शिव शिष्यता में कोई कर्मकांड नहीं',
    subTitle: 'दीदी माँ नीलम आनंद जी का पावन ज्ञान',
    category: 'mahadev',
    likesCount: 1850,
    sharesCount: 620,
    teachingId: 't-no-rituals',
    youtubeUrl: 'https://youtube.com/shorts/M7X4W9pQ1zY',
  },
];
