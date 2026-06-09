import { useEffect, useRef } from "react";

/**
 * useSwipe — handles swipe gestures globally on the window.
 *
 * Options:
 *  - onSwipeRight: called when user swipes right (back gesture)
 *  - onSwipeLeft: called when user swipes left (forward / next tab)
 *  - edgeOnly: if true, swipeRight only fires when started from left edge (iOS-style)
 *  - minDistance: minimum px to trigger swipe (default 60)
 *  - maxVerticalDrift: max vertical movement allowed (default 80)
 */
export function useSwipe({ onSwipeRight, onSwipeLeft, edgeOnly = false, minDistance = 60, maxVerticalDrift = 80 } = {}) {
  const touchStart = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    };

    const handleTouchEnd = (e) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = Math.abs(t.clientY - touchStart.current.y);
      const elapsed = Date.now() - touchStart.current.time;

      // Ignore slow swipes or ones with too much vertical movement
      if (elapsed > 500 || dy > maxVerticalDrift) {
        touchStart.current = null;
        return;
      }

      // Swipe right (back gesture)
      if (dx > minDistance) {
        if (edgeOnly && touchStart.current.x > 30) {
          touchStart.current = null;
          return;
        }
        if (onSwipeRight) onSwipeRight();
      }
      // Swipe left (forward)
      else if (dx < -minDistance) {
        if (onSwipeLeft) onSwipeLeft();
      }

      touchStart.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeRight, onSwipeLeft, edgeOnly, minDistance, maxVerticalDrift]);
}
