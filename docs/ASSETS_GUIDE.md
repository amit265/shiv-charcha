# 🪔 Shiv Charcha App — Asset & Production Resource Guide

This guide provides a comprehensive specification of all media assets, sound files, images, icons, and server manifests required to prepare the **Shiv Charcha** app for official release on the Google Play Store, Apple App Store, and Web.

---

## 📂 Summary of Asset Locations

| Asset Category | Target Path in Project | Format |
| :--- | :--- | :--- |
| **App Store Launcher Icons** | `assets/images/` | PNG |
| **App Splash Screen** | `assets/images/splash-icon.png` | PNG |
| **Devotional Wallpapers** | `assets/images/wallpapers/` (or remote CDN) | JPG (1080x1920) |
| **Pravachan & Audio Tracks** | Remote CDN / Firebase / S3 | MP3 (128kbps stereo) |
| **Sound Effects (SFX)** | `assets/sounds/` | MP3 |
| **App Manifest & Deep Links** | Server root / `.well-known/` | JSON |

---

## 🎨 1. App Branding & Store Assets

| Asset Name | Spec / Resolution | File Name | Description & Usage |
| :--- | :--- | :--- | :--- |
| **App Icon** | 1024 x 1024 px (PNG, no alpha) | `assets/images/icon.png` | Primary app launcher icon featuring Trishul, Om, or Shivling artwork. |
| **Android Adaptive Icon** | 1024 x 1024 px (PNG) | `assets/images/adaptive-icon.png` | Android 8+ foreground adaptive launcher icon. |
| **Splash Screen Icon** | 1242 x 2436 px (PNG) | `assets/images/splash-icon.png` | Displayed during app cold start on iOS & Android. |
| **Web Favicon** | 48 x 48 px (PNG) | `assets/images/favicon.png` | Browser tab icon for Web deployment. |
| **Google Play Feature Graphic** | 1024 x 500 px (JPG/PNG) | `docs/assets/play_feature_graphic.png` | Banner displayed at top of Google Play Store listing. |
| **App Store Screenshots** | 1242 x 2688 px (PNG) | `docs/assets/screenshots/` | 5–8 promotional screenshots highlighting features. |

---

## 🖼️ 2. Devotional Photography & Portrait Assets

### Revered Figures (High-Definition Portraits)
- **Sahib Shri Harindranand Ji**:
  - Portrait photograph of Sahib Shri Harindranand Ji (Founder of Shiv Shishyata).
  - Used in: `src/content/teachings.ts`, `src/content/dates.ts`, `app/audio-hub.tsx`.
  - Specs: High-resolution vertical JPG (`800x1000 px`).
- **Didi Maa Neelam Anand Ji**:
  - Portrait photograph of Didi Maa Neelam Anand Ji.
  - Used in: `src/content/teachings.ts`, `src/content/dates.ts`, `app/audio-hub.tsx`.
  - Specs: High-resolution vertical JPG (`800x1000 px`).

### Shiv Sansar & Knowledge Base Imagery
- **12 Jyotirlingas Image Bundle** (12 HD JPGs):
  - High-quality photos/illustrations for Somnath, Mallikarjuna, Mahakaleshwar, Omkareshwar, Kedarnath, Bhimashankar, Kashi Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Rameshwaram, and Grishneshwar.
  - Referenced in: `src/content/sansarContent.ts`.
- **51 Shakti Peethas & Shiv Parivar**:
  - Artwork for Shiv Parivar (Shiva, Parvati, Ganesha, Kartikeya).
  - Referenced in: `src/content/sansarContent.ts`.

### Full-Screen Wallpapers for Reels & Share Cards (`src/constants/shivaImages.ts`)
Provide 6–10 high-definition portrait orientation JPGs (`1080x1920 px` resolution):
1. `shiva_lingam_shrine.jpg` — Shivling altar with flowers & diya flame.
2. `mount_kailash_sunrise.jpg` — Sacred Mount Kailash with golden sunrise glow.
3. `cosmic_nataraja.jpg` — Lord Shiva Nataraja dance of creation.
4. `trishul_damru_art.jpg` — Mystical Trishul & Damru on mountain top.
5. `belpatra_lotus_stream.jpg` — Sacred Belpatra leaves and blooming lotus stream.
6. `chandra_shiva_meditation.jpg` — Lord Shiva in deep meditation under crescent moon.

