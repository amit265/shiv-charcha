const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

// Cloudflare R2 Credentials
const R2_ACCESS_KEY_ID = 'a42fe4a695d4e8340c5d9ce9661014d1';
const R2_SECRET_ACCESS_KEY = '762206220ebcda7fd86922583b655909f3ae46cb12d678ca95f85a9b61ecc373';
const R2_ENDPOINT = 'https://d1bbcb7c4477e8979c796e121b27912e.r2.cloudflarestorage.com';
const BUCKET_NAME = 'mahavyoma-media';
const R2_PUBLIC_BASE_URL = 'https://pub-a5e262d167664d19a4543a1aeb71a9ff.r2.dev';

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

async function uploadFileToR2(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'video/mp4',
  });
  await s3Client.send(command);
  return `${R2_PUBLIC_BASE_URL}/${key}`;
}

async function runUploadSync() {
  console.log('🚀 Connecting to Cloudflare R2 (mahavyoma-media)...');
  const reelsJsonPath = path.join(__dirname, '../assets/data/reels.json');
  if (!fs.existsSync(reelsJsonPath)) {
    console.error('assets/data/reels.json not found!');
    return;
  }

  const reels = JSON.parse(fs.readFileSync(reelsJsonPath, 'utf-8'));
  console.log(`📋 Found ${reels.length} reels to check/sync...`);

  for (let idx = 0; idx < reels.length; idx++) {
    const item = reels[idx];
    const objectKey = `${item.youtubeVideoId}.mp4`;
    const exists = await checkFileExistsInR2(objectKey);

    if (exists) {
      console.log(`  ✓ [R2 Exists] ${objectKey} -> ${R2_PUBLIC_BASE_URL}/${objectKey}`);
      item.videoUrl = `${R2_PUBLIC_BASE_URL}/${objectKey}`;
    } else {
      // Check if local file exists in assets/reels
      const localMp4 = path.join(__dirname, `../assets/reels/${objectKey}`);
      if (fs.existsSync(localMp4)) {
        console.log(`  ⬆️ Uploading ${objectKey} to R2...`);
        const publicUrl = await uploadFileToR2(localMp4, objectKey);
        item.videoUrl = publicUrl;
        console.log(`  ✅ Uploaded: ${publicUrl}`);
      } else {
        console.log(`  ℹ️ [Pending Upload] ${objectKey} - Place MP4 in assets/reels/${objectKey}`);
        delete item.videoUrl;
      }
    }
  }

  fs.writeFileSync(reelsJsonPath, JSON.stringify(reels, null, 2));

  // Also update src/content/reelsCatalog.ts
  const catalogCode = `export interface ShivReel {\n  id: string;\n  youtubeVideoId: string;\n  videoUrl?: string;\n  title: string;\n  subTitle: string;\n  category: 'sutras' | 'gosthi' | 'sahib_ji' | 'mahadev';\n  likesCount: number;\n  sharesCount: number;\n  teachingId?: string;\n  youtubeUrl: string;\n}\n\nexport const shivReelsCatalog: ShivReel[] = ${JSON.stringify(reels, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, '../src/content/reelsCatalog.ts'), catalogCode);

  console.log('\n🎉 R2 Sync Complete! Updated reels.json & reelsCatalog.ts with Cloudflare R2 URLs.');
}

runUploadSync();
