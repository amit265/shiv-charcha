# 🔱 शिव चर्चा (Shiv Charcha)

> **हर हर महादेव • हे शिव! आप मेरे गुरु हैं, मैं आपका शिष्य हूँ। मुझ पर दया कर दीजिए।**

An authentic, modern, audio-first devotional and spiritual knowledge platform for Lord Shiva disciples (**शिव शिष्यता**). Built with **React Native**, **Expo**, **TypeScript**, and a dynamic 6-theme design system.

---

## 🌟 Key Features

### 1. 🏠 मुख्य पृष्ठ (Home & Daily Devotion)
- **आज का संदेश**: Daily spiritual message from Shiv Guru with audio listening and share features.
- **आज का भजन**: Daily curated Shiv bhajan with floating mini-player audio context.
- **पावन स्मरण दिवस**: Special calendar dates and Shiva observances.
- **🎬 100+ रील्स स्क्रॉल (Reels Mode)**: Full-screen devotional wallpaper quote reels with background wallpaper changer.

### 2. 📖 शिव चर्चा (Shiv Charcha & Teachings)
- **3 मुख्य सूत्र**: Step-by-step guidance on **दया माँगना** (First Sutra), **चर्चा करना** (Second Sutra), and **108 नमः शिवाय जाप** (Third Sutra).
- **आसान भाषा में पुस्तकें**: Complete Shiv Charcha literature (*शिव शिष्यता क्यों और कैसे*, *आओ शिव को गुरु बनाएं*) broken down into chapter summaries, key lessons, and daily life connections.
- **ऑडियो पुस्तकालय**: Guided audio teachings and bhajan collection.

### 3. 🔱 शिव संसार (Shiv Sansar - Mahadev Knowledge Base)
- **📖 शिव कथाएँ**: Authentic mythological stories (Sati & Shiv, Samudra Manthan, Ganga Avataran) featuring:
  - **दृश्य कथा मोड (Visual Scene Stepper)**: Interactive artwork scene-by-scene stepper.
  - **सरल सार & विस्तृत पाठ**: Easy language summary and full scriptural references.
- **🛕 12 ज्योतिर्लिंग धाम**: Complete guide to the 12 Jyotirlingas with audio narrations, history, and map shortcuts.
- **🌺 51 शक्ति पीठ**: Detailed directory of Shakti Peethas, body parts, locations, and spiritual significance.
- **👨‍👩‍👧 शिव परिवार व स्वरूप**: Mahadev, Parvati, Ganesh, Kartikeya, Nandi, Nataraj, Neelkanth, and Ardhanarishvara.
- **🕉️ शिव के प्रतीक**: Spiritual meaning of Trishul, Damru, Rudraksha, Bhasma, Chandrama, and Third Eye.
- **📍 डिजिटल शिव यात्रा मैप**: Interactive India pilgrimage map canvas highlighting Jyotirlingas and Shakti Peethas.

### 4. 📿 साधना एवं सेवा (Sadhna & Puja Tools)
- **📿 108 नमः शिवाय जाप काउंटर**: Interactive digital Rudraksha Mala counter with audio soundscapes, haptic feedback, streak counter, and completion statistics.
- **🌸 शिव लिंग पूजा सेवा**: Digital Shivling Puja canvas offering Jal, Pushpa, Belpatra, Aarti, and devotional background soundscapes.

### 5. 🎨 शिव सुविचार (Suvichar & Share Card Generator)
- Create personalized devotional share cards with custom quote text, user name, typography sizing, aspect ratios (Square 1:1, Story 9:16), and 6 dynamic theme background styles.
- Instant high-resolution card export and native sharing.

### 6. 🎨 6 Curated Devotional Themes
Fully dynamic theme engine with live switching and 100% WCAG AAA contrast compliance:
1. **🌅 दिव्य सुकून** (Default Deep Velvet Maroon & Gold)
2. **🪔 केसरिया भक्ति** (Vibrant Saffron & Ember Gold)
3. **🌙 कैलाश रात्रि** (Himalayan Midnight Blue & Sky Silver)
4. **🌿 हरित प्रकृति** (Sacred Belpatra Green & Gold)
5. **🌸 गुलाबी भक्ति** (Devotional Rose Pink & Amber)
6. **⚪ सरल प्रकाश** (High-Contrast Minimal White)
7. **📱 सिस्टम थीम** (Auto dark/light mode matching device settings)

---

## 🛠️ Tech Stack & Architecture

- **Core**: React Native (v0.76+), Expo (SDK 52), TypeScript
- **Navigation**: Expo Router (File-based routing with custom floating tab layout)
- **Audio Engine**: Custom AudioContext wrapper with track player state and global floating bar
- **Theme System**: Dynamic Token Engine (`src/theme/themes.ts` & `ThemeContext.tsx`)
- **Graphics & Share**: React Native Canvas, ViewShot, Safe Share API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on mobile (or Android Studio / Xcode for emulators)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amit265/shiv-charcha.git
   cd shiv-charcha
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on Web**:
   ```bash
   npx expo start --web
   ```

---

## 📂 Project Structure

```
shiv-charcha/
├── app/                      # Expo Router File-Based Pages & Tabs
│   ├── (tabs)/               # Main Floating Navigation Bar Tabs
│   │   ├── index.tsx         # Home Screen (मुख्य पृष्ठ)
│   │   ├── charcha.tsx       # Shiv Charcha (शिव चर्चा)
│   │   ├── sansar.tsx        # Shiv Sansar Root (शिव संसार)
│   │   ├── share.tsx         # Suvichar Card Studio (शिव सुविचार)
│   │   └── profile.tsx       # Profile & Stats (प्रोफाइल)
│   ├── book/[id].tsx         # Book Chapter Viewer
│   ├── sansar/               # Shiv Sansar Knowledge Pages (Stories, Temples, Yatra Map)
│   ├── theme-selector.tsx    # Theme Customizer Screen
│   ├── settings.tsx          # Settings & Legal Policies
│   └── reels.tsx             # Full-Screen Quotes Reels
├── src/
│   ├── components/           # Reusable UI Components (Header, Jap, Puja, Player)
│   ├── content/              # Authentic Devotional Data & Literature
│   ├── context/              # Theme & Audio Context Providers
│   ├── services/             # Storage, Audio & Share Services
│   └── theme/                # Color Tokens, Themes & Shadows
└── README.md
```

---

## 🙏 Acknowledgment & Credits

शिव चर्चा के तीन मुख्य सूत्रों तथा शिव को गुरु मानने की विचारधारा के मूल प्रेरक **साहब श्री हरिंद्रानंद जी** एवं **दीदी माँ नीलम आनंद जी** हैं। हम उनके पावन चरणों में कोटि-कोटि नमन व आभार व्यक्त करते हैं।

---

## 📄 License & Studio

Designed & Developed by **Destya Studio / Mahavyoma Studio**.  
All rights reserved.
