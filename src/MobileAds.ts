import { Module } from './internal';
import { validateAdRequestConfiguration } from './validateAdRequestConfiguration';
import { version } from './version';
import { MobileAdsModuleInterface } from './types/MobileAdsModule.interface';
import { RequestConfiguration } from './types/RequestConfiguration';
import { App, Config } from './types/Module.interface';

const namespace = 'google_ads';

const nativeModuleName = [
  'RNGoogleAdsModule',
  'RNGoogleAdsInterstitialModule',
  'RNGoogleAdsRewardedModule',
];

type Event = {
  adUnitId: string;
  requestId: number;
};

class MobileAdsModule extends Module implements MobileAdsModuleInterface {
  constructor(app: App, config: Config) {
    super(app, config);

    this.emitter.addListener('google_ads_interstitial_event', (event: Event) => {
      this.emitter.emit(
        `google_ads_interstitial_event:${event.adUnitId}:${event.requestId}`,
        event,
      );
    });

    this.emitter.addListener('google_ads_rewarded_event', (event: Event) => {
      this.emitter.emit(`google_ads_rewarded_event:${event.adUnitId}:${event.requestId}`, event);
    });
  }

  initialize() {
    return this.native.initialize();
  }

  setRequestConfiguration(requestConfiguration: RequestConfiguration) {
    let config;
    try {
      config = validateAdRequestConfiguration(requestConfiguration);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`googleAds.setRequestConfiguration(*) ${e.message}`);
      }
    }

    return this.native.setRequestConfiguration(config);
  }
}

const MobileAdsInstance = new MobileAdsModule(
  { name: 'AppName' },
  {
    version,
    namespace,
    nativeModuleName,
    nativeEvents: ['google_ads_interstitial_event', 'google_ads_rewarded_event'],
  },
);

export const MobileAds = () => {
  return MobileAdsInstance;
};

export default MobileAds;