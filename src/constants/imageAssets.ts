import { ImageSourcePropType } from 'react-native';
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

// Fallback image assets
export const FALLBACK_IMAGES: Record<string, ImageSourcePropType> = {
  hero: require('../../assets/images/fallbacks/fallback_hero_banner.jpg'),
  jyotirlinga: require('../../assets/images/fallbacks/fallback_jyotirlinga.jpg'),
  'shakti-peeth': require('../../assets/images/fallbacks/fallback_shakti_peeth.jpg'),
  shakti_peeth: require('../../assets/images/fallbacks/fallback_shakti_peeth.jpg'),
  story: require('../../assets/images/fallbacks/fallback_story.jpg'),
  stotra: require('../../assets/images/fallbacks/fallback_stotra.jpg'),
  temple: require('../../assets/images/fallbacks/fallback_temple.jpg'),
  family: require('../../assets/images/fallbacks/fallback_family.jpg'),
  swaroop: require('../../assets/images/fallbacks/fallback_swaroop.jpg'),
  symbol: require('../../assets/images/fallbacks/fallback_symbol.jpg'),
  book: require('../../assets/images/fallbacks/fallback_book.jpg'),
  teaching: require('../../assets/images/fallbacks/fallback_teaching.jpg'),
  reel: require('../../assets/images/fallbacks/fallback_reel_bg.jpg'),
};

// Jyotirlingas (12 bundled local images)
export const JYOTIRLINGA_IMAGES: Record<string, ImageSourcePropType> = {
  somnath: require('../../assets/images/jyotirlinga/jyotirlinga_somnath.jpg'),
  mallikarjuna: require('../../assets/images/jyotirlinga/jyotirlinga_mallikarjuna.jpg'),
  mahakaleshwar: require('../../assets/images/jyotirlinga/jyotirlinga_mahakaleshwar.jpg'),
  omkareshwar: require('../../assets/images/jyotirlinga/jyotirlinga_omkareshwar.jpg'),
  kedarnath: require('../../assets/images/jyotirlinga/jyotirlinga_kedarnath.jpg'),
  bhimashankar: require('../../assets/images/jyotirlinga/jyotirlinga_bhimashankar.jpg'),
  'kashi-vishwanath': require('../../assets/images/jyotirlinga/jyotirlinga_kashi_vishwanath.jpg'),
  kashi_vishwanath: require('../../assets/images/jyotirlinga/jyotirlinga_kashi_vishwanath.jpg'),
  trimbakeshwar: require('../../assets/images/jyotirlinga/jyotirlinga_trimbakeshwar.jpg'),
  vaidyanath: require('../../assets/images/jyotirlinga/jyotirlinga_vaidyanath.jpg'),
  nageshwar: require('../../assets/images/jyotirlinga/jyotirlinga_nageshwar.jpg'),
  rameshwaram: require('../../assets/images/jyotirlinga/jyotirlinga_rameshwaram.jpg'),
  ramanathaswamy: require('../../assets/images/jyotirlinga/jyotirlinga_rameshwaram.jpg'),
  ghushneshwar: require('../../assets/images/jyotirlinga/jyotirlinga_ghushneshwar.jpg'),
  grishneshwar: require('../../assets/images/jyotirlinga/jyotirlinga_ghushneshwar.jpg'),
};

