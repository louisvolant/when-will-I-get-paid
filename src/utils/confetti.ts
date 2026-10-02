import confetti from 'canvas-confetti';

/**
 * Fires a celebratory confetti cannon for payday.
 */
export function firePaydayConfetti(): void {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.15, y: 0.6 },
      colors: ['#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#a855f7'],
    });

    // Right cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.85, y: 0.6 },
      colors: ['#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#a855f7'],
    });
  }, 250);
}
