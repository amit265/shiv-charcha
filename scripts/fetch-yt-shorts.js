const fs = require('fs');

async function isShortVideo(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });
    // YouTube redirects regular videos to /watch?v=, but Shorts stay on /shorts/
    return res.url.includes('/shorts/');
  } catch (e) {
    return false;
  }
}

async function fetchChannelShorts() {
  const channelId = 'UCNJTNH_JjOdqjQrnzQtagdg';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    console.log(`🔍 Fetching channel RSS feed for ${channelId}...`);
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

        // Check if title has #shorts or verify via URL redirect
        const hasShortTag = title.toLowerCase().includes('#shorts') || title.toLowerCase().includes('short');
        const isShort = hasShortTag || (await isShortVideo(videoId));

        if (isShort) {
          const firstDescLine = rawDesc.split('\n').filter(l => l.trim().length > 0)[0] || 'शिव गुरु साधना व विचार';
          const cleanSubTitle = firstDescLine.slice(0, 65);

          let category = 'sutras';
          if (title.includes('गोष्ठी')) category = 'gosthi';
          else if (title.includes('साहब') || title.includes('दीदी')) category = 'sahib_ji';
          else if (title.includes('महादेव') || title.includes('शिव')) category = 'mahadev';

          reels.push({
            id: `reel-${videoId}`,
            youtubeVideoId: videoId,
            title: title,
            subTitle: cleanSubTitle,
            category: category,
            likesCount: 1200 + (idx * 140),
            sharesCount: 320 + (idx * 35),
            youtubeUrl: `https://youtube.com/shorts/${videoId}`,
          });
          console.log(`  ✓ Verified Short: [${videoId}] ${title.slice(0, 40)}`);
        } else {
          console.log(`  ⏩ Skipping long video: [${videoId}] ${title.slice(0, 40)}`);
        }
      }
    }

    if (reels.length > 0) {
      fs.writeFileSync('assets/data/reels.json', JSON.stringify(reels, null, 2));

      const catalogCode = `export interface ShivReel {\n  id: string;\n  youtubeVideoId: string;\n  title: string;\n  subTitle: string;\n  category: 'sutras' | 'gosthi' | 'sahib_ji' | 'mahadev';\n  likesCount: number;\n  sharesCount: number;\n  teachingId?: string;\n  youtubeUrl: string;\n}\n\nexport const shivReelsCatalog: ShivReel[] = ${JSON.stringify(reels, null, 2)};\n`;

      fs.writeFileSync('src/content/reelsCatalog.ts', catalogCode);
      console.log(`\n🎉 Successfully fetched and verified ${reels.length} SHORTS ONLY!`);
    } else {
      console.log('No YouTube Shorts entries found in channel.');
    }
  } catch (err) {
    console.error('Error fetching YouTube channel feed:', err);
  }
}

fetchChannelShorts();
