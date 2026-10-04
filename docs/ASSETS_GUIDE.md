# 🪔 Shiv Charcha App — Asset & Production Resource Guide

This guide provides a comprehensive specification of all media assets, sound files, images, icons, and server manifests required to prepare the **Shiv Charcha** app for official release.

---

## 📂 Summary of Asset Locations & Status

| Asset Category | Target Path in Project / Remote Domain | Format | Current Status |
| :--- | :--- | :--- | :--- |
| **App Launcher & Splash Icons** | `assets/images/` | PNG | ✅ **100% Ready (Bundled)** |
| **Bundled Interactive SFX** | `assets/sounds/` | MP3 | ✅ **100% Ready (Bundled)** |
| **Streaming Audio Tracks & Pravachans** | `https://mahavyomastudio.com/apps/shiv-charcha/audio/<filename>.mp3` | MP3 | 🔗 **Mapped in Code (Pending Server Upload)** |
| **App Manifest & Deep Links** | Server root / `.well-known/` | JSON | 🌐 **Configured in Code** |

---

## 🎨 1. App Branding & Store Assets

| Asset Name | Spec / Resolution | File Name | Status | Description & Usage |
| :--- | :--- | :--- | :--- | :--- |
| **App Icon** | 1024 x 1024 px (PNG) | `assets/images/icon.png` | ✅ **Present** | Primary launcher icon |
| **Android Adaptive Icon** | 1024 x 1024 px (PNG) | `assets/images/android-icon-foreground.png` | ✅ **Present** | Android adaptive foreground |
| **Android Background** | 1024 x 1024 px (PNG) | `assets/images/android-icon-background.png` | ✅ **Present** | Android adaptive background |
| **Splash Screen Icon** | 1242 x 2436 px (PNG) | `assets/images/splash-icon.png` | ✅ **Present** | Cold-start splash screen |

---

## 🔊 2. Bundled Sound Effects (`assets/sounds/`)

These audio files are bundled directly inside the app package (`assets/sounds/`) and played locally using `expo-audio`:

| Filename | Status | Description | Usage in App |
| :--- | :--- | :--- | :--- |
| **`bell.mp3`** | ✅ **Present** (171 KB) | Crisp temple brass bell sound effect | Shivling Puja Canvas & Jap Counter |
| **`shankh.mp3`** | ✅ **Present** (383 KB) | Resonant shankhnaad blow sound effect | Shivling Puja Canvas & Jap Counter |
| **`water.mp3`** | ✅ **Present** (117 KB) | Gentle Jalabhishek water stream sound | Shivling Puja Canvas Jalabhishek offering |
| **`damru.mp3`** | ✅ **Present** (146 KB) | Authentic Damru Naad vibration sound | Shivling Puja Canvas Damru offering |
| **`chime.mp3`** | ✅ **Present** (62 KB) | Soft devotional chime sound | Offering flowers/belpatra & Reels like feedback |

---

## 🎵 3. Remote Streaming Audio Tracks

All streaming tracks are fetched directly from the official studio audio server domain:
**`https://mahavyomastudio.com/apps/shiv-charcha/audio/`**

> [!NOTE]
> If a streaming track is missing or fails to load, the app automatically presents a user-friendly toast: **"ऑडियो वर्तमान में उपलब्ध नहीं है।"** and closes the player UI.

