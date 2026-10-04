import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ViewToken,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';
import { ShivReel } from '@/content/reelsCatalog';
import { ReelsService } from '@/services/reelsService';
import { SmartBanner } from '@/components/common/SmartBanner';
import { Analytics } from '@/services/analytics/analytics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Calculate container height subtracting header and safe margin
const REEL_HEIGHT = SCREEN_HEIGHT - (Platform.OS === 'ios' ? 120 : 100);

type FeedItem =
  | { type: 'reel'; data: ShivReel }
  | { type: 'ad'; id: string };

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 70,
};

export default function ShivReelsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [itemsList, setItemsList] = useState<FeedItem[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [activeReelId, setActiveReelId] = useState<string>('');

  useEffect(() => {
    Analytics.logScreen('ShivReelsScreen');
    let isMounted = true;
    (async () => {
      const rawReels = await ReelsService.getReels();
      const liked = await ReelsService.getLikedReelIds();
      if (!isMounted) return;
      setLikedIds(liked);

      const feed: FeedItem[] = [];
      rawReels.forEach((reel, index) => {
        feed.push({ type: 'reel', data: reel });
        if ((index + 1) % 4 === 0) {
          feed.push({ type: 'ad', id: `ad-${index}` });
        }
      });

      setItemsList(feed);
      if (rawReels.length > 0) {
        setActiveReelId(rawReels[0].id);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleLike = async (reelId: string) => {
    const isNowLiked = await ReelsService.toggleLikeReel(reelId);
    if (isNowLiked) {
      setLikedIds((prev) => [...prev, reelId]);
    } else {
      setLikedIds((prev) => prev.filter((id) => id !== reelId));
    }
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const currentItem = viewableItems[0].item as FeedItem;
        if (currentItem && currentItem.type === 'reel') {
          setActiveReelId(currentItem.data.id);
        }
      }
    },
    []
  );

  const renderReelItem = ({ item }: { item: FeedItem }) => {
    if (item.type === 'ad') {
      return (
        <View style={[styles.reelContainer, { backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' }]}>
          <View style={[styles.adCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
            <View style={[styles.adBadge, { backgroundColor: theme.accent }]}>
              <Text style={[styles.adBadgeText, { color: theme.primaryDark }]}>📢 प्रायोजित संदेश / विज्ञापन</Text>
            </View>
            <Text style={[styles.adCardTitle, { color: theme.textGold }]}>🌸 ॐ नमः शिवाय 🙏</Text>
            <Text style={[styles.adCardSub, { color: theme.textSecondary }]}>
              शिव शिष्यता व ज्ञान के प्रचार-प्रसार में सहयोग करें
            </Text>

            <View style={styles.bannerWrapper}>
              <SmartBanner />
            </View>

            <TouchableOpacity
              style={[styles.continueReelsBtn, { backgroundColor: theme.primary, borderColor: theme.borderGold }]}
              onPress={() => {
                // User can swipe down or tap to continue
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.continueReelsText, { color: theme.textWhite }]}>
                ⬇️ नीचे स्वाइप कर रील्स देखना जारी रखें
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const reel = item.data;
    const isLiked = likedIds.includes(reel.id);
    const isPlaying = activeReelId === reel.id;

    return (
      <View style={[styles.reelContainer, { backgroundColor: '#000000' }]}>
        {/* YOUTUBE SHORTS PLAYER */}
        <View style={styles.playerWrapper}>
          <YoutubePlayer
            height={REEL_HEIGHT - 60}
            width={SCREEN_WIDTH}
            play={isPlaying}
            videoId={reel.youtubeVideoId}
            webViewProps={{
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
              androidLayerType: 'hardware',
            }}
            webViewStyle={{ opacity: 0.99 }}
            initialPlayerParams={{
              preventFullScreen: true,
              controls: true,
              modestbranding: true,
              rel: false,
            }}
            onError={(e: string) => console.log('YouTube Player Error:', e)}
          />
        </View>

        {/* BOTTOM LEFT OVERLAY INFO */}
        <View style={styles.bottomInfoOverlay}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.primary, borderColor: theme.accent }]}>
            <Text style={[styles.categoryBadgeText, { color: theme.textWhite }]}>
              🎬 15s शिव रील्स • {reel.category === 'sutras' ? '3 सूत्र' : reel.category === 'gosthi' ? 'गोष्ठी' : 'साहब विचार'}
            </Text>
          </View>
          <Text style={[styles.reelTitleText, { color: '#FFFFFF' }]}>{reel.title}</Text>
          <Text style={[styles.reelSubText, { color: '#E2E8F0' }]}>{reel.subTitle}</Text>

          {/* READ ARTICLE SHORTCUT IF LINKED */}
          {reel.teachingId && (
            <TouchableOpacity
              style={[styles.teachingLinkBtn, { backgroundColor: 'rgba(230, 81, 0, 0.85)', borderColor: theme.accent }]}
              onPress={() => router.push(`/teaching/${reel.teachingId}` as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.teachingLinkText}>📖 विस्तृत लेख पढ़ें ➔</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* RIGHT SIDEBAR ACTIONS OVERLAY */}
        <View style={styles.rightActionsOverlay}>
          {/* LIKE BUTTON */}
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => handleToggleLike(reel.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: isLiked ? '#EF4444' : 'rgba(0,0,0,0.6)' }]}>
              <Text style={{ fontSize: 20 }}>{isLiked ? '❤️' : '🤍'}</Text>
            </View>
            <Text style={styles.actionLabelText}>{reel.likesCount + (isLiked ? 1 : 0)}</Text>
          </TouchableOpacity>

          {/* WHATSAPP SHARE BUTTON */}
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => ReelsService.shareReel(reel)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#25D366' }]}>
              <Text style={{ fontSize: 20 }}>📲</Text>
            </View>
            <Text style={styles.actionLabelText}>शेयर</Text>
          </TouchableOpacity>

          {/* YOUTUBE CHANNEL SUBSCRIBE */}
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => ReelsService.openYouTubeChannel()}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FF0000' }]}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </View>
            <Text style={styles.actionLabelText}>सब्सक्राइब</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>
      <StatusBar barStyle="light-content" />

      {/* TOP HEADER BAR */}
      <View style={[styles.topHeader, { backgroundColor: theme.primaryDark, borderBottomColor: theme.borderGold }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={[styles.backBtnText, { color: theme.textGold }]}>← शिव चर्चा</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textGold }]}>🎬 शिव चर्चा रील्स</Text>
        <TouchableOpacity
          style={[styles.ytSubscribeBtn, { backgroundColor: '#FF0000' }]}
          onPress={() => ReelsService.openYouTubeChannel()}
          activeOpacity={0.85}
        >
          <Text style={styles.ytSubscribeText}>► YT चैनल</Text>
        </TouchableOpacity>
      </View>

      {/* REELS VERTICAL FEED */}
      <FlatList
        data={itemsList}
        renderItem={renderReelItem}
        keyExtractor={(item) => (item.type === 'reel' ? item.data.id : item.id)}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={REEL_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        getItemLayout={(_, index) => ({
          length: REEL_HEIGHT,
          offset: REEL_HEIGHT * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ytSubscribeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  ytSubscribeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: REEL_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
  },
  playerWrapper: {
    width: SCREEN_WIDTH,
    height: REEL_HEIGHT - 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomInfoOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 80,
    zIndex: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  reelTitleText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  reelSubText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  teachingLinkBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  teachingLinkText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  rightActionsOverlay: {
    position: 'absolute',
    right: 14,
    bottom: 40,
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  actionIconButton: {
    alignItems: 'center',
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    ...shadows.soft,
  },
  actionLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adCard: {
    width: SCREEN_WIDTH - 32,
    maxWidth: 360,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.medium,
  },
  adBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 10,
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  adCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adCardSub: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  bannerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 60,
    marginBottom: 16,
  },
  continueReelsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  continueReelsText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