---

## 🎧 3. Audio Discourses, Bhajans & Sound Effects

### A. Full Audio Tracks (Amrit Vani & Bhajans)
Format: **MP3 (128kbps or 192kbps stereo)**. Host on CDN or bundle locally:

| Track ID | Title | Artist / Speaker | Audio Purpose |
| :--- | :--- | :--- | :--- |
| `pr-sahab-1` | शिव गुरु सब जीवों के हैं | साहब श्री हरिंद्रानंद जी | Core discourse on Shiv Shishyata & 3 Sutras |
| `pr-didi-1` | दया माँगने का सच्चा अर्थ | दीदी माँ नीलम आनंद जी | Discourse on Sutra 1 (Asking for Grace) |
| `pr-sahab-2` | चर्चा करने से गुरु कृपा का अनुभव | साहब श्री हरिंद्रानंद जी | Discourse on Sutra 2 (Shiv Charcha) |
| `pr-didi-2` | मातृवत करुणा और शिव साधना | दीदी माँ नीलम आनंद जी | Discourse on Women in Shiv Shishyata |
| `pr-mantra-108` | 108 नमः शिवाय मणके जाप ध्वनि | Guided Chanting | 108-bead guided audio loop (`namah_shivaya_108.mp3`) |
| `pr-bhajan-1` | हे शिव गुरु दया कर दो | शिव शिष्य भजन मण्डली | Featured devotional Shiv Charcha Bhajan |

### B. Interactive Sound Effects (SFX)
Place in `assets/sounds/` directory:

| SFX Name | Trigger Event | Recommended Audio Specs |
| :--- | :--- | :--- |
| **`bell.mp3`** | Tapping Temple Bell in Shivling Puja Canvas | 1–2 sec crisp temple brass bell chime |
| **`shankh.mp3`** | Tapping Shankh in Shivling Puja Canvas | 2–3 sec resonance blow of Shankh |
| **`chime.mp3`** | Offering Flowers / Belpatra / Jap Counter Tap | 0.5 sec soft devotional chime |

---

## 🌐 4. Server Manifests & Deep Link Endpoints

### A. Update Manifest (`version.json`)
Host at: `https://mahavyomastudio.com/apps/shiv-charcha/version.json`

```json
{
  "latestVersion": "1.0.0",
  "minRequiredVersion": "1.0.0",
  "updateUrl": "https://play.google.com/store/apps/details?id=com.mahavyomastudio.shivcharcha",
  "forceUpdate": false,
  "whatsNew": [
    "🔱 शिव संसार - 12 ज्योतिर्लिंग व शक्ति पीठ डिजिटल यात्रा",
    "🪔 पूर्ण हिंदू पंचांग व विक्रम संवत कैलेंडर",
    "🎙️ अमृत वाणी ऑडियो हब (साहब श्री व दीदी माँ के प्रवचन)",
    "📿 108 जाप साधना व 7-दिवसीय कमल साधना ट्रैकर"
  ]
}
```

### B. Android App Links (`assetlinks.json`)
Host at: `https://mahavyomastudio.com/.well-known/assetlinks.json`
Required for `shivcharcha://` and `https://mahavyomastudio.com/apps/shiv-charcha/` deep linking.

---

## 📝 5. Integration Checklist & Next Steps

1. [ ] **Gather HD Images**: Place high-res photos of Sahib Shri & Didi Maa in your CDN or `assets/images/`.
2. [ ] **Replace Audio URLs**: Update `audioUrl` links in `src/content/pravachanLibrary.ts` and `audioLibrary.ts` with production MP3 URLs.
3. [ ] **Add SFX**: Add `bell.mp3`, `shankh.mp3`, and `chime.mp3` to `assets/sounds/`.
4. [ ] **Verify Version Manifest**: Upload `version.json` to your server endpoint.
5. [ ] **Build App Release**: Run `npx expo run:android --variant release` or `eas build` for store submission.

---
*Document created for Shiv Charcha App Production Milestone.*
