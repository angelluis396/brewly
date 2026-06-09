import { useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";

/**
 * PageTransition wraps each screen.
 *
 * Behavior:
 *  - When screenKey changes, the new page slides in based on `direction`:
 *      "forward" — new page slides in from right, current slides out left
 *      "back"    — new page slides in from left, current slides out right
 *  - When canSwipeBack is true (detail pages), dragging from the left edge
 *    moves the page horizontally with the finger and completes the back
 *    navigation if released past a threshold.
 *  - When canSwipeTabs is true (nav tabs), a horizontal swipe past 60px
 *    triggers onSwipeLeft / onSwipeRight (no follow-finger — pages just
 *    transition with the spring animation above).
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
  const isDraggingBack = useRef(false);
  const containerRef = useRef(null);

  // Reset x position whenever screenKey changes
  useEffect(() => {
    x.set(0);
  }, [screenKey]);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    startTouch.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    isDraggingBack.current = canSwipeBack && t.clientX <= 30;
  };

  const handleTouchMove = (e) => {
    if (!startTouch.current || !isDraggingBack.current) return;
    const t = e.touches[0];
    const dx = t.clientX - startTouch.current.x;
    if (dx > 0) x.set(dx);
  };

  const handleTouchEnd = (e) => {
    if (!startTouch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startTouch.current.x;
    const dy = Math.abs(t.clientY - startTouch.current.y);
    const elapsed = Date.now() - startTouch.current.time;
    const width = containerRef.current?.offsetWidth || window.innerWidth;

    // ── Back-from-edge gesture (follow-finger) ──
    if (isDraggingBack.current) {
      if (dx > width * 0.35 && onSwipeBack) {
        // Complete the back animation
        animate(x, width, {
          type: "spring",
          stiffness: 350,
          damping: 35,
          onComplete: () => {
            onSwipeBack();
          },
        });
      } else {
        // Snap back
        animate(x, 0, { type: "spring", stiffness: 400, damping: 38 });
      }
      isDraggingBack.current = false;
      startTouch.current = null;
      return;
    }

    // ── Tab swipe (no follow-finger, just trigger transition) ──
    if (canSwipeTabs && elapsed < 500 && dy < 80) {
      if (dx > 60 && onSwipeRight) onSwipeRight();
      else if (dx < -60 && onSwipeLeft) onSwipeLeft();
    }

    startTouch.current = null;
  };

  // Animation variants
  const variants = {
    enterForward: { x: "100%", opacity: 1 },
    enterBack: { x: "-25%", opacity: 0.7 },
    center: { x: 0, opacity: 1 },
    exitForward: { x: "-25%", opacity: 0.7 },
    exitBack: { x: "100%", opacity: 1 },
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        background: bgColor,
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={screenKey}
          initial={direction === "forward" ? "enterForward" : "enterBack"}
          animate="center"
          exit={direction === "forward" ? "exitForward" : "exitBack"}
          variants={variants}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          style={{
            x,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            minHeight: "100vh",
            background: bgColor,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}