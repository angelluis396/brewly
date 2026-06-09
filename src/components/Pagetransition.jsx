import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

/**
 * PageTransition — defensive version with strict state guards.
 *
 * Key fixes:
 *  - Gestures are completely disabled while animating
 *  - Animation always resets the motion value cleanly
 *  - Active animations are cancelled before starting a new one
 *  - Touch state is always cleared on touchend, even if gesture didn't fire
 */
export default function PageTransition({
  screenKey,
  direction = "forward",
  canSwipeBack = false,
  canSwipeTabs = false,
  onSwipeBack,
  onSwipeLeft,
  onSwipeRight,
  bgColor = "transparent",
  children,
}) {
  const x = useMotionValue(0);
  const startTouch = useRef(null);
  const gestureType = useRef(null); // "back" | "tab" | null
  const isAnimating = useRef(false);
  const activeAnimation = useRef(null);
  const containerRef = useRef(null);

  const [renderedKey, setRenderedKey] = useState(screenKey);

  // Stop any active animation
  const cancelAnimation = () => {
    if (activeAnimation.current) {
      activeAnimation.current.stop();
      activeAnimation.current = null;
    }
  };

  // Run a spring animation safely
  const runAnimation = (target, onComplete) => {
    cancelAnimation();
    isAnimating.current = true;
    activeAnimation.current = animate(x, target, {
      type: "spring",
      stiffness: 320,
      damping: 35,
      onComplete: () => {
        isAnimating.current = false;
        activeAnimation.current = null;
        if (onComplete) onComplete();
      },
    });
  };

  // Slide new screen in when screenKey changes
  useEffect(() => {
    if (screenKey === renderedKey) return;

    cancelAnimation();
    const startX = direction === "forward" ? window.innerWidth : -window.innerWidth * 0.3;
    x.set(startX);
    setRenderedKey(screenKey);
    runAnimation(0);

    // Clear any lingering gesture state
    startTouch.current = null;
    gestureType.current = null;
  }, [screenKey, direction]);

  // ─── Touch handlers ─────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    // Block all gestures while animating
    if (isAnimating.current) {
      startTouch.current = null;
      gestureType.current = null;
      return;
    }

    const t = e.touches[0];
    startTouch.current = { x: t.clientX, y: t.clientY, time: Date.now() };

    // Determine what kind of gesture this could be
    if (canSwipeBack && t.clientX <= 30) {
      gestureType.current = "back";
    } else if (canSwipeTabs) {
      gestureType.current = "tab";
    } else {
      gestureType.current = null;
    }
  };

  const handleTouchMove = (e) => {
    if (!startTouch.current || gestureType.current !== "back") return;
    const t = e.touches[0];
    const dx = t.clientX - startTouch.current.x;
    if (dx > 0) x.set(dx);
  };

  const handleTouchEnd = (e) => {
    const start = startTouch.current;
    const gesture = gestureType.current;

    // Always clear gesture state immediately
    startTouch.current = null;
    gestureType.current = null;

    if (!start) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = Math.abs(t.clientY - start.y);
    const elapsed = Date.now() - start.time;
    const width = containerRef.current?.offsetWidth || window.innerWidth;

    // ── Back-from-edge gesture ──
    if (gesture === "back") {
      if (dx > width * 0.35 && onSwipeBack) {
        runAnimation(width, () => {
          x.set(0); // Reset for next page
          onSwipeBack();
        });
      } else {
        // Snap back to 0
        runAnimation(0);
      }
      return;
    }

    // ── Tab swipe ──
    if (gesture === "tab" && elapsed < 500 && dy < 80) {
      if (dx > 60 && onSwipeRight) onSwipeRight();
      else if (dx < -60 && onSwipeLeft) onSwipeLeft();
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        background: bgColor,
      }}
    >
      <motion.div
        style={{
          x,
          width: "100%",
          minHeight: "100vh",
          background: bgColor,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}