// Shakti Peethas (20 bundled local images)
export const SHAKTI_PEETH_IMAGES: Record<string, ImageSourcePropType> = {
  kamakhya: require('../../assets/images/shakti_peeth/shakti_peeth_01_kamakhya.jpg'),
  kalighat: require('../../assets/images/shakti_peeth/shakti_peeth_02_kalighat.jpg'),
  tarapith: require('../../assets/images/shakti_peeth/shakti_peeth_03_tarapith.jpg'),
  hinglaj: require('../../assets/images/shakti_peeth/shakti_peeth_04_hinglaj.jpg'),
  jwalaji: require('../../assets/images/shakti_peeth/shakti_peeth_05_jwalaji.jpg'),
  ambaji: require('../../assets/images/shakti_peeth/shakti_peeth_06_ambaji.jpg'),
  vishalakshi: require('../../assets/images/shakti_peeth/shakti_peeth_07_vishalakshi.jpg'),
  'naina-devi': require('../../assets/images/shakti_peeth/shakti_peeth_08_naina_devi.jpg'),
  naina_devi: require('../../assets/images/shakti_peeth/shakti_peeth_08_naina_devi.jpg'),
  'tripura-sundari': require('../../assets/images/shakti_peeth/shakti_peeth_09_tripura_sundari.jpg'),
  tripura_sundari: require('../../assets/images/shakti_peeth/shakti_peeth_09_tripura_sundari.jpg'),
  'sharada-peeth': require('../../assets/images/shakti_peeth/shakti_peeth_10_sharada.jpg'),
  sharada: require('../../assets/images/shakti_peeth/shakti_peeth_10_sharada.jpg'),
  'vaishno-devi': require('../../assets/images/shakti_peeth/shakti_peeth_11_vaishno_devi.jpg'),
  vaishno_devi: require('../../assets/images/shakti_peeth/shakti_peeth_11_vaishno_devi.jpg'),
  'alopi-prayag': require('../../assets/images/shakti_peeth/shakti_peeth_12_alopi_prayag.jpg'),
  alopi_prayag: require('../../assets/images/shakti_peeth/shakti_peeth_12_alopi_prayag.jpg'),
  vindhyavasini: require('../../assets/images/shakti_peeth/shakti_peeth_13_vindhyavasini.jpg'),
  'baidyanath-jayadurga': require('../../assets/images/shakti_peeth/shakti_peeth_14_jayadurga.jpg'),
  jayadurga: require('../../assets/images/shakti_peeth/shakti_peeth_14_jayadurga.jpg'),
  'harsiddhi-ujjain': require('../../assets/images/shakti_peeth/shakti_peeth_15_harsiddhi.jpg'),
  harsiddhi: require('../../assets/images/shakti_peeth/shakti_peeth_15_harsiddhi.jpg'),
  chamundeshwari: require('../../assets/images/shakti_peeth/shakti_peeth_16_chamundeshwari.jpg'),
  kankalitala: require('../../assets/images/shakti_peeth/shakti_peeth_17_kankalitala.jpg'),
  attahasa: require('../../assets/images/shakti_peeth/shakti_peeth_18_attahasa.jpg'),
  nalhati: require('../../assets/images/shakti_peeth/shakti_peeth_19_nalhati.jpg'),
  bakreshwar: require('../../assets/images/shakti_peeth/shakti_peeth_20_bakreshwar.jpg'),
};

