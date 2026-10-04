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
  hero: require('../../assets/images/fallbacks/fallback_hero_banner.webp'),
  jyotirlinga: require('../../assets/images/fallbacks/fallback_jyotirlinga.webp'),
  'shakti-peeth': require('../../assets/images/fallbacks/fallback_shakti_peeth.webp'),
  shakti_peeth: require('../../assets/images/fallbacks/fallback_shakti_peeth.webp'),
  story: require('../../assets/images/fallbacks/fallback_story.webp'),
  stotra: require('../../assets/images/fallbacks/fallback_stotra.webp'),
  temple: require('../../assets/images/fallbacks/fallback_temple.webp'),
  family: require('../../assets/images/fallbacks/fallback_family.webp'),
  swaroop: require('../../assets/images/fallbacks/fallback_swaroop.webp'),
  symbol: require('../../assets/images/fallbacks/fallback_symbol.webp'),
  book: require('../../assets/images/fallbacks/fallback_book.webp'),
  teaching: require('../../assets/images/fallbacks/fallback_teaching.webp'),
  reel: require('../../assets/images/fallbacks/fallback_reel_bg.webp'),
  india_map: require('../../assets/images/sansaar/india_map_bg.webp'),
};

export const INDIA_MAP_BG: ImageSourcePropType = require('../../assets/images/sansaar/india_map_bg.webp');

// Jyotirlingas (12 bundled local images)
export const JYOTIRLINGA_IMAGES: Record<string, ImageSourcePropType> = {
  somnath: require('../../assets/images/jyotirlinga/jyotirlinga_somnath.webp'),
  mallikarjuna: require('../../assets/images/jyotirlinga/jyotirlinga_mallikarjuna.webp'),
  mahakaleshwar: require('../../assets/images/jyotirlinga/jyotirlinga_mahakaleshwar.webp'),
  omkareshwar: require('../../assets/images/jyotirlinga/jyotirlinga_omkareshwar.webp'),
  kedarnath: require('../../assets/images/jyotirlinga/jyotirlinga_kedarnath.webp'),
  bhimashankar: require('../../assets/images/jyotirlinga/jyotirlinga_bhimashankar.webp'),
  'kashi-vishwanath': require('../../assets/images/jyotirlinga/jyotirlinga_kashi_vishwanath.webp'),
  kashi_vishwanath: require('../../assets/images/jyotirlinga/jyotirlinga_kashi_vishwanath.webp'),
  trimbakeshwar: require('../../assets/images/jyotirlinga/jyotirlinga_trimbakeshwar.webp'),
  vaidyanath: require('../../assets/images/jyotirlinga/jyotirlinga_vaidyanath.webp'),
  nageshwar: require('../../assets/images/jyotirlinga/jyotirlinga_nageshwar.webp'),
  rameshwaram: require('../../assets/images/jyotirlinga/jyotirlinga_rameshwaram.webp'),
  ramanathaswamy: require('../../assets/images/jyotirlinga/jyotirlinga_rameshwaram.webp'),
  ghushneshwar: require('../../assets/images/jyotirlinga/jyotirlinga_ghushneshwar.webp'),
  grishneshwar: require('../../assets/images/jyotirlinga/jyotirlinga_ghushneshwar.webp'),
};

