# 🎬 How to Add New YouTube Shorts & Video Reels to Shiv Charcha App

This guide explains step-by-step how to add new YouTube Shorts or vertical short videos to the **Shiv Charcha Video Reels** catalog.

---

## 📌 Reel Data Structure

Each reel in the app follows the `ShivReel` interface structure:

```typescript
export interface ShivReel {
  id: string;              // Unique ID (e.g., 'reel-011', 'reel-012')
  title: string;           // Hindi title shown on reel
  subTitle: string;        // Subtitle / brief description
  category: 'sutras' | 'gosthi' | 'vichar'; // Reel category
  youtubeVideoId: string;  // YouTube Video ID (e.g., 'dQw4w9WgXcQ' from https://youtu.be/dQw4w9WgXcQ)
  videoUrl?: string;       // Direct MP4 video URL (optional, e.g., Cloudflare R2 MP4 link)
  likesCount: number;      // Initial likes count (e.g., 250)
  teachingId?: string;     // Linked article ID (optional, e.g., 't-three-sutras')
  tags?: string[];         // Tag keywords (e.g., ['शिव', '3सूत्र'])
}
```

---

## ⚡ Method 1: Remote Dynamic Update (Recommended - No App Re-build Required)

You can add new reels dynamically without publishing a new APK or app update to the Play Store!

1. Open your remote JSON catalog file hosted on your server/CDN at:
   `https://mahavyomastudio.com/apps/shiv-charcha/data/reels.json`

2. Add a new reel object into the JSON array:

```json
[
  {
    "id": "reel-011",
    "title": "तीसरा सूत्र: 108 बार नमः शिवाय जाप की महिमा",
    "subTitle": "साहब श्री हरिंद्रानंद जी का पावन संदेश",
    "category": "sutras",
    "youtubeVideoId": "YOUR_YOUTUBE_SHORTS_ID",
    "videoUrl": "https://pub-your-r2-bucket.r2.dev/reels/shorts_011.mp4",
    "likesCount": 380,
    "teachingId": "t-three-sutras",
    "tags": ["तीसरा सूत्र", "जाप", "शिव"]
  }
]
```

3. Save and upload the file to your server.
4. **Done!** The app automatically syncs the remote JSON catalog in the background and presents the new reels to all users.

---

## 💻 Method 2: Local Code Update (Bundled Fallback Catalog)

To add reels directly inside the codebase so they are bundled with the app build:

1. Open the file:
   `src/content/reelsCatalog.ts` (Clickable Link: [reelsCatalog.ts](file:///media/amit/Other1/webdevelopment/github/mahavyomastudio-apps/app_02_shiv_charcha/src/content/reelsCatalog.ts))

2. Locate `export const shivReelsCatalog: ShivReel[] = [ ... ];`

3. Add your new reel object to the end of the array:

```typescript
  {
    id: 'reel-011',
    title: 'तीसरा सूत्र: 108 बार नमः शिवाय जाप की महिमा',
    subTitle: 'साहब श्री हरिंद्रानंद जी का पावन संदेश',
    category: 'sutras',
    youtubeVideoId: 'YOUR_YOUTUBE_SHORTS_ID',
    videoUrl: 'https://pub-your-r2-bucket.r2.dev/reels/shorts_011.mp4',
    likesCount: 380,
    teachingId: 't-three-sutras',
    tags: ['तीसरा सूत्र', 'जाप', 'शिव'],
  },
```

4. Save the file.

---

## 🖼️ How Poster Thumbnails Work Automatically

You **do not** need to create or upload thumbnail images manually!
The app automatically generates YouTube poster thumbnails using `youtubeVideoId`:

`https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`

Simply provide the `youtubeVideoId` for any video short, and the thumbnail poster will render automatically across the app!