export const STORY_IMAGES: Record<string, ImageSourcePropType> = {
  'sati-and-shiva': require('../../assets/images/story/story_shiva_and_sati_beneath_himalayan_skies.jpg'),
  'shiva-and-parvati': require('../../assets/images/story/story_shiva_and_parvatis_himalayan_wedding.jpg'),
  'samudra-manthan': require('../../assets/images/story/story_neelkanth_during_the_ocean_churning.jpg'),
  'ganga-avataran': require('../../assets/images/story/story_divine_descent_of_the_ganga.jpg'),
  'ganga-avtaran': require('../../assets/images/story/story_divine_descent_of_the_ganga.jpg'),
  'sati-dahan': require('../../assets/images/story/story_satis_sacred_fire_ceremony.jpg'),
  'shiv-parvati-vivah': require('../../assets/images/story/story_shiva_and_parvatis_himalayan_wedding.jpg'),
  'neelkanth-samudra-manthan': require('../../assets/images/story/story_neelkanth_during_the_ocean_churning.jpg'),
  
  story_divine_descent_of_the_ganga: require('../../assets/images/story/story_divine_descent_of_the_ganga.jpg'),
  story_grand_royal_yajna_ceremony: require('../../assets/images/story/story_grand_royal_yajna_ceremony.jpg'),
  story_himalayan_kings_celestial_vision: require('../../assets/images/story/story_himalayan_kings_celestial_vision.jpg'),
  story_himalayan_meditation_beneath_shivas_vision: require('../../assets/images/story/story_himalayan_meditation_beneath_shivas_vision.jpg'),
  story_neelkanth_during_the_ocean_churning: require('../../assets/images/story/story_neelkanth_during_the_ocean_churning.jpg'),
  story_samudra_manthan_churning_the_cosmic_ocean: require('../../assets/images/story/story_samudra_manthan_churning_the_cosmic_ocean.jpg'),
  story_satis_sacred_fire_ceremony: require('../../assets/images/story/story_satis_sacred_fire_ceremony.jpg'),
  story_shiva_and_gangas_himalayan_descent: require('../../assets/images/story/story_shiva_and_gangas_himalayan_descent.jpg'),
  story_shiva_and_parvati_in_divine_assembly: require('../../assets/images/story/story_shiva_and_parvati_in_divine_assembly.jpg'),
  story_shiva_and_parvatis_divine_devotion: require('../../assets/images/story/story_shiva_and_parvatis_divine_devotion.jpg'),
  story_shiva_and_parvatis_himalayan_wedding_agni: require('../../assets/images/story/story_shiva_and_parvatis_himalayan_wedding_agni.jpg'),
  story_shiva_and_parvatis_himalayan_wedding: require('../../assets/images/story/story_shiva_and_parvatis_himalayan_wedding.jpg'),
  story_shiva_and_sati_beneath_himalayan_skies: require('../../assets/images/story/story_shiva_and_sati_beneath_himalayan_skies.jpg'),
  story_shiva_drinks_the_cosmic_poison: require('../../assets/images/story/story_shiva_drinks_the_cosmic_poison.jpg'),
  story_shiva_receiving_the_heavenly_ganges: require('../../assets/images/story/story_shiva_receiving_the_heavenly_ganges.jpg'),
  story_shivas_himalayan_wedding_procession: require('../../assets/images/story/story_shivas_himalayan_wedding_procession.jpg'),
  story_shiva_summons_the_divine_warrior_army: require('../../assets/images/story/story_shiva_summons_the_divine_warrior_army.jpg'),

  // Newly added story scenes & covers
  sati_and_shiva_scene_2: require('../../assets/images/story/sati_and_shiva_scene_2.jpg'),
  sati_and_shiva_scene_6: require('../../assets/images/story/sati_and_shiva_scene_6.jpg'),
  markandeya_raksha_cover: require('../../assets/images/story/markandeya_raksha_cover.jpg'),
  'markandeya-raksha': require('../../assets/images/story/markandeya_raksha_cover.jpg'),
  markandeya_raksha_scene_1: require('../../assets/images/story/markandeya_raksha_scene_1.jpg'),
  markandeya_raksha_scene_2: require('../../assets/images/story/markandeya_raksha_scene_2.jpg'),
  tripurantaka_story_cover: require('../../assets/images/story/tripurantaka_story_cover.jpg'),
  'tripurantaka-story': require('../../assets/images/story/tripurantaka_story_cover.jpg'),
  tripurantaka_story_scene_1: require('../../assets/images/story/tripurantaka_story_scene_1.jpg'),
  tripurantaka_story_scene_2: require('../../assets/images/story/tripurantaka_story_scene_2.jpg'),
  bhasmasura_and_mohini_cover: require('../../assets/images/story/bhasmasura_and_mohini_cover.jpg'),
  'bhasmasura-and-mohini': require('../../assets/images/story/bhasmasura_and_mohini_cover.jpg'),
  bhasmasura_and_mohini_scene_1: require('../../assets/images/story/bhasmasura_and_mohini_scene_1.jpg'),
  bhasmasura_and_mohini_scene_2: require('../../assets/images/story/bhasmasura_and_mohini_scene_2.jpg'),
  kiratarjuniya_story_cover: require('../../assets/images/story/kiratarjuniya_story_cover.jpg'),
  'kiratarjuniya-story': require('../../assets/images/story/kiratarjuniya_story_cover.jpg'),
  kiratarjuniya_story_scene_1: require('../../assets/images/story/kiratarjuniya_story_scene_1.jpg'),
  kiratarjuniya_story_scene_2: require('../../assets/images/story/kiratarjuniya_story_scene_2.jpg'),
};