// Shakti Peethas (20 bundled local images)
export const SHAKTI_PEETH_IMAGES: Record<string, ImageSourcePropType> = {
  kamakhya: require('../../assets/images/shakti_peeth/shakti_peeth_01_kamakhya.webp'),
  kalighat: require('../../assets/images/shakti_peeth/shakti_peeth_02_kalighat.webp'),
  tarapith: require('../../assets/images/shakti_peeth/shakti_peeth_03_tarapith.webp'),
  hinglaj: require('../../assets/images/shakti_peeth/shakti_peeth_04_hinglaj.webp'),
  jwalaji: require('../../assets/images/shakti_peeth/shakti_peeth_05_jwalaji.webp'),
  ambaji: require('../../assets/images/shakti_peeth/shakti_peeth_06_ambaji.webp'),
  vishalakshi: require('../../assets/images/shakti_peeth/shakti_peeth_07_vishalakshi.webp'),
  'naina-devi': require('../../assets/images/shakti_peeth/shakti_peeth_08_naina_devi.webp'),
  naina_devi: require('../../assets/images/shakti_peeth/shakti_peeth_08_naina_devi.webp'),
  'tripura-sundari': require('../../assets/images/shakti_peeth/shakti_peeth_09_tripura_sundari.webp'),
  tripura_sundari: require('../../assets/images/shakti_peeth/shakti_peeth_09_tripura_sundari.webp'),
  'sharada-peeth': require('../../assets/images/shakti_peeth/shakti_peeth_10_sharada.webp'),
  sharada: require('../../assets/images/shakti_peeth/shakti_peeth_10_sharada.webp'),
  'vaishno-devi': require('../../assets/images/shakti_peeth/shakti_peeth_11_vaishno_devi.webp'),
  vaishno_devi: require('../../assets/images/shakti_peeth/shakti_peeth_11_vaishno_devi.webp'),
  'alopi-prayag': require('../../assets/images/shakti_peeth/shakti_peeth_12_alopi_prayag.webp'),
  alopi_prayag: require('../../assets/images/shakti_peeth/shakti_peeth_12_alopi_prayag.webp'),
  vindhyavasini: require('../../assets/images/shakti_peeth/shakti_peeth_13_vindhyavasini.webp'),
  'baidyanath-jayadurga': require('../../assets/images/shakti_peeth/shakti_peeth_14_jayadurga.webp'),
  jayadurga: require('../../assets/images/shakti_peeth/shakti_peeth_14_jayadurga.webp'),
  'harsiddhi-ujjain': require('../../assets/images/shakti_peeth/shakti_peeth_15_harsiddhi.webp'),
  harsiddhi: require('../../assets/images/shakti_peeth/shakti_peeth_15_harsiddhi.webp'),
  chamundeshwari: require('../../assets/images/shakti_peeth/shakti_peeth_16_chamundeshwari.webp'),
  kankalitala: require('../../assets/images/shakti_peeth/shakti_peeth_17_kankalitala.webp'),
  attahasa: require('../../assets/images/shakti_peeth/shakti_peeth_18_attahasa.webp'),
  nalhati: require('../../assets/images/shakti_peeth/shakti_peeth_19_nalhati.webp'),
  bakreshwar: require('../../assets/images/shakti_peeth/shakti_peeth_20_bakreshwar.webp'),
};