### A. Audio Library & Pravachans (`pravachanLibrary.ts` & `audioLibrary.ts`)
| Filename | Title / Speaker | Expected Remote URL | Status |
| :--- | :--- | :--- | :--- |
| `shiv_guru_mere_aadhar.mp3` | शिव गुरु मेरे आधार (भजन) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/shiv_guru_mere_aadhar.mp3` | 🔗 Link Configured |
| `he_shiv_guru_daya_karo.mp3` | हे शिव गुरु दया करो (भजन) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/he_shiv_guru_daya_karo.mp3` | 🔗 Link Configured |
| `108_om_namah_shivaya_chant.mp3` | 108 नमः शिवाय मंत्र जाप | `https://mahavyomastudio.com/apps/shiv-charcha/audio/108_om_namah_shivaya_chant.mp3` | 🔗 Link Configured |
| `sahab_shri_shiv_shishyata.mp3` | शिव शिष्यता का सरल मार्ग (साहब श्री) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/sahab_shri_shiv_shishyata.mp3` | 🔗 Link Configured |
| `aao_chalen_shiv_ki_or.mp3` | आओ चलें शिव की ओर | `https://mahavyomastudio.com/apps/shiv-charcha/audio/aao_chalen_shiv_ki_or.mp3` | 🔗 Link Configured |
| `om_meditation_ambience.mp3` | ॐ ध्यान ध्वनि | `https://mahavyomastudio.com/apps/shiv-charcha/audio/om_meditation_ambience.mp3` | 🔗 Link Configured |
| `pravachan_sahab_shri_01.mp3` | शिव गुरु सब जीवों के हैं (साहब श्री) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/pravachan_sahab_shri_01.mp3` | 🔗 Link Configured |
| `pravachan_didi_maa_01.mp3` | दया माँगने का सच्चा अर्थ (दीदी माँ) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/pravachan_didi_maa_01.mp3` | 🔗 Link Configured |
| `pravachan_sahab_shri_02.mp3` | चर्चा करने से गुरु कृपा (साहब श्री) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/pravachan_sahab_shri_02.mp3` | 🔗 Link Configured |
| `pravachan_didi_maa_02.mp3` | मातृवत करुणा और शिव साधना (दीदी माँ) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/pravachan_didi_maa_02.mp3` | 🔗 Link Configured |

### B. Shiva Stotras (`src/content/sansar/stotras.ts`)
| Filename | Title | Expected Remote URL | Status |
| :--- | :--- | :--- | :--- |
| `shiva_panchakshara_stotram.mp3` | शिव पंचाक्षर स्तोत्रम् | `https://mahavyomastudio.com/apps/shiv-charcha/audio/shiva_panchakshara_stotram.mp3` | 🔗 Link Configured |
| `shiva_tandava_stotram.mp3` | शिव तांडव स्तोत्रम् | `https://mahavyomastudio.com/apps/shiv-charcha/audio/shiva_tandava_stotram.mp3` | 🔗 Link Configured |
| `shiva_mahimna_stotram.mp3` | शिव महिम्न स्तोत्रम् | `https://mahavyomastudio.com/apps/shiv-charcha/audio/shiva_mahimna_stotram.mp3` | 🔗 Link Configured |
| `rudrashtakam.mp3` | श्री रुद्राष्टकम् | `https://mahavyomastudio.com/apps/shiv-charcha/audio/rudrashtakam.mp3` | 🔗 Link Configured |
| `mahamrityunjaya_mantra.mp3` | महामृत्युंजय मंत्र | `https://mahavyomastudio.com/apps/shiv-charcha/audio/mahamrityunjaya_mantra.mp3` | 🔗 Link Configured |
| `daridrya_dahana_stotram.mp3` | दारिद्र्य दहन स्तोत्रम् | `https://mahavyomastudio.com/apps/shiv-charcha/audio/daridrya_dahana_stotram.mp3` | 🔗 Link Configured |
| `lingashtakam.mp3` | श्री लिंगाष्टकम् | `https://mahavyomastudio.com/apps/shiv-charcha/audio/lingashtakam.mp3` | 🔗 Link Configured |
| `shiv_chalisa.mp3` | श्री शिव चालीसा | `https://mahavyomastudio.com/apps/shiv-charcha/audio/shiv_chalisa.mp3` | 🔗 Link Configured |
| `dwadasa_jyotirlinga_stotram.mp3` | द्वादश ज्योतिर्लिंग स्तोत्रम् | `https://mahavyomastudio.com/apps/shiv-charcha/audio/dwadasa_jyotirlinga_stotram.mp3` | 🔗 Link Configured |
| `shiva_ashtottara_shatanama.mp3` | शिव अष्टोत्तर शतनामावली (108 नाम) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/shiva_ashtottara_shatanama.mp3` | 🔗 Link Configured |

### C. Devotional Ringtones (`src/content/ringtones.ts`)
| Filename | Title | Expected Remote URL | Status |
| :--- | :--- | :--- | :--- |
| `ringtone_divya_mandir_bell.mp3` | दिव्य मंदिर घंटी रिंगटोन | `https://mahavyomastudio.com/apps/shiv-charcha/audio/ringtone_divya_mandir_bell.mp3` | 🔗 Link Configured |
| `ringtone_shankhnaad.mp3` | शंखनाद ध्वनि रिंगटोन | `https://mahavyomastudio.com/apps/shiv-charcha/audio/ringtone_shankhnaad.mp3` | 🔗 Link Configured |
| `ringtone_om_namah_shivaya.mp3` | ॐ नमः शिवाय रिंगटोन | `https://mahavyomastudio.com/apps/shiv-charcha/audio/ringtone_om_namah_shivaya.mp3` | 🔗 Link Configured |