export const FAMILY_IMAGES: Record<string, ImageSourcePropType> = {
  'ganesha-son': require('../../assets/images/family/family_ganesha.jpg'),
  ganesha_son: require('../../assets/images/family/family_ganesha.jpg'),
  ganesha: require('../../assets/images/family/family_ganesha.jpg'),
  family_ganesha: require('../../assets/images/family/family_ganesha.jpg'),
  'kartikeya-son': require('../../assets/images/family/family_kartikeya.jpg'),
  kartikeya_son: require('../../assets/images/family/family_kartikeya.jpg'),
  kartikeya: require('../../assets/images/family/family_kartikeya.jpg'),
  family_kartikeya: require('../../assets/images/family/family_kartikeya.jpg'),
  'nandi-devotee': require('../../assets/images/family/family_nandi.jpg'),
  nandi_devotee: require('../../assets/images/family/family_nandi.jpg'),
  nandi: require('../../assets/images/family/family_nandi.jpg'),
  family_nandi: require('../../assets/images/family/family_nandi.jpg'),
  'parvati-mother': require('../../assets/images/family/family_parvati.jpg'),
  parvati_mother: require('../../assets/images/family/family_parvati.jpg'),
  parvati: require('../../assets/images/family/family_parvati.jpg'),
  family_parvati: require('../../assets/images/family/family_parvati.jpg'),
};

export const SWAROOP_IMAGES: Record<string, ImageSourcePropType> = {
  panchanana: require('../../assets/images/swaroop/swaroop_panchanana.jpg'),
  swaroop_panchanana: require('../../assets/images/swaroop/swaroop_panchanana.jpg'),
  pashupati: require('../../assets/images/swaroop/swaroop_pashupati.jpg'),
  swaroop_pashupati: require('../../assets/images/swaroop/swaroop_pashupati.jpg'),
  ardhanarishvara: require('../../assets/images/swaroop/swaroop_ardhanarishvara.jpg'),
  swaroop_ardhanarishvara: require('../../assets/images/swaroop/swaroop_ardhanarishvara.jpg'),
  mahadev: require('../../assets/images/swaroop/swaroop_mahadev.jpg'),
  swaroop_mahadev: require('../../assets/images/swaroop/swaroop_mahadev.jpg'),
  mahakal: require('../../assets/images/swaroop/swaroop_mahakal.jpg'),
  swaroop_mahakal: require('../../assets/images/swaroop/swaroop_mahakal.jpg'),
  kalabhairava: require('../../assets/images/swaroop/swaroop_kalabhairava.jpg'),
  swaroop_kalabhairava: require('../../assets/images/swaroop/swaroop_kalabhairava.jpg'),
  nataraja: require('../../assets/images/swaroop/swaroop_nataraja.jpg'),
  swaroop_nataraja: require('../../assets/images/swaroop/swaroop_nataraja.jpg'),
  neelkanth: require('../../assets/images/swaroop/swaroop_neelkanth.jpg'),
  swaroop_neelkanth: require('../../assets/images/swaroop/swaroop_neelkanth.jpg'),
  dakshinamurthy: require('../../assets/images/swaroop/swaroop_dakshinamurthy.jpg'),
  swaroop_dakshinamurthy: require('../../assets/images/swaroop/swaroop_dakshinamurthy.jpg'),
};