export const STORY_IMAGES: Record<string, ImageSourcePropType> = {
  'sati-and-shiva': require('../../assets/images/story/story_shiva_and_sati_beneath_himalayan_skies.webp'),
  'shiva-and-parvati': require('../../assets/images/story/story_shiva_and_parvatis_himalayan_wedding.webp'),
  'samudra-manthan': require('../../assets/images/story/story_neelkanth_during_the_ocean_churning.webp'),
  'ganga-avataran': require('../../assets/images/story/story_divine_descent_of_the_ganga.webp'),
  'ganga-avtaran': require('../../assets/images/story/story_divine_descent_of_the_ganga.webp'),
  'sati-dahan': require('../../assets/images/story/story_satis_sacred_fire_ceremony.webp'),
  'shiv-parvati-vivah': require('../../assets/images/story/story_shiva_and_parvatis_himalayan_wedding.webp'),
  'neelkanth-samudra-manthan': require('../../assets/images/story/story_neelkanth_during_the_ocean_churning.webp'),
  
  story_divine_descent_of_the_ganga: require('../../assets/images/story/story_divine_descent_of_the_ganga.webp'),
  story_grand_royal_yajna_ceremony: require('../../assets/images/story/story_grand_royal_yajna_ceremony.webp'),
  story_himalayan_kings_celestial_vision: require('../../assets/images/story/story_himalayan_kings_celestial_vision.webp'),
  story_himalayan_meditation_beneath_shivas_vision: require('../../assets/images/story/story_himalayan_meditation_beneath_shivas_vision.webp'),
  story_neelkanth_during_the_ocean_churning: require('../../assets/images/story/story_neelkanth_during_the_ocean_churning.webp'),
  story_samudra_manthan_churning_the_cosmic_ocean: require('../../assets/images/story/story_samudra_manthan_churning_the_cosmic_ocean.webp'),
  story_satis_sacred_fire_ceremony: require('../../assets/images/story/story_satis_sacred_fire_ceremony.webp'),
  story_shiva_and_gangas_himalayan_descent: require('../../assets/images/story/story_shiva_and_gangas_himalayan_descent.webp'),
  story_shiva_and_parvati_in_divine_assembly: require('../../assets/images/story/story_shiva_and_parvati_in_divine_assembly.webp'),
  story_shiva_and_parvatis_divine_devotion: require('../../assets/images/story/story_shiva_and_parvatis_divine_devotion.webp'),
  story_shiva_and_parvatis_himalayan_wedding_agni: require('../../assets/images/story/story_shiva_and_parvatis_himalayan_wedding_agni.webp'),
  story_shiva_and_parvatis_himalayan_wedding: require('../../assets/images/story/story_shiva_and_parvatis_himalayan_wedding.webp'),
  story_shiva_and_sati_beneath_himalayan_skies: require('../../assets/images/story/story_shiva_and_sati_beneath_himalayan_skies.webp'),
  story_shiva_drinks_the_cosmic_poison: require('../../assets/images/story/story_shiva_drinks_the_cosmic_poison.webp'),
  story_shiva_receiving_the_heavenly_ganges: require('../../assets/images/story/story_shiva_receiving_the_heavenly_ganges.webp'),
  story_shivas_himalayan_wedding_procession: require('../../assets/images/story/story_shivas_himalayan_wedding_procession.webp'),
  story_shiva_summons_the_divine_warrior_army: require('../../assets/images/story/story_shiva_summons_the_divine_warrior_army.webp'),

  // Newly added story scenes & covers
  sati_and_shiva_scene_2: require('../../assets/images/story/sati_and_shiva_scene_2.webp'),
  sati_and_shiva_scene_6: require('../../assets/images/story/sati_and_shiva_scene_6.webp'),
  markandeya_raksha_cover: require('../../assets/images/story/markandeya_raksha_cover.webp'),
  'markandeya-raksha': require('../../assets/images/story/markandeya_raksha_cover.webp'),
  markandeya_raksha_scene_1: require('../../assets/images/story/markandeya_raksha_scene_1.webp'),
  markandeya_raksha_scene_2: require('../../assets/images/story/markandeya_raksha_scene_2.webp'),
  tripurantaka_story_cover: require('../../assets/images/story/tripurantaka_story_cover.webp'),
  'tripurantaka-story': require('../../assets/images/story/tripurantaka_story_cover.webp'),
  tripurantaka_story_scene_1: require('../../assets/images/story/tripurantaka_story_scene_1.webp'),
  tripurantaka_story_scene_2: require('../../assets/images/story/tripurantaka_story_scene_2.webp'),
  bhasmasura_and_mohini_cover: require('../../assets/images/story/bhasmasura_and_mohini_cover.webp'),
  'bhasmasura-and-mohini': require('../../assets/images/story/bhasmasura_and_mohini_cover.webp'),
  bhasmasura_and_mohini_scene_1: require('../../assets/images/story/bhasmasura_and_mohini_scene_1.webp'),
  bhasmasura_and_mohini_scene_2: require('../../assets/images/story/bhasmasura_and_mohini_scene_2.webp'),
  kiratarjuniya_story_cover: require('../../assets/images/story/kiratarjuniya_story_cover.webp'),
  'kiratarjuniya-story': require('../../assets/images/story/kiratarjuniya_story_cover.webp'),
  kiratarjuniya_story_scene_1: require('../../assets/images/story/kiratarjuniya_story_scene_1.webp'),
  kiratarjuniya_story_scene_2: require('../../assets/images/story/kiratarjuniya_story_scene_2.webp'),
};

