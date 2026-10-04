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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useTheme } from '@/context/ThemeContext';
import { shadows } from '@/theme/colors';
import { ShivReel } from '@/content/reelsCatalog';
import { ReelsService } from '@/services/reelsService';
import { NativeAdCard } from '@/components/common/NativeAdCard';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { Analytics } from '@/services/analytics/analytics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const REEL_HEIGHT = SCREEN_HEIGHT;

type FeedItem =
  | { type: 'reel'; data: ShivReel }
  | { type: 'ad'; id: string };

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 70,
};

function NativeReelVideo({
  videoUrl,
  isPlaying,
}: {
  videoUrl: string;
  isPlaying: boolean;
}) {
  const player = useVideoPlayer(videoUrl, (p: any) => {
    p.loop = true;
    if (isPlaying) {
      p.play();
    } else {
      p.pause();
    }
  });

  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);

  return (
    <VideoView
      style={styles.fullVideo}
      player={player}
      nativeControls={false}
      contentFit="cover"
    />
  );
}

function SingleReelView({
  reel,
  isPlaying,
  isLiked,
  onToggleLike,
}: {
  reel: ShivReel;
  isPlaying: boolean;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={styles.reelContainer}>
      {/* NATIVE CLOUDFLARE R2 MP4 VIDEO PLAYER */}
      {reel.videoUrl ? (
        <NativeReelVideo
          videoUrl={reel.videoUrl}
          isPlaying={isPlaying}
        />
      ) : (
        <View style={styles.noVideoFallback}>
          <Text style={styles.noVideoText}>वीडियो उपलब्ध कराया जा रहा है...</Text>
        </View>
      )}

      {/* BOTTOM LEFT OVERLAY INFO */}
      <View style={styles.bottomInfoOverlay}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.primary, borderColor: theme.accent }]}>
          <Text style={[styles.categoryBadgeText, { color: theme.textWhite }]}>
            🎬 15s शिव रील • {reel.category === 'sutras' ? '3 सूत्र' : reel.category === 'gosthi' ? 'गोष्ठी' : 'साहब विचार'}
          </Text>
        </View>
        <Text style={styles.reelTitleText}>{reel.title}</Text>
        <Text style={styles.reelSubText}>{reel.subTitle}</Text>

        {reel.teachingId && (
          <TouchableOpacity
            style={[styles.teachingLinkBtn, { backgroundColor: 'rgba(230, 81, 0, 0.9)', borderColor: theme.accent }]}
            onPress={() => router.push(`/teaching/${reel.teachingId}` as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.teachingLinkText}>📖 विस्तृत लेख पढ़ें ➔</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* RIGHT SIDEBAR FLOATING ACTIONS */}
      <View style={styles.rightActionsOverlay}>
        {/* LIKE BUTTON */}
        <TouchableOpacity
          style={styles.actionIconButton}
          onPress={() => onToggleLike(reel.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: isLiked ? '#EF4444' : 'rgba(0,0,0,0.6)' }]}>
            <Text style={{ fontSize: 20 }}>{isLiked ? '❤️' : '🤍'}</Text>
          </View>
          <Text style={styles.actionLabelText}>{reel.likesCount + (isLiked ? 1 : 0)}</Text>
        </TouchableOpacity>

        {/* WHATSAPP SHARE */}
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

        {/* INSTAGRAM FOLLOW */}
        <TouchableOpacity
          style={styles.actionIconButton}
          onPress={() => {
            Analytics.track('click_instagram_follow');
            Linking.openURL('https://www.instagram.com/mahavyomabhakti/');
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: '#E1306C' }]}>
            <Text style={{ fontSize: 18 }}>📸</Text>
          </View>
          <Text style={styles.actionLabelText}>फॉलो</Text>
        </TouchableOpacity>

        {/* YOUTUBE SUBSCRIBE */}
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
}