export const FESTIVAL_IMAGES: Record<string, ImageSourcePropType> = {
  'pradosh-vrat': require('../../assets/images/festivals/festival_pradosh_vrat.jpg'),
  pradosh_vrat: require('../../assets/images/festivals/festival_pradosh_vrat.jpg'),
  festival_pradosh_vrat: require('../../assets/images/festivals/festival_pradosh_vrat.jpg'),
  mahashivratri: require('../../assets/images/festivals/festival_mahashivratri.jpg'),
  festival_mahashivratri: require('../../assets/images/festivals/festival_mahashivratri.jpg'),
  'shravan-maas': require('../../assets/images/festivals/festival_shravan_maas.jpg'),
  shravan_maas: require('../../assets/images/festivals/festival_shravan_maas.jpg'),
  festival_shravan_maas: require('../../assets/images/festivals/festival_shravan_maas.jpg'),
};

export const TEMPLE_IMAGES: Record<string, ImageSourcePropType> = {
  tungnath: require('../../assets/images/temples/temple_tungnath.jpg'),
  temple_tungnath: require('../../assets/images/temples/temple_tungnath.jpg'),
  amarnath: require('../../assets/images/temples/temple_amarnath.jpg'),
  temple_amarnath: require('../../assets/images/temples/temple_amarnath.jpg'),
  pashupatinath: require('../../assets/images/temples/temple_pashupatinath.jpg'),
  temple_pashupatinath: require('../../assets/images/temples/temple_pashupatinath.jpg'),
};

export const STOTRA_IMAGES: Record<string, ImageSourcePropType> = {
  'shiva-panchakshara-stotram': require('../../assets/images/stotra/stotra_shiva_panchakshara.jpg'),
  shiva_panchakshara: require('../../assets/images/stotra/stotra_shiva_panchakshara.jpg'),
  stotra_shiva_panchakshara: require('../../assets/images/stotra/stotra_shiva_panchakshara.jpg'),
  'shiva-tandava-stotram': require('../../assets/images/stotra/stotra_shiva_tandava.jpg'),
  shiva_tandava: require('../../assets/images/stotra/stotra_shiva_tandava.jpg'),
  stotra_shiva_tandava: require('../../assets/images/stotra/stotra_shiva_tandava.jpg'),
  'shiva-mahimna-stotram': require('../../assets/images/stotra/stotra_shiva_mahimna.jpg'),
  shiva_mahimna: require('../../assets/images/stotra/stotra_shiva_mahimna.jpg'),
  stotra_shiva_mahimna: require('../../assets/images/stotra/stotra_shiva_mahimna.jpg'),
  rudrashtakam: require('../../assets/images/stotra/stotra_rudrashtakam.jpg'),
  stotra_rudrashtakam: require('../../assets/images/stotra/stotra_rudrashtakam.jpg'),
  'mahamrityunjaya-mantra': require('../../assets/images/stotra/stotra_mahamrityunjaya.jpg'),
  mahamrityunjaya: require('../../assets/images/stotra/stotra_mahamrityunjaya.jpg'),
  stotra_mahamrityunjaya: require('../../assets/images/stotra/stotra_mahamrityunjaya.jpg'),
  'daridrya-dahana-stotram': require('../../assets/images/stotra/stotra_daridrya_dahana.jpg'),
  daridrya_dahana: require('../../assets/images/stotra/stotra_daridrya_dahana.jpg'),
  stotra_daridrya_dahana: require('../../assets/images/stotra/stotra_daridrya_dahana.jpg'),
  lingashtakam: require('../../assets/images/stotra/stotra_lingashtakam.jpg'),
  stotra_lingashtakam: require('../../assets/images/stotra/stotra_lingashtakam.jpg'),
};

export const SYMBOL_IMAGES: Record<string, ImageSourcePropType> = {
  damru: require('../../assets/images/symbols/symbol_damru.jpg'),
  symbol_damru: require('../../assets/images/symbols/symbol_damru.jpg'),
  rudraksha: require('../../assets/images/symbols/symbol_rudraksha.jpg'),
  symbol_rudraksha: require('../../assets/images/symbols/symbol_rudraksha.jpg'),
  bhasma: require('../../assets/images/symbols/symbol_bhasma_tripundra.jpg'),
  tripundra: require('../../assets/images/symbols/symbol_bhasma_tripundra.jpg'),
  symbol_bhasma_tripundra: require('../../assets/images/symbols/symbol_bhasma_tripundra.jpg'),
  'third-eye': require('../../assets/images/symbols/symbol_trinetra.jpg'),
  third_eye: require('../../assets/images/symbols/symbol_trinetra.jpg'),
  trinetra: require('../../assets/images/symbols/symbol_trinetra.jpg'),
  symbol_trinetra: require('../../assets/images/symbols/symbol_trinetra.jpg'),
};

