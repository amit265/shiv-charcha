export type AdUnitSet = {
  appOpen: string;
  banner: string;
  interstitial: string;
  rewarded: string;
  native: string;
};

export type AdUnits = {
  android: AdUnitSet;
  ios: AdUnitSet;
};

export const PRODUCTION_AD_UNITS: AdUnits = {
  android: {
    appOpen: 'ca-app-pub-7433519007687449/7805110380',
    banner: 'ca-app-pub-7433519007687449/1071257633',
    interstitial: 'ca-app-pub-7433519007687449/9301101443',
    rewarded: 'ca-app-pub-7433519007687449/8758175965',
    native: 'ca-app-pub-7433519007687449/1115403942',
  },
  ios: {
    appOpen: 'ca-app-pub-3940256099942544/5662855259',
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
    native: 'ca-app-pub-3940256099942544/3986624511',
  },
};
