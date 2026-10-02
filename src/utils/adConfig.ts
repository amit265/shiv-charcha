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
    appOpen: 'ca-app-pub-7433519007687449/5354580599',
    banner: 'ca-app-pub-7433519007687449/9749121177',
    interstitial: 'ca-app-pub-7433519007687449/7028512503',
    rewarded: 'ca-app-pub-7433519007687449/5715430831',
    native: 'ca-app-pub-7433519007687449/5809876165',
  },
  ios: {
    appOpen: 'ca-app-pub-3940256099942544/5662855259',
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
    native: 'ca-app-pub-3940256099942544/3986624511',
  },
};
