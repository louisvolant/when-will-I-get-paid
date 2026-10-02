/**
 * Detects if the current device is running iOS (iPhone, iPad, iPod) or iPadOS.
 */
export function isIosDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  const ua = navigator.userAgent || '';
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isIpadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIos || isIpadOs;
}

/**
 * Checks if the app is currently running in standalone (installed) mode.
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  // iOS Safari check
  // @ts-expect-error navigator.standalone exists on iOS Safari
  if (window.navigator.standalone === true) {
    return true;
  }
  // Standard display-mode check
  return window.matchMedia('(display-mode: standalone)').matches;
}
