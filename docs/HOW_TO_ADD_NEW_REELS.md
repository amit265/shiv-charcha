# 🎬 How to Fetch, Download & Add New YouTube Shorts to Shiv Charcha App

This guide explains how to fetch new YouTube Shorts from your YouTube channel, download the MP4 videos, upload them to Cloudflare R2 CDN, and update the app catalog automatically.

---

## 🚀 Method 1: 1-Click GitHub Action (Automated & Cloud-Based)

You can run the sync workflow directly from GitHub without installing anything on your computer!

### Step 1: Open GitHub Repository
1. Go to your repository on GitHub: `https://github.com/amit265/shiv-charcha`
2. Click on the **Actions** tab at the top.

### Step 2: Run Workflow
1. Select **"Sync YouTube Shorts to Cloudflare R2"** from the left sidebar workflows.
2. Click **Run workflow** -> Select `main` branch -> Click **Run workflow**.

### What Happens Automatically:
- GitHub runner fetches YouTube channel RSS feed.
- It detects new Shorts (`#shorts` or short vertical videos).
- Downloads MP4 using `yt-dlp`.
- Uploads MP4 to Cloudflare R2 bucket (`mahavyoma-media`).
- Commits and pushes the updated `src/content/reelsCatalog.ts` and `assets/data/reels.json` catalog back to the repository.
- All app users get the new reels automatically!

*(Note: Ensure repository secrets `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` are configured in GitHub Settings -> Secrets and variables -> Actions)*.

---

## 💻 Method 2: Local Terminal Command (Run on Computer)

You can also run the sync script locally from your terminal:

### Prerequisites:
Make sure `yt-dlp` is installed on your OS:
- **Linux/macOS**: `sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp`
- **Windows**: `winget install yt-dlp`

### Run Command:
```bash
npm run sync:reels
```

### What `npm run sync:reels` Does:
1. Executes `scripts/sync-youtube-to-r2.js`.
2. Checks Cloudflare R2 bucket to skip existing videos.
3. Downloads new YouTube Shorts MP4 files.
4. Uploads them to `https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev`.
5. Updates `src/content/reelsCatalog.ts` and `assets/data/reels.json`.

---

## 🌐 Method 3: Remote JSON Update (Instant Server CDN Sync)

If you host your dynamic catalog on your website server (`mahavyomastudio.com`):

1. Open your remote JSON file:
   `https://mahavyomastudio.com/apps/shiv-charcha/data/reels.json`

2. Append the new reel:
```json
[
  {
    "id": "reel-011",
    "title": "तीसरा सूत्र: 108 बार नमः शिवाय जाप की महिमा",
    "subTitle": "साहब श्री हरिंद्रानंद जी का पावन संदेश",
    "category": "sutras",
    "youtubeVideoId": "YOUR_SHORTS_VIDEO_ID",
    "videoUrl": "https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev/YOUR_SHORTS_VIDEO_ID.mp4",
    "likesCount": 380,
    "sharesCount": 120
  }
]
```

3. Save and upload `reels.json` to your server.
4. Active app users will instantly get the new reels on their next app open!

---

## 📌 File Locations Reference

- **Sync Script**: [`scripts/sync-youtube-to-r2.js`](file:///media/amit/Other1/webdevelopment/github/mahavyomastudio-apps/app_02_shiv_charcha/scripts/sync-youtube-to-r2.js)
- **GitHub Action**: [`.github/workflows/sync-reels.yml`](file:///media/amit/Other1/webdevelopment/github/mahavyomastudio-apps/app_02_shiv_charcha/.github/workflows/sync-reels.yml)
- **Local Catalog**: [`src/content/reelsCatalog.ts`](file:///media/amit/Other1/webdevelopment/github/mahavyomastudio-apps/app_02_shiv_charcha/src/content/reelsCatalog.ts)
- **JSON Feed**: `assets/data/reels.json`