// Sansaar categories and wallpapers
export const SANSAAR_IMAGES: Record<string, ImageSourcePropType> = {
  stories: require('../../assets/images/sansaar/sansaar_shivaratri_aarti_beneath_the_himalayan_moon.jpg'),
  jyotirlinga: require('../../assets/images/sansaar/sansaar_sacred_shiva_mandala_amid_himalayan_temples.jpg'),
  'shakti-peeth': require('../../assets/images/sansaar/sansaar_radiant_devi_amid_sacred_temples.jpg'),
  family: require('../../assets/images/sansaar/sansaar_divine_himalayan_family_at_sunrise.jpg'),
  swaroop: require('../../assets/images/sansaar/sansaar_cosmic_shiva_dance_storm_and_serenity.jpg'),
  symbol: require('../../assets/images/sansaar/sansaar_shivas_himalayan_meditation_panorama.jpg'),
  temples: require('../../assets/images/sansaar/sansaar_himalayan_temple_at_golden_sunrise.jpg'),
  festivals: require('../../assets/images/sansaar/sansaar_moonlit_shiva_shrine_with_sacred_offerings.jpg'),
  stotra: require('../../assets/images/sansaar/sansaar_himalayan_shiva_altar_at_sunrise.jpg'),
  yatra: require('../../assets/images/sansaar/sansaar_golden_pilgrimage_to_the_mountain_shrine.jpg'),
};

// Reels background assets
export const REEL_IMAGES: ImageSourcePropType[] = [
  require('../../assets/images/reel/reel_alpine_shrine_at_golden_dawn.jpg'),
  require('../../assets/images/reel/reel_ash_sprinkled_shiva_linga_ritual.jpg'),
  require('../../assets/images/reel/reel_cinematic_shiva_shrine_with_lotus_offerings.jpg'),
  require('../../assets/images/reel/reel_cosmic_shiva_beneath_the_open_sky.jpg'),
  require('../../assets/images/reel/reel_cosmic_shiva_beneath_the_stars.jpg'),
  require('../../assets/images/reel/reel_crescent_moon_trident_shrine.jpg'),
  require('../../assets/images/reel/reel_ganga_aarti_at_dusk.jpg'),
  require('../../assets/images/reel/reel_himalayan_sunrise_with_sacred_trident.jpg'),
  require('../../assets/images/reel/reel_lord_shiva_beneath_the_himalayan_moon_reel_shiva_quote_01.jpg'),
  require('../../assets/images/reel/reel_meditating_at_the_himalayan_sunrise.jpg'),
  require('../../assets/images/reel/reel_mystical_damru_beneath_shivas_moonlit_silhouette.jpg'),
  require('../../assets/images/reel/reel_mystic_sadhu_beneath_moonlit_himalayas.jpg'),
  require('../../assets/images/reel/reel_pilgrimage_to_the_frozen_shrine.jpg'),
  require('../../assets/images/reel/reel_rudraksha_mala_at_a_shiva_shrine.jpg'),
  require('../../assets/images/reel/reel_sacred_abhisheka_at_the_shiva_shrine.jpg'),
  require('../../assets/images/reel/reel_shiva_and_parvati_beneath_the_himalayan_moon.jpg'),
  require('../../assets/images/reel/reel_shiva_nataraja_in_cosmic_fire.jpg'),
  require('../../assets/images/reel/reel_snowy_himalayan_temple_at_twilight.jpg'),
  require('../../assets/images/reel/reel_somnath_temple_at_sunset.jpg'),
  require('../../assets/images/reel/reel_twilight_temple_ghats_aglow.jpg'),
];

