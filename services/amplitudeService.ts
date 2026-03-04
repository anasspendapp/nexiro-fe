import * as amplitude from "@amplitude/analytics-browser";

const AMPLITUDE_API_KEY = "dfeee2612ae5f0e7c631ef60c6bf599";

let initialized = false;

export function initAmplitude(): void {
  if (initialized) return;
  initialized = true;
  amplitude.init(AMPLITUDE_API_KEY, { autocapture: true });
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
): void {
  amplitude.track(eventName, properties);
}

export function identifyUser(userId: string | number, email?: string): void {
  amplitude.setUserId(String(userId));
  if (email) {
    const identifyObj = new amplitude.Identify();
    identifyObj.set("email", email);
    amplitude.identify(identifyObj);
  }
}

export function resetAmplitudeUser(): void {
  amplitude.reset();
}