### D. Audiobooks & Daily Content (`books.ts` & `dailyMessages.ts`)
| Filename | Purpose | Expected Remote URL | Status |
| :--- | :--- | :--- | :--- |
| `book_aao_chalen_ch1.mp3` | आओ चलें शिव की ओर (अध्याय 1) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/book_aao_chalen_ch1.mp3` | 🔗 Link Configured |
| `book_aao_chalen_ch2.mp3` | आओ चलें शिव की ओर (अध्याय 2) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/book_aao_chalen_ch2.mp3` | 🔗 Link Configured |
| `book_amrit_wani_ch1.mp3` | शिव गुरु अमृत वाणी (अध्याय 1) | `https://mahavyomastudio.com/apps/shiv-charcha/audio/book_amrit_wani_ch1.mp3` | 🔗 Link Configured |
| `daily_msg_today_1.mp3` | दैनिक शिव संदेश 1 | `https://mahavyomastudio.com/apps/shiv-charcha/audio/daily_msg_today_1.mp3` | 🔗 Link Configured |
| `daily_msg_today_2.mp3` | दैनिक शिव संदेश 2 | `https://mahavyomastudio.com/apps/shiv-charcha/audio/daily_msg_today_2.mp3` | 🔗 Link Configured |
| `daily_msg_today_3.mp3` | दैनिक शिव संदेश 3 | `https://mahavyomastudio.com/apps/shiv-charcha/audio/daily_msg_today_3.mp3` | 🔗 Link Configured |

### E. Jyotirlingas, Shakti Peethas & Shiv Sansar (`src/content/sansar/`)
- **Jyotirlingas (12)**: `jyotirlinga_somnath.mp3`, `jyotirlinga_mallikarjuna.mp3`, `jyotirlinga_mahakaleshwar.mp3`, `jyotirlinga_omkareshwar.mp3`, `jyotirlinga_kedarnath.mp3`, `jyotirlinga_bhimashankar.mp3`, `jyotirlinga_kashi_vishwanath.mp3`, `jyotirlinga_trimbakeshwar.mp3`, `jyotirlinga_vaidyanath.mp3`, `jyotirlinga_nageshwar.mp3`, `jyotirlinga_ramanathaswamy.mp3`, `jyotirlinga_grishneshwar.mp3`
- **Shakti Peethas (15+)**: `shaktipeeth_kamakhya.mp3`, `shaktipeeth_kalighat.mp3`, `shaktipeeth_tarapith.mp3`, `shaktipeeth_hinglaj.mp3`, `shaktipeeth_jwalaji.mp3`, `shaktipeeth_ambaji.mp3`, `shaktipeeth_vishalakshi.mp3`, `shaktipeeth_chamundeshwari.mp3`, `shaktipeeth_kamakshi.mp3`, `shaktipeeth_naina_devi.mp3`, `shaktipeeth_sharda.mp3`, `shaktipeeth_chinnamasta.mp3`, `shaktipeeth_kankalitala.mp3`, `shaktipeeth_tripura_sundari.mp3`, `shaktipeeth_vindhyavasini.mp3`
- **Kathas & Legends (13)**: `story_sati_and_shiva.mp3`, `story_shiva_and_parvati.mp3`, `story_samudra_manthan.mp3`, `story_ganga_avataran.mp3`, `story_markandeya_raksha.mp3`, `story_tripurantaka_story.mp3`, `story_bhasmasura_and_mohini.mp3`, `story_ganesha_janm.mp3`, `story_ravan_bhakti.mp3`, `story_lingaodbhava.mp3`, `story_nandi_katha.mp3`, `story_natraj_tandava.mp3`, `story_shiv_shishyata.mp3`
- **Family & Avatars (14+)**: `sansar_shiva_head.mp3`, `sansar_parvati_mother.mp3`, `sansar_ganesha_son.mp3`, `sansar_kartikeya_son.mp3`, `sansar_nandi_devotee.mp3`, `sansar_ashokasundari.mp3`, `sansar_ayappa.mp3`, `sansar_veerabhadra.mp3`, `sansar_mahadev.mp3`, `sansar_neelkanth.mp3`, `sansar_nataraja.mp3`, `sansar_ardhanarishvara.mp3`, `sansar_dakshinamurthy.mp3`, `sansar_kalabhairava.mp3`, `sansar_pashupati.mp3`, `sansar_ekadasha_rudra.mp3`, `sansar_sharabha.mp3`, `sansar_pippalada.mp3`
- **Symbols, Temples & Festivals**: `symbol_shivling.mp3`, `symbol_trishula.mp3`, `symbol_damru.mp3`, `symbol_rudraksha.mp3`, `symbol_third_eye.mp3`, `symbol_bilva_patra.mp3`, `symbol_tripundra.mp3`, `symbol_crescent_moon.mp3`, `symbol_pashupatinath.mp3`, `symbol_tungnath.mp3`, `symbol_amarnath.mp3`, `symbol_chidambaram.mp3`, `symbol_murudeshwar.mp3`, `symbol_lingaraj.mp3`, `symbol_mahashivratri.mp3`, `symbol_shravan_maas.mp3`, `symbol_pradosh_vrat.mp3`