/**
 * Universal resolver function that accepts either:
 * - A require() asset number
 * - An ID string (e.g. 'kamakhya', 'somnath', 'sati-dahan')
 * - An asset key or filename
 * and ALWAYS returns a bundled local ImageSourcePropType (never remote web URLs).
 */
export const resolveImageSource = (
  sourceOrKey?: any,
  fallbackCategory: string = 'hero'
): ImageSourcePropType => {
  if (!sourceOrKey) {
    return FALLBACK_IMAGES[fallbackCategory] || FALLBACK_IMAGES.hero;
  }

  // Direct static require() asset number
  if (typeof sourceOrKey === 'number') {
    return sourceOrKey;
  }

  if (typeof sourceOrKey === 'string') {
    const key = sourceOrKey.trim();

    // Check dictionaries by exact key
    if (SHAKTI_PEETH_IMAGES[key]) return SHAKTI_PEETH_IMAGES[key];
    if (JYOTIRLINGA_IMAGES[key]) return JYOTIRLINGA_IMAGES[key];
    if (FAMILY_IMAGES[key]) return FAMILY_IMAGES[key];
    if (SWAROOP_IMAGES[key]) return SWAROOP_IMAGES[key];
    if (FESTIVAL_IMAGES[key]) return FESTIVAL_IMAGES[key];
    if (TEMPLE_IMAGES[key]) return TEMPLE_IMAGES[key];
    if (STOTRA_IMAGES[key]) return STOTRA_IMAGES[key];
    if (SYMBOL_IMAGES[key]) return SYMBOL_IMAGES[key];
    if (STORY_IMAGES[key]) return STORY_IMAGES[key];
    if (SANSAAR_IMAGES[key]) return SANSAAR_IMAGES[key];
    if (FALLBACK_IMAGES[key]) return FALLBACK_IMAGES[key];

    // Clean basename checks (e.g. "shakti_peeth_01_kamakhya.jpg" -> "kamakhya")
    const cleanKey = key.split('/').pop()?.replace(/\.(jpg|png|webp|jpeg)$/i, '') || key;
    if (SHAKTI_PEETH_IMAGES[cleanKey]) return SHAKTI_PEETH_IMAGES[cleanKey];
    if (JYOTIRLINGA_IMAGES[cleanKey]) return JYOTIRLINGA_IMAGES[cleanKey];
    if (FAMILY_IMAGES[cleanKey]) return FAMILY_IMAGES[cleanKey];
    if (SWAROOP_IMAGES[cleanKey]) return SWAROOP_IMAGES[cleanKey];
    if (FESTIVAL_IMAGES[cleanKey]) return FESTIVAL_IMAGES[cleanKey];
    if (TEMPLE_IMAGES[cleanKey]) return TEMPLE_IMAGES[cleanKey];
    if (STOTRA_IMAGES[cleanKey]) return STOTRA_IMAGES[cleanKey];
    if (SYMBOL_IMAGES[cleanKey]) return SYMBOL_IMAGES[cleanKey];
    if (STORY_IMAGES[cleanKey]) return STORY_IMAGES[cleanKey];
    if (SANSAAR_IMAGES[cleanKey]) return SANSAAR_IMAGES[cleanKey];
    if (FALLBACK_IMAGES[cleanKey]) return FALLBACK_IMAGES[cleanKey];
  }

  // Fallback to local generated domain fallback asset
  return FALLBACK_IMAGES[fallbackCategory] || FALLBACK_IMAGES.hero;
};

/**
 * Backwards compatibility helper functions
 */
export const getFallbackImage = (category: string): string => {
  return (FALLBACK_IMAGES[category] || FALLBACK_IMAGES.hero) as any;
};

export const getReelQuoteBackgrounds = () => {
  return REEL_IMAGES;
};

export const getJyotirlingaAssets = () => {
  return manifest.jyotirlingas;
};

export const getSansarCategoryAssets = () => {
  return manifest.sansar_categories;
};