export const FAMILY_IMAGES: Record<string, ImageSourcePropType> = {
  'ganesha-son': require('../../assets/images/family/family_ganesha.webp'),
  ganesha_son: require('../../assets/images/family/family_ganesha.webp'),
  ganesha: require('../../assets/images/family/family_ganesha.webp'),
  family_ganesha: require('../../assets/images/family/family_ganesha.webp'),
  'kartikeya-son': require('../../assets/images/family/family_kartikeya.webp'),
  kartikeya_son: require('../../assets/images/family/family_kartikeya.webp'),
  kartikeya: require('../../assets/images/family/family_kartikeya.webp'),
  family_kartikeya: require('../../assets/images/family/family_kartikeya.webp'),
  'nandi-devotee': require('../../assets/images/family/family_nandi.webp'),
  nandi_devotee: require('../../assets/images/family/family_nandi.webp'),
  nandi: require('../../assets/images/family/family_nandi.webp'),
  family_nandi: require('../../assets/images/family/family_nandi.webp'),
  'parvati-mother': require('../../assets/images/family/family_parvati.webp'),
  parvati_mother: require('../../assets/images/family/family_parvati.webp'),
  parvati: require('../../assets/images/family/family_parvati.webp'),
  family_parvati: require('../../assets/images/family/family_parvati.webp'),
};

export const SWAROOP_IMAGES: Record<string, ImageSourcePropType> = {
  panchanana: require('../../assets/images/swaroop/swaroop_panchanana.webp'),
  swaroop_panchanana: require('../../assets/images/swaroop/swaroop_panchanana.webp'),
  pashupati: require('../../assets/images/swaroop/swaroop_pashupati.webp'),
  swaroop_pashupati: require('../../assets/images/swaroop/swaroop_pashupati.webp'),
  ardhanarishvara: require('../../assets/images/swaroop/swaroop_ardhanarishvara.webp'),
  swaroop_ardhanarishvara: require('../../assets/images/swaroop/swaroop_ardhanarishvara.webp'),
  mahadev: require('../../assets/images/swaroop/swaroop_mahadev.webp'),
  swaroop_mahadev: require('../../assets/images/swaroop/swaroop_mahadev.webp'),
  mahakal: require('../../assets/images/swaroop/swaroop_mahakal.webp'),
  swaroop_mahakal: require('../../assets/images/swaroop/swaroop_mahakal.webp'),
  kalabhairava: require('../../assets/images/swaroop/swaroop_kalabhairava.webp'),
  swaroop_kalabhairava: require('../../assets/images/swaroop/swaroop_kalabhairava.webp'),
  nataraja: require('../../assets/images/swaroop/swaroop_nataraja.webp'),
  swaroop_nataraja: require('../../assets/images/swaroop/swaroop_nataraja.webp'),
  neelkanth: require('../../assets/images/swaroop/swaroop_neelkanth.webp'),
  swaroop_neelkanth: require('../../assets/images/swaroop/swaroop_neelkanth.webp'),
  dakshinamurthy: require('../../assets/images/swaroop/swaroop_dakshinamurthy.webp'),
  swaroop_dakshinamurthy: require('../../assets/images/swaroop/swaroop_dakshinamurthy.webp'),
};

export const FESTIVAL_IMAGES: Record<string, ImageSourcePropType> = {
  'pradosh-vrat': require('../../assets/images/festivals/festival_pradosh_vrat.webp'),
  pradosh_vrat: require('../../assets/images/festivals/festival_pradosh_vrat.webp'),
  festival_pradosh_vrat: require('../../assets/images/festivals/festival_pradosh_vrat.webp'),
  mahashivratri: require('../../assets/images/festivals/festival_mahashivratri.webp'),
  festival_mahashivratri: require('../../assets/images/festivals/festival_mahashivratri.webp'),
  'shravan-maas': require('../../assets/images/festivals/festival_shravan_maas.webp'),
  shravan_maas: require('../../assets/images/festivals/festival_shravan_maas.webp'),
  festival_shravan_maas: require('../../assets/images/festivals/festival_shravan_maas.webp'),
};

