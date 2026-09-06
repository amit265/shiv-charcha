import { Share, Platform } from 'react-native';

export interface ShareOptions {
  title?: string;
  message: string;
  url?: string;
}

export const safeShare = async (options: ShareOptions): Promise<boolean> => {
  const cleanMessage = (options.message || '').replace(/[—–]/g, '-');
  const cleanTitle = (options.title || '').replace(/[—–]/g, '-');
  const textToShare = options.url ? `${cleanMessage}\n\n${options.url}` : cleanMessage;

  // Web Platform Handling
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // 1. Try Web Share API (Mobile Browsers / Modern Chrome / Safari)
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: options.title || 'शिव चर्चा - हर हर महादेव',
          text: options.message,
          url: options.url,
        });
        return true;
      } catch (err: any) {
        if (err.name === 'AbortError') return true; // User dismissed share sheet
      }
    }

    // 2. Clipboard Fallback
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToShare);
        if (typeof window !== 'undefined' && window.alert) {
          window.alert('संदेश आपके क्लिपबोर्ड पर कॉपी कर दिया गया है! 🙏');
        }
        return true;
      }
    } catch (clipErr) {}

    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`शिव चर्चा संदेश:\n\n${textToShare}`);
    }
    return true;
  }

  // Native iOS / Android Platform Handling
  try {
    const result = await Share.share(
      {
        title: options.title || 'शिव चर्चा',
        message: textToShare,
        url: options.url,
      },
      {
        dialogTitle: options.title || 'शिव चर्चा संदेश साझा करें',
      }
    );
    return result.action !== Share.dismissedAction;
  } catch (err) {
    console.warn('Native share execution fallback:', err);
    return false;
  }
};
