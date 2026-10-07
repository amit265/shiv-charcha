export interface ShivReel {
  id: string;
  youtubeVideoId: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  title: string;
  subTitle: string;
  category: 'sutras' | 'gosthi' | 'sahib_ji' | 'mahadev';
  likesCount: number;
  sharesCount: number;
  teachingId?: string;
  youtubeUrl: string;
}

export function getReelThumbnailUrl(reel: ShivReel): string {
  if (reel.thumbnailUrl) return reel.thumbnailUrl;
  if (reel.youtubeVideoId) {
    return `https://img.youtube.com/vi/${reel.youtubeVideoId}/hqdefault.jpg`;
  }
  return '';
}

export const shivReelsCatalog: ShivReel[] = [
  {
    "id": "reel-KQMAaSRCck4",
    "youtubeVideoId": "KQMAaSRCck4",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/KQMAaSRCck4.mp4",
    "title": "ना धन मांगू, ना मन मांगू 🙏 | बस गुरु की दया चाहिए | शिव भजन | #महादेव #शिवचर्चा #शिवगुरु #महादेव",
    "subTitle": "ना धन चाहिए, ना कोई सुख-सामान…",
    "category": "mahadev",
    "likesCount": 1200,
    "sharesCount": 320,
    "youtubeUrl": "https://youtube.com/shorts/KQMAaSRCck4"
  },
  {
    "id": "reel-zsri1QZ5TBU",
    "youtubeVideoId": "zsri1QZ5TBU",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/zsri1QZ5TBU.mp4",
    "title": "शिव मेरे गुरु हैं 🙏 | मैं उनका शिष्य हूँ | महादेव भक्ति #Shorts  #महादेव #महादेव #शिवचर्चा #शिवगुरु",
    "subTitle": "शिव मेरे गुरु हैं… मैं उनका शिष्य हूँ। 🙏",
    "category": "mahadev",
    "likesCount": 1340,
    "sharesCount": 355,
    "youtubeUrl": "https://youtube.com/shorts/zsri1QZ5TBU"
  },
  {
    "id": "reel-6BDmszb4pa8",
    "youtubeVideoId": "6BDmszb4pa8",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/6BDmszb4pa8.mp4",
    "title": "शिव चर्चा अब आपके मोबाइल पर! #महादेव #शिवगुरु #शिवशिष्य #शिवशिष्य #शिवचर्चा #शिवचर्चा",
    "subTitle": "🙏 शिव गुरु साधना अब आपके मोबाइल पर!",
    "category": "mahadev",
    "likesCount": 1620,
    "sharesCount": 425,
    "youtubeUrl": "https://youtube.com/shorts/6BDmszb4pa8"
  },
  {
    "id": "reel-iIVXj3kV35M",
    "youtubeVideoId": "iIVXj3kV35M",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/iIVXj3kV35M.mp4",
    "title": "क्या दया माँगने के लिए मंदिर जाना ज़रूरी है?  #महादेव #शिवगुरु #शिवचर्चा",
    "subTitle": "कई लोग पूछते हैं कि क्या शिव से दया माँगने के लिए मंदिर या विशेष ",
    "category": "mahadev",
    "likesCount": 1760,
    "sharesCount": 460,
    "youtubeUrl": "https://youtube.com/shorts/iIVXj3kV35M"
  },
  {
    "id": "reel-fC2BhUmM7h8",
    "youtubeVideoId": "fC2BhUmM7h8",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/fC2BhUmM7h8.mp4",
    "title": "हे शिव, आप मेरे गुरु हैं...” | शिव शिष्यता का भाव  #महादेव #शिवगुरु #शिवचर्चा #शिवशिष्य",
    "subTitle": "क्या आप जानते हैं कि शिव को गुरु मानने का सबसे सरल वाक्य क्या है?",
    "category": "mahadev",
    "likesCount": 1900,
    "sharesCount": 495,
    "youtubeUrl": "https://youtube.com/shorts/fC2BhUmM7h8"
  },
  {
    "id": "reel-QWiTUwKY67Q",
    "youtubeVideoId": "QWiTUwKY67Q",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/QWiTUwKY67Q.mp4",
    "title": "दया माँगना क्या है? | शिव चर्चा का पहला सूत्र #महादेव #शिवगुरु #शिवचर्चा #शिवशिष्य",
    "subTitle": "शिव चर्चा का पहला सूत्र है — दया माँगना। इसका मतलब यह नहीं है कि ",
    "category": "mahadev",
    "likesCount": 2040,
    "sharesCount": 530,
    "youtubeUrl": "https://youtube.com/shorts/QWiTUwKY67Q"
  },
  {
    "id": "reel-l1r87fswRbo",
    "youtubeVideoId": "l1r87fswRbo",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/l1r87fswRbo.mp4",
    "title": "शिव चर्चा का दूसरा सूत्र — चर्चा करना | शिव गुरु #महादेव #शिवगुरु #शिवचर्चा",
    "subTitle": "शिव चर्चा का दूसरा सूत्र — चर्चा करना | शिव गुरु",
    "category": "mahadev",
    "likesCount": 2320,
    "sharesCount": 600,
    "youtubeUrl": "https://youtube.com/shorts/l1r87fswRbo"
  },
  {
    "id": "reel-gwQy0L5umUM",
    "youtubeVideoId": "gwQy0L5umUM",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/gwQy0L5umUM.mp4",
    "title": "शिव चर्चा का तीसरा सूत्र — प्रणाम करना | शिव गुरु #महादेव #शिवगुरु #शिवचर्चा",
    "subTitle": "शिव चर्चा का तीसरा सूत्र — प्रणाम करना | शिव गुरु",
    "category": "mahadev",
    "likesCount": 2460,
    "sharesCount": 635,
    "youtubeUrl": "https://youtube.com/shorts/gwQy0L5umUM"
  },
  {
    "id": "reel-Kuj5W_8_fhQ",
    "youtubeVideoId": "Kuj5W_8_fhQ",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/videos/Kuj5W_8_fhQ.mp4",
    "title": "शिव चर्चा का पहला सूत्र - दया माँगना | शिव गुरु @Mahavyomabhakti",
    "subTitle": "शिव चर्चा का पहला सूत्र है — दया माँगना।",
    "category": "mahadev",
    "likesCount": 2600,
    "sharesCount": 670,
    "youtubeUrl": "https://youtube.com/shorts/Kuj5W_8_fhQ"
  }
];
