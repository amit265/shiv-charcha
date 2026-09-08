import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { APP_LINKS } from '@/constants/links';

export function useDeepLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    // 1. Cold start deep link handling (safely delayed until navigation container is mounted)
    Linking.getInitialURL().then((url) => {
      if (url) {
        setTimeout(() => {
          handleUrl(url);
        }, 800);
      }
    }).catch(() => {});

    // 2. Foreground deep link listener
    const subscription = Linking.addEventListener('url', (event) => {
      if (event.url) {
        handleUrl(event.url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleUrl = (url: string) => {
    try {
      // Parse custom scheme or web URL
      // Examples:
      // shivcharcha://teaching/t-three-sutras
      // shivcharcha://book/b-shiv-shishya
      // shivcharcha://stories/st-sati-parvati
      // shivcharcha://jap

      const cleanUrl = url
        .replace(APP_LINKS.deepLinkScheme, '')
        .replace(`${APP_LINKS.appLandingPage}/`, '')
        .replace(APP_LINKS.appLandingPage, '');
      const parts = cleanUrl.split('?')[0].split('/');

      const routeType = parts[0];
      const routeId = parts[1];

      if (routeType === 'teaching' && routeId) {
        router.push(`/teaching/${routeId}` as any);
      } else if (routeType === 'book' && routeId) {
        router.push(`/book/${routeId}` as any);
      } else if (routeType === 'stories' && routeId) {
        router.push(`/sansar/stories/${routeId}` as any);
      } else if (routeType === 'jyotirlinga' && routeId) {
        router.push(`/sansar/jyotirlinga/${routeId}` as any);
      } else if (routeType === 'shakti-peeth' && routeId) {
        router.push(`/sansar/shakti-peeth/${routeId}` as any);
      } else if (routeType === 'jap') {
        router.push('/jap' as any);
      } else if (routeType === 'puja') {
        router.push('/puja' as any);
      } else if (routeType === 'sansar') {
        router.push('/sansar' as any);
      } else if (routeType === 'charcha') {
        router.push('/charcha' as any);
      } else if (routeType === 'calendar') {
        router.push('/calendar' as any);
      }
    } catch (e) {
      // Ignore invalid URL
    }
  };
}
