# 🎬 How to Fetch, Download & Add New YouTube Shorts to Shiv Charcha App

This guide explains how to fetch new YouTube Shorts from your YouTube channel, download the MP4 videos, upload them to Cloudflare R2 CDN, and update the app catalog automatically.

---

## 🔑 Important: Cloudflare R2 Credentials & GitHub Secrets

To upload video files to Cloudflare R2, credentials are required.

### Your Cloudflare R2 Credentials (from `.env`):
- **R2_ACCESS_KEY_ID**: `a42fe4a695d4e8340c5d9ce9661014d1`
- **R2_SECRET_ACCESS_KEY**: `762206220ebcda7fd86922583b655909f3ae46cb12d678ca95f85a9b61ecc373`

---

## ⚡ Option A: Local Terminal Command (Zero GitHub Setup Required)

If you don't want to set up Secrets on GitHub, you can run the sync command directly on your computer. It reads `.env` automatically!

### Step 1: Ensure `yt-dlp` is Installed
- **Linux / macOS**: `sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp`
- **Windows**: `winget install yt-dlp`

### Step 2: Run Command in Terminal
```bash
npm run sync:reels
```

### What `npm run sync:reels` Does:
1. Executes `scripts/sync-youtube-to-r2.js`.
2. Reads credentials from `.env`.
3. Downloads new Shorts from YouTube using `yt-dlp`.
4. Uploads MP4 files to Cloudflare R2 bucket (`mahavyoma-media`).
5. Updates `src/content/reelsCatalog.ts` and `assets/data/reels.json`.

---

## 🚀 Option B: 1-Click GitHub Action (Cloud Automated)

To use GitHub Action to sync automatically in the cloud:

### Step 1: Add Secrets in GitHub (One-Time Setup)
1. Go to your GitHub Repository: `https://github.com/amit265/shiv-charcha`
2. Click **Settings** (top bar) -> **Secrets and variables** -> **Actions**.
3. Click **New repository secret** and add:
   - Secret 1: `R2_ACCESS_KEY_ID` = `a42fe4a695d4e8340c5d9ce9661014d1`
   - Secret 2: `R2_SECRET_ACCESS_KEY` = `762206220ebcda7fd86922583b655909f3ae46cb12d678ca95f85a9b61ecc373`

### Step 2: Run GitHub Action Manually
1. Go to **Actions** tab in GitHub.
2. Select **"Sync YouTube Shorts to Cloudflare R2"**.
3. Click **Run workflow** -> **Run workflow**.

*(Workflow runs on-demand when triggered manually).*

---

## 📌 File Locations Reference

- **Local Credentials**: [`.env`](file:///media/amit/Other1/webdevelopment/github/mahavyomastudio-apps/app_02_shiv_charcha/.env)
- **Sync Script**: [`scripts/sync-youtube-to-r2.js`](file:///media/amit/Other1/webdevelopment/github/mahavyomastudio-apps/app_02_shiv_charcha/scripts/sync-youtube-to-r2.js)
- **GitHub Action**: [`.github/workflows/sync-reels.yml`](file:///media/amit/Other1/webdevelopment/github/mahavyomastudio-apps/app_02_shiv_charcha/.github/workflows/sync-reels.yml)
- **Catalog File**: [`src/content/reelsCatalog.ts`](file:///media/amit/Other1/webdevelopment/github/mahavyomastudio-apps/app_02_shiv_charcha/src/content/reelsCatalog.ts)
