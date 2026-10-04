const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(fileName, buffer) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: 'video/mp4',
  });
  await s3Client.send(command);
  return `${R2_PUBLIC_BASE_URL}/${fileName}`;
}

console.log('✅ Cloudflare R2 Uploader initialized for mahavyoma-media bucket!');
