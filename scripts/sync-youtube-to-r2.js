const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

// Load local .env if present
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of envLines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      const val = match[2] ? match[2].trim().replace(/^['"]|['"]$/g, '') : '';
      process.env[key] = process.env[key] || val;
    }
  }
}

// Cloudflare R2 Credentials
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_ENDPOINT = 'https://d1bbcb7c4477e8979c796e121b27912e.r2.cloudflarestorage.com';
const BUCKET_NAME = 'mahavyoma-media';
const R2_PUBLIC_BASE_URL = 'https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev';
const YOUTUBE_CHANNEL_ID = 'UCNJTNH_JjOdqjQrnzQtagdg';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function checkFileExistsInR2(key) {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return true;
  } catch (_e) {
    return false;
  }
}

async function uploadBufferToR2(buffer, key) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'video/mp4',
  });
  await s3Client.send(command);
  return `${R2_PUBLIC_BASE_URL}/${key}`;
}

async function isShortVideo(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    return res.url.includes('/shorts/');
  } catch (_e) {
    return false;
  }
}

function downloadYouTubeShort(videoId) {
  try {
    console.log(`  📥 Downloading video from YouTube [${videoId}]...`);
    const cmd = `yt-dlp --extractor-args "youtube:player_client=android,web" -f "b[ext=mp4]/best[ext=mp4]/best" --no-warnings --no-playlist -o - "https://www.youtube.com/shorts/${videoId}"`;
    const videoBuffer = execSync(cmd, { maxBuffer: 100 * 1024 * 1024 });
    return videoBuffer;
  } catch (err) {
    console.error(`  ❌ Failed to download video ${videoId}:`, err.message);
    return null;
  }
}

async function syncYouTubeToR2() {
  console.log(`\n======================================================`);
  console.log(`🚀 Starting YouTube Shorts -> Cloudflare R2 Sync Workflow`);
  console.log(`📺 Channel ID: ${YOUTUBE_CHANNEL_ID}`);
  console.log(`📦 Cloudflare R2 Bucket: ${BUCKET_NAME}`);
  console.log(`======================================================\n`);

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

  try {
    console.log(`🔍 Fetching channel RSS feed...`);
    const res = await fetch(rssUrl);
    const xml = await res.text();

    const entryMatches = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    const reels = [];

    for (let idx = 0; idx < entryMatches.length; idx++) {
      const entryXml = entryMatches[idx][1];
      const videoIdMatch = entryXml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entryXml.match(/<title>(.*?)<\/title>/);
      const descMatch = entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/);

      if (videoIdMatch && titleMatch) {
        const videoId = videoIdMatch[1].trim();
        const title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
        const rawDesc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';

        const hasShortTag = title.toLowerCase().includes('#shorts') || title.toLowerCase().includes('short');
        const isShort = hasShortTag || (await isShortVideo(videoId));

        if (!isShort) {
          console.log(`⏩ Skipping long video: [${videoId}] ${title.slice(0, 40)}`);
          continue;
        }

        console.log(`\n🎬 Processing Short: [${videoId}] ${title}`);

        const objectKey = `${videoId}.mp4`;
        const existsInR2 = await checkFileExistsInR2(objectKey);

        let videoUrl;

        if (existsInR2) {
          videoUrl = `${R2_PUBLIC_BASE_URL}/${objectKey}`;
          console.log(`  ✓ Already in Cloudflare R2: ${videoUrl}`);
        } else {
          console.log(`  ⚡ Not in Cloudflare R2 yet. Initiating download & upload...`);
          const videoBuffer = downloadYouTubeShort(videoId);
          if (videoBuffer && videoBuffer.length > 0) {
            console.log(`  ⬆️ Uploading ${objectKey} (${(videoBuffer.length / (1024 * 1024)).toFixed(2)} MB) to Cloudflare R2...`);
            videoUrl = await uploadBufferToR2(videoBuffer, objectKey);
            console.log(`  ✅ Successfully uploaded to R2: ${videoUrl}`);
          }
        }

        const firstDescLine = rawDesc.split('\n').filter(l => l.trim().length > 0)[0] || 'शिव गुरु साधना व विचार';
        const cleanSubTitle = firstDescLine.slice(0, 65);

        let category = 'sutras';
        if (title.includes('गोष्ठी')) category = 'gosthi';
        else if (title.includes('साहब') || title.includes('दीदी')) category = 'sahib_ji';
        else if (title.includes('महादेव') || title.includes('शिव')) category = 'mahadev';

        reels.push({
          id: `reel-${videoId}`,
          youtubeVideoId: videoId,
          ...(videoUrl ? { videoUrl } : {}),
          title: title,
          subTitle: cleanSubTitle,
          category: category,
          likesCount: 1200 + (idx * 140),
          sharesCount: 320 + (idx * 35),
          youtubeUrl: `https://youtube.com/shorts/${videoId}`,
        });
      }
    }

    if (reels.length > 0) {
      const reelsJsonPath = path.join(__dirname, '../assets/data/reels.json');
      const reelsCatalogPath = path.join(__dirname, '../src/content/reelsCatalog.ts');

      fs.writeFileSync(reelsJsonPath, JSON.stringify(reels, null, 2));

      const catalogCode = `export interface ShivReel {
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
    return \`https://img.youtube.com/vi/\${reel.youtubeVideoId}/hqdefault.jpg\`;
  }
  return '';
}

export const shivReelsCatalog: ShivReel[] = ${JSON.stringify(reels, null, 2)};
`;

      fs.writeFileSync(reelsCatalogPath, catalogCode);

      console.log(`\n======================================================`);
      console.log(`🎉 Sync Complete! Processed ${reels.length} YouTube Shorts.`);
      console.log(`📄 Updated: assets/data/reels.json`);
      console.log(`📄 Updated: src/content/reelsCatalog.ts`);
      console.log(`======================================================\n`);
    } else {
      console.log('No YouTube Shorts entries found in channel.');
    }
  } catch (err) {
    console.error('Error during YouTube -> R2 sync:', err);
  }
}

syncYouTubeToR2();
