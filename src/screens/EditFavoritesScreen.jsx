import { useState, useRef } from "react";
import { motion, Reorder, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import NavBar from "../components/NavBar";
import { RECIPES, RECIPE_GROUPS } from "../data/recipes";

const ALL_RECIPES = [
  ...RECIPE_GROUPS.map(g => ({ name: g.name, label: g.label, strength: g.strength, imgSm: g.imgSm, type: "group" })),
  ...RECIPES.map(r => ({ name: r.name, label: r.label, strength: r.strength, imgSm: r.imgSm, type: "recipe" })),
].sort((a, b) => a.name.localeCompare(b.name));

const DragHandle = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
  </svg>
);

const REVEAL_DISTANCE = 110;

function FavoriteItem({ item, onRemove, t, s, isLast }) {
  const x = useMotionValue(0);
  // Reactive opacity for the Remove button — fades in as user swipes
  const removeOpacity = useTransform(x, [-10, -50], [0, 1]);

  const startX = useRef(null);
  const startOffset = useRef(0); // x position at touch start

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startOffset.current = x.get();
  };

  const handleTouchMove = (e) => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const newX = startOffset.current + dx;
    // Clamp: never positive (can't drag past closed), never past max reveal
    x.set(Math.max(-REVEAL_DISTANCE * 1.5, Math.min(0, newX)));
  };

  const handleTouchEnd = () => {
    if (startX.current === null) return;
    const currentX = x.get();
    // If past 50% threshold, snap open. Otherwise snap closed.
    if (currentX < -REVEAL_DISTANCE / 2) {
      animate(x, -REVEAL_DISTANCE, { type: "spring", stiffness: 400, damping: 35 });
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 35 });
    }
    startX.current = null;
  };

  return (
    <Reorder.Item
      value={item}
      whileDrag={{
        scale: 1.02,
        boxShadow: `0 8px 24px ${t.text}22`,
        zIndex: 100,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      style={{
        position: "relative",
        listStyle: "none",
        background: t.bg,
        borderBottom: isLast ? "none" : `1px solid ${t.border}`,
      }}
    >
      {/* Background "Remove" button — only on the right */}
      <motion.div
        onClick={onRemove}
        style={{
          position: "absolute",
          top: 0, right: 0, bottom: 0,
          background: "#E24B4A", color: "#fff",
          padding: "0 22px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 500,
          cursor: "pointer",
          opacity: removeOpacity,
          minWidth: 100,
        }}
      >
        Remove
      </motion.div>

      {/* Main row content — translates with swipe */}
      <motion.div
        style={{
          x,
          background: t.bg,
          padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12,
          position: "relative",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img src={item.imgSm} alt={item.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...s.settingName, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
          <div style={s.settingDesc}>{item.label} · {item.strength}</div>
        </div>
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            padding: "6px 4px",
            cursor: "grab",
            touchAction: "none",
            display: "flex", alignItems: "center",
            flexShrink: 0,
            color: t.textMuted,
          }}
        >
          <DragHandle color={t.textMuted} />
        </div>
      </motion.div>
    </Reorder.Item>
  );
}

export default function EditFavoritesScreen({ navigate, s, t, favorites, setFavorites }) {
  const favoriteItems = favorites
    .map(name => ALL_RECIPES.find(r => r.name === name))
    .filter(Boolean);
  const nonFavoriteItems = ALL_RECIPES.filter(r => !favorites.includes(r.name));

  const handleReorder = (newOrder) => {
    setFavorites(newOrder.map(item => item.name));
  };

  const handleRemove = (name) => {
    setFavorites(prev => prev.filter(f => f !== name));
  };

  const handleAdd = (name) => {
    setFavorites(prev => [...prev, name]);
  };

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Home")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Home")}>Home</span>
        </div>
        <div style={s.pageTitle}>Edit Favorites</div>
        <div style={s.pageSub}>Tap to add. Drag to reorder. Swipe to remove.</div>
      </div>

      {favoriteItems.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Your Favorites</div>
          <div style={{
            background: t.bg2,
            border: `1px solid ${t.border}`,
            borderRadius: 14,
            overflow: "hidden",
          }}>
            <Reorder.Group
              axis="y"
              values={favoriteItems}
              onReorder={handleReorder}
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              <AnimatePresence>
                {favoriteItems.map((r, i) => (
                  <FavoriteItem
                    key={r.name}
                    item={r}
                    onRemove={() => handleRemove(r.name)}
                    t={t}
                    s={s}
                    isLast={i === favoriteItems.length - 1}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>
        </div>
      )}

      {nonFavoriteItems.length > 0 && (
        <div style={{ ...s.section, marginTop: favoriteItems.length > 0 ? 24 : 0 }}>
          <div style={s.sectionTitle}>{favoriteItems.length > 0 ? "More Drinks" : "All Drinks"}</div>
          <div style={s.settingGroup}>
            {nonFavoriteItems.map((r, i) => (
              <motion.div
                key={r.name}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                style={{ ...s.settingRow(i === nonFavoriteItems.length - 1), cursor: "pointer" }}
                onClick={() => handleAdd(r.name)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={r.imgSm} alt={r.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
                  <div>
                    <div style={s.settingName}>{r.name}</div>
                    <div style={s.settingDesc}>{r.label} · {r.strength}</div>
                  </div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: `2px solid ${t.border}`,
                  background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 16, color: t.textMuted,
                }}>
                  +
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <NavBar current="Home" navigate={navigate} s={s} t={t} />
    </div>
  );
}