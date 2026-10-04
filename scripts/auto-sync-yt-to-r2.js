const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Cloudflare R2 Credentials
const R2_ACCESS_KEY_ID = 'cfat_VUo4nkHqRZc1IziJFAEvl3SqCOkDntYPztQvuh4L6b834ecd';
const R2_SECRET_ACCESS_KEY = '0ad22150d53bb28c0c3fc15d7e27b00a29f7483c3f6a10f4852af0377e91c10d';
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
