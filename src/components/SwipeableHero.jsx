import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SwipeableHero — full-width hero card with swipe-to-navigate.
 *
 * Props:
 *  - items: array of { id, name, label, img } objects
 *  - onItemClick: (item) => void  — fired when user taps the hero
 *  - t: theme object
 *  - height: hero height (default 180)
 */
export default function SwipeableHero({ items, onItemClick, t, height = 180 }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const touchStart = useRef(null);
  const dragged = useRef(false);

  // Reset active index if items change and current index is out of range
  useEffect(() => {
    if (activeIdx >= items.length) setActiveIdx(0);
  }, [items.length, activeIdx]);

  if (!items || items.length === 0) return null;
  const active = items[activeIdx];

  const goToIdx = (idx, dir = 1) => {
    setDirection(dir);
    setActiveIdx(idx);
  };

  const next = () => {
    if (items.length <= 1) return;
    const nextIdx = (activeIdx + 1) % items.length;
    goToIdx(nextIdx, 1);
  };

  const prev = () => {
    if (items.length <= 1) return;
    const prevIdx = (activeIdx - 1 + items.length) % items.length;
    goToIdx(prevIdx, -1);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    dragged.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStart.current === null) return;
    const dx = e.touches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 8) dragged.current = true;
  };

  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  const handleClick = () => {
    if (dragged.current) return;
    onItemClick(active);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        cursor: "pointer",
        background: t.bg2,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={active.id || active.name}
          src={active.img}
          alt={active.name}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
          }}
        />
      </AnimatePresence>

      {/* Gradient + content overlay */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)",
        padding: "60px 18px 18px",
        color: "#fff",
        pointerEvents: "none",
      }}>
        {active.label && (
          <div style={{
            fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
          }}>
            {active.label}
          </div>
        )}
        <div style={{
          fontFamily: "'Libre Baskerville', serif",
          fontStyle: "italic", fontSize: 22, marginTop: 2,
        }}>
          {active.name}
        </div>
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div style={{
          position: "absolute",
          bottom: 14, right: 18,
          display: "flex", gap: 5,
          pointerEvents: "none",
        }}>
          {items.map((_, i) => (
            <div
              key={i}
              style={{
                height: 6,
                width: i === activeIdx ? 18 : 6,
                borderRadius: i === activeIdx ? 3 : "50%",
                background: i === activeIdx ? "#fff" : "rgba(255,255,255,0.4)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}