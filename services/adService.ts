import { TELEGA_TOKEN, REWARDED_AD_BLOCK_ID } from '../constants';
import { TelegaAdsController } from '../types';

class AdService {
    private adsController: TelegaAdsController | null = null;
    private isInitialized = false;

    async initialize(): Promise<void> {
        if (this.isInitialized || !window.TelegaIn?.AdsController) {
            return;
        }

        try {
            this.adsController = await window.TelegaIn.AdsController.create_miniapp({
                token: TELEGA_TOKEN,
            });
            this.isInitialized = true;
            console.log("Telega Ads SDK Initialized");
        } catch (error) {
            console.error("Failed to initialize Telega Ads SDK:", error);
        }
    }

    async showRewardedAd(): Promise<boolean> {
        if (!this.isInitialized || !this.adsController) {
            console.warn("Ad SDK not initialized. Simulating success for development.");
            // Simulate a successful ad view for development/testing when SDK is not present
            return new Promise(resolve => setTimeout(() => resolve(true), 1000));
        }

        try {
            const result = await this.adsController.ad_show({
                adBlockUuid: REWARDED_AD_BLOCK_ID,
            });
            
            if (result && result.success) {
                console.log("Rewarded ad shown successfully.");
                return true;
            } else {
                console.warn("Rewarded ad failed to show or was skipped.");
                return false;
            }
        } catch (error) {
            console.error("Error showing rewarded ad:", error);
            return false;
        }
    }
}

export const adService = new AdService();