export const TEMPLE_IMAGES: Record<string, ImageSourcePropType> = {
  tungnath: require('../../assets/images/temples/temple_tungnath.webp'),
  temple_tungnath: require('../../assets/images/temples/temple_tungnath.webp'),
  amarnath: require('../../assets/images/temples/temple_amarnath.webp'),
  temple_amarnath: require('../../assets/images/temples/temple_amarnath.webp'),
  pashupatinath: require('../../assets/images/temples/temple_pashupatinath.webp'),
  temple_pashupatinath: require('../../assets/images/temples/temple_pashupatinath.webp'),
};

export const STOTRA_IMAGES: Record<string, ImageSourcePropType> = {
  'shiva-panchakshara-stotram': require('../../assets/images/stotra/stotra_shiva_panchakshara.webp'),
  shiva_panchakshara: require('../../assets/images/stotra/stotra_shiva_panchakshara.webp'),
  stotra_shiva_panchakshara: require('../../assets/images/stotra/stotra_shiva_panchakshara.webp'),
  'shiva-tandava-stotram': require('../../assets/images/stotra/stotra_shiva_tandava.webp'),
  shiva_tandava: require('../../assets/images/stotra/stotra_shiva_tandava.webp'),
  stotra_shiva_tandava: require('../../assets/images/stotra/stotra_shiva_tandava.webp'),
  'shiva-mahimna-stotram': require('../../assets/images/stotra/stotra_shiva_mahimna.webp'),
  shiva_mahimna: require('../../assets/images/stotra/stotra_shiva_mahimna.webp'),
  stotra_shiva_mahimna: require('../../assets/images/stotra/stotra_shiva_mahimna.webp'),
  rudrashtakam: require('../../assets/images/stotra/stotra_rudrashtakam.webp'),
  stotra_rudrashtakam: require('../../assets/images/stotra/stotra_rudrashtakam.webp'),
  'mahamrityunjaya-mantra': require('../../assets/images/stotra/stotra_mahamrityunjaya.webp'),
  mahamrityunjaya: require('../../assets/images/stotra/stotra_mahamrityunjaya.webp'),
  stotra_mahamrityunjaya: require('../../assets/images/stotra/stotra_mahamrityunjaya.webp'),
  'daridrya-dahana-stotram': require('../../assets/images/stotra/stotra_daridrya_dahana.webp'),
  daridrya_dahana: require('../../assets/images/stotra/stotra_daridrya_dahana.webp'),
  stotra_daridrya_dahana: require('../../assets/images/stotra/stotra_daridrya_dahana.webp'),
  lingashtakam: require('../../assets/images/stotra/stotra_lingashtakam.webp'),
  stotra_lingashtakam: require('../../assets/images/stotra/stotra_lingashtakam.webp'),
};

export const SYMBOL_IMAGES: Record<string, ImageSourcePropType> = {
  damru: require('../../assets/images/symbols/symbol_damru.webp'),
  symbol_damru: require('../../assets/images/symbols/symbol_damru.webp'),
  rudraksha: require('../../assets/images/symbols/symbol_rudraksha.webp'),
  symbol_rudraksha: require('../../assets/images/symbols/symbol_rudraksha.webp'),
  bhasma: require('../../assets/images/symbols/symbol_bhasma_tripundra.webp'),
  tripundra: require('../../assets/images/symbols/symbol_bhasma_tripundra.webp'),
  symbol_bhasma_tripundra: require('../../assets/images/symbols/symbol_bhasma_tripundra.webp'),
  'third-eye': require('../../assets/images/symbols/symbol_trinetra.webp'),
  third_eye: require('../../assets/images/symbols/symbol_trinetra.webp'),
  trinetra: require('../../assets/images/symbols/symbol_trinetra.webp'),
  symbol_trinetra: require('../../assets/images/symbols/symbol_trinetra.webp'),
  shivling: require('../../assets/images/symbols/symbol_shivling.webp'),
  symbol_shivling: require('../../assets/images/symbols/symbol_shivling.webp'),
  trishula: require('../../assets/images/symbols/symbol_trishula.webp'),
  symbol_trishula: require('../../assets/images/symbols/symbol_trishula.webp'),
  naga: require('../../assets/images/symbols/symbol_naga.webp'),
  symbol_naga: require('../../assets/images/symbols/symbol_naga.webp'),
  'crescent-moon': require('../../assets/images/symbols/symbol_crescent_moon.webp'),
  crescent_moon: require('../../assets/images/symbols/symbol_crescent_moon.webp'),
  symbol_crescent_moon: require('../../assets/images/symbols/symbol_crescent_moon.webp'),
};

