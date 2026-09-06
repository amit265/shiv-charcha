import manifest from '../../assets/image_assets_manifest.json';

export interface ImageAssetItem {
  id?: string;
  filename: string;
  path: string;
  dimensions?: string;
  description?: string;
  nameHindi?: string;
  location?: string;
}

export const IMAGE_MANIFEST = manifest;

/**
 * Returns the fallback image URL or asset path based on content type
 */
export const getFallbackImage = (category: string): string => {
  const catStr = String(category);
  const fallbacks = manifest.fallbacks as Array<{ id: string; filename: string; path: string }>;
  const match = fallbacks.find((f) => f.id.includes(catStr) || f.filename.includes(catStr));
  if (match) {
    return match.path;
  }
  return manifest.fallbacks[0].path; // fallback_hero_banner.jpg
};

/**
 * Gets list of 20 vertical reel background images for quote cards
 */
export const getReelQuoteBackgrounds = () => {
  return manifest.reels_and_quotes_wallpapers;
};

/**
 * Gets list of 12 Jyotirlinga asset metadata
 */
export const getJyotirlingaAssets = () => {
  return manifest.jyotirlingas;
};

/**
 * Gets list of Shiv Sansar category card asset metadata
 */
export const getSansarCategoryAssets = () => {
  return manifest.sansar_categories;
};
