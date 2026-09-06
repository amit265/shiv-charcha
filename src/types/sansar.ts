export interface StoryScene {
  sceneNumber: number;
  title: string;
  image: string;
  description: string;
}

export interface RelatedContentItem {
  id: string;
  type: 'story' | 'jyotirlinga' | 'shakti_peeth' | 'family' | 'swaroop' | 'symbol' | 'temple' | 'festival';
  title: string;
  subtitle: string;
  image: string;
  routePath: string;
}

export interface ShivaStory {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  shortSummaryHindi: string; // "कहानी का सरल सार" (audio-first simple Hindi)
  audioUrl?: string;
  audioDuration?: number; // in seconds
  visualScenes?: StoryScene[];
  detailedText: string; // "विस्तार से पढ़ें"
  relatedContent?: RelatedContentItem[];
  tradition?: string; // e.g., "शिव पुराण", "लिंग पुराण", "प्रचलित मान्यता"
  sourceReference?: string; // Sourcing note for authenticity
}

export interface Jyotirlinga {
  id: string;
  title: string;
  nameHindi: string;
  location: string;
  state: string;
  image: string;
  audioUrl?: string;
  audioDuration?: number;
  summaryHindi: string;
  detailedHistory: string;
  latitude: number;
  longitude: number;
  significance: string;
  relatedFestivals?: string[];
  shareCardPrompt?: string;
}

export interface ShaktiPeeth {
  id: string;
  title: string;
  location: string;
  stateRegion: string;
  associatedBodyPart: string;
  image: string;
  audioUrl?: string;
  audioDuration?: number;
  summaryHindi: string;
  detailedHistory: string;
  latitude: number;
  longitude: number;
  traditionSource?: string;
}

export interface ShivaFamilyMember {
  id: string;
  title: string;
  relation: string;
  image: string;
  audioUrl?: string;
  audioDuration?: number;
  summaryHindi: string;
  detailedText: string;
  symbols: string[];
  associatedFestivals: string[];
}

export interface ShivaForm {
  id: string;
  title: string;
  meaning: string;
  image: string;
  audioUrl?: string;
  audioDuration?: number;
  simpleHindi: string;
  detailedText: string;
  keySymbols: string[];
}

export interface ShivaSymbol {
  id: string;
  title: string;
  hindiName: string;
  image: string;
  audioUrl?: string;
  audioDuration?: number;
  simpleMeaning: string;
  spiritualSignificance: string;
  detailedText: string;
}

export interface ShivaTemple {
  id: string;
  title: string;
  location: string;
  region: string;
  image: string;
  audioUrl?: string;
  history: string;
  significance: string;
  latitude: number;
  longitude: number;
}

export interface ShivaFestival {
  id: string;
  title: string;
  tithiMonth: string;
  significance: string;
  image: string;
  audioUrl?: string;
  detailedGuide: string;
  calendarDateId?: string;
}