// Sansaar categories and wallpapers
export const SANSAAR_IMAGES: Record<string, ImageSourcePropType> = {
  stories: require('../../assets/images/sansaar/sansaar_shivaratri_aarti_beneath_the_himalayan_moon.webp'),
  jyotirlinga: require('../../assets/images/sansaar/sansaar_sacred_shiva_mandala_amid_himalayan_temples.webp'),
  'shakti-peeth': require('../../assets/images/sansaar/sansaar_radiant_devi_amid_sacred_temples.webp'),
  family: require('../../assets/images/sansaar/sansaar_divine_himalayan_family_at_sunrise.webp'),
  swaroop: require('../../assets/images/sansaar/sansaar_cosmic_shiva_dance_storm_and_serenity.webp'),
  symbol: require('../../assets/images/sansaar/sansaar_shivas_himalayan_meditation_panorama.webp'),
  temples: require('../../assets/images/sansaar/sansaar_himalayan_temple_at_golden_sunrise.webp'),
  festivals: require('../../assets/images/sansaar/sansaar_moonlit_shiva_shrine_with_sacred_offerings.webp'),
  stotra: require('../../assets/images/sansaar/sansaar_himalayan_shiva_altar_at_sunrise.webp'),
  yatra: require('../../assets/images/sansaar/sansaar_golden_pilgrimage_to_the_mountain_shrine.webp'),
};

// Reels background assets
export const REEL_IMAGES: ImageSourcePropType[] = [
  require('../../assets/images/reel/reel_alpine_shrine_at_golden_dawn.webp'),
  require('../../assets/images/reel/reel_ash_sprinkled_shiva_linga_ritual.webp'),
  require('../../assets/images/reel/reel_cinematic_shiva_shrine_with_lotus_offerings.webp'),
  require('../../assets/images/reel/reel_cosmic_shiva_beneath_the_open_sky.webp'),
  require('../../assets/images/reel/reel_cosmic_shiva_beneath_the_stars.webp'),
  require('../../assets/images/reel/reel_crescent_moon_trident_shrine.webp'),
  require('../../assets/images/reel/reel_ganga_aarti_at_dusk.webp'),
  require('../../assets/images/reel/reel_himalayan_sunrise_with_sacred_trident.webp'),
  require('../../assets/images/reel/reel_lord_shiva_beneath_the_himalayan_moon_reel_shiva_quote_01.webp'),
  require('../../assets/images/reel/reel_meditating_at_the_himalayan_sunrise.webp'),
  require('../../assets/images/reel/reel_mystical_damru_beneath_shivas_moonlit_silhouette.webp'),
  require('../../assets/images/reel/reel_mystic_sadhu_beneath_moonlit_himalayas.webp'),
  require('../../assets/images/reel/reel_pilgrimage_to_the_frozen_shrine.webp'),
  require('../../assets/images/reel/reel_rudraksha_mala_at_a_shiva_shrine.webp'),
  require('../../assets/images/reel/reel_sacred_abhisheka_at_the_shiva_shrine.webp'),
  require('../../assets/images/reel/reel_shiva_and_parvati_beneath_the_himalayan_moon.webp'),
  require('../../assets/images/reel/reel_shiva_nataraja_in_cosmic_fire.webp'),
  require('../../assets/images/reel/reel_snowy_himalayan_temple_at_twilight.webp'),
  require('../../assets/images/reel/reel_somnath_temple_at_sunset.webp'),
  require('../../assets/images/reel/reel_twilight_temple_ghats_aglow.webp'),
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

    // Clean basename checks (e.g. "shakti_peeth_01_kamakhya.webp" -> "kamakhya")
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