export default function ShivReelsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [itemsList, setItemsList] = useState<FeedItem[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [activeReelId, setActiveReelId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Analytics.logScreen('ShivReelsScreen');
    let isMounted = true;

    const buildFeed = (reels: ShivReel[]): FeedItem[] => {
      const feed: FeedItem[] = [];
      reels.forEach((reel, index) => {
        feed.push({ type: 'reel', data: reel });
        if ((index + 1) % 4 === 0) {
          feed.push({ type: 'ad', id: `ad-${index}` });
        }
      });
      return feed;
    };

    (async () => {
      // 1. Instantly load local/cached reels (0ms delay on open)
      const cachedReels = await ReelsService.getCachedReels();
      const liked = await ReelsService.getLikedReelIds();

      if (!isMounted) return;
      setLikedIds(liked);

      const initialFeed = buildFeed(cachedReels);
      setItemsList(initialFeed);

      if (cachedReels.length > 0) {
        setActiveReelId(cachedReels[0].id);
      }
      setIsLoading(false);

      // 2. Perform silent background sync for remote catalog updates
      try {
        const remoteReels = await ReelsService.syncRemoteReels();
        if (isMounted && remoteReels && remoteReels.length > 0) {
          setItemsList(buildFeed(remoteReels));
        }
      } catch {
        // Silently preserve cached/local feed
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
        } else {
          setActiveReelId(''); // PAUSE VIDEO AUDIO WHEN AD CARD IS VIEWED!
        }
      } else {
        setActiveReelId('');
      }
    },
    []
  );

  const renderReelItem = ({ item }: { item: FeedItem }) => {
    if (item.type === 'ad') {
      return (
        <View style={[styles.reelContainer, { backgroundColor: '#0B132B', justifyContent: 'center', alignItems: 'center' }]}>
          <View style={[styles.adCard, { backgroundColor: theme.cardBg, borderColor: theme.borderGold }]}>
            <View style={[styles.adBadge, { backgroundColor: theme.accent }]}>
              <Text style={[styles.adBadgeText, { color: theme.primaryDark }]}>📢 प्रायोजित संदेश / विज्ञापन</Text>
            </View>
            <Text style={[styles.adCardTitle, { color: theme.textGold }]}>🌸 ॐ नमः शिवाय 🙏</Text>
            <Text style={[styles.adCardSub, { color: theme.textSecondary }]}>
              शिव शिष्यता व ज्ञान के प्रचार-प्रसार में सहयोग करें
            </Text>

            <View style={styles.nativeAdFrame}>
              <NativeAdCard forceShow={true} />
            </View>

            <View style={[styles.continueReelsPill, { backgroundColor: theme.surfaceElevated, borderColor: theme.borderGold }]}>
              <Text style={[styles.continueReelsText, { color: theme.primary }]}>
                ⬇️ नीचे स्वाइप कर रील्स देखना जारी रखें
              </Text>
            </View>
          </View>
        </View>
      );
    }

    const reel = item.data;
    const isLiked = likedIds.includes(reel.id);
    const isPlaying = activeReelId === reel.id;

    return (
      <SingleReelView
        reel={reel}
        isPlaying={isPlaying}
        isLiked={isLiked}
        onToggleLike={handleToggleLike}
      />
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* FLOATING TOP HEADER */}
      <SafeAreaView style={styles.floatingHeaderArea}>
        <View style={styles.floatingHeaderRow}>
          <TouchableOpacity
            style={[styles.floatingBackBtn, { backgroundColor: 'rgba(0,0,0,0.5)', borderColor: theme.borderGold }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={[styles.floatingBackText, { color: theme.textGold }]}>← शिव चर्चा</Text>
          </TouchableOpacity>
          <Text style={styles.floatingTitleText}>🎬 शिव चर्चा रील्स</Text>
          <TouchableOpacity
            style={[styles.floatingSubscribeBtn, { backgroundColor: '#FF0000' }]}
            onPress={() => ReelsService.openYouTubeChannel()}
            activeOpacity={0.85}
          >
            <Text style={styles.floatingSubscribeText}>► YT चैनल</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* LOADING SCREEN */}
      {isLoading ? (
        <LoadingScreen message="शिव चर्चा रील्स लोड हो रही हैं..." />
      ) : (
        /* REELS VERTICAL FEED */
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
          windowSize={3}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          removeClippedSubviews={Platform.OS === 'android'}
          getItemLayout={(_, index) => ({
            length: REEL_HEIGHT,
            offset: REEL_HEIGHT * index,
            index,
          })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  floatingHeaderArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  floatingHeaderRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  floatingBackBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  floatingBackText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  floatingTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  floatingSubscribeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  floatingSubscribeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: REEL_HEIGHT,
    position: 'relative',
    backgroundColor: '#000000',
  },
  fullVideo: {
    width: SCREEN_WIDTH,
    height: REEL_HEIGHT,
    backgroundColor: '#000000',
  },
  noVideoFallback: {
    width: SCREEN_WIDTH,
    height: REEL_HEIGHT,
    backgroundColor: '#0B132B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomInfoOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 16,
    right: 80,
    zIndex: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  reelTitleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  reelSubText: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
    bottom: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
    gap: 16,
    zIndex: 20,
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
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  adCard: {
    width: SCREEN_WIDTH - 32,
    maxWidth: 360,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.medium,
  },
  adBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  adCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  adCardSub: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  nativeAdFrame: {
    width: 310,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueReelsPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 6,
  },
  continueReelsText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