### F. Remote Ultra-HD Wallpapers & High-Res Image CDN
Host at: `https://mahavyomastudio.com/apps/shiv-charcha/images/wallpapers/`
- **HD Wallpaper Images (20)**:
  `reel_alpine_shrine_at_golden_dawn.jpg`, `reel_ash_sprinkled_shiva_linga_ritual.jpg`, `reel_cinematic_shiva_shrine_with_lotus_offerings.jpg`, `reel_cosmic_shiva_beneath_the_open_sky.jpg`, `reel_cosmic_shiva_beneath_the_stars.jpg`, `reel_crescent_moon_trident_shrine.jpg`, `reel_ganga_aarti_at_dusk.jpg`, `reel_himalayan_sunrise_with_sacred_trident.jpg`, `reel_lord_shiva_beneath_the_himalayan_moon_reel_shiva_quote_01.jpg`, `reel_meditating_at_the_himalayan_sunrise.jpg`, `reel_mystical_damru_beneath_shivas_moonlit_silhouette.jpg`, `reel_mystic_sadhu_beneath_moonlit_himalayas.jpg`, `reel_pilgrimage_to_the_frozen_shrine.jpg`, `reel_rudraksha_mala_at_a_shiva_shrine.jpg`, `reel_sacred_abhisheka_at_the_shiva_shrine.jpg`, `reel_shiva_and_parvati_beneath_the_himalayan_moon.jpg`, `reel_shiva_nataraja_in_cosmic_fire.jpg`, `reel_snowy_himalayan_temple_at_twilight.jpg`, `reel_somnath_temple_at_sunset.jpg`, `reel_twilight_temple_ghats_aglow.jpg`

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

## 📝 5. Integration Checklist

1. [x] **Bundled Interactive SFX**: `bell.mp3`, `shankh.mp3`, `water.mp3`, `damru.mp3`, `chime.mp3` added to `assets/sounds/` and verified with `expo-audio`.
2. [x] **Audio Failure Toast**: App cleanly handles missing/unreachable audio by hiding the player and showing `"ऑडियो वर्तमान में उपलब्ध नहीं है।"`.
3. [x] **Standardized Codebase Audio Links**: 100% of audio items in the codebase point to `https://mahavyomastudio.com/apps/shiv-charcha/audio/<filename>.mp3`.
4. [x] **App Branding & Launcher Icons**: App launcher icon, adaptive foreground/background, and splash screen icons bundled.
5. [ ] **Upload Remote MP3s to Server**: Upload your audio files with the specified filenames to `https://mahavyomastudio.com/apps/shiv-charcha/audio/`.
6. [ ] **Host `version.json`**: Upload `version.json` to server endpoint for in-app update checks.

---
*Document updated for Shiv Charcha App Production Release.*
