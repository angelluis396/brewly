import { useState, useRef } from "react";
import NavBar from "../components/NavBar";
import { RECIPES, RECIPE_GROUPS } from "../data/recipes";

const ALL_RECIPES = [
  ...RECIPE_GROUPS.map(g => ({ name: g.name, label: g.label, strength: g.strength, imgSm: g.imgSm, type: "group" })),
  ...RECIPES.map(r => ({ name: r.name, label: r.label, strength: r.strength, imgSm: r.imgSm, type: "recipe" })),
].sort((a, b) => a.name.localeCompare(b.name));

// Drag handle SVG
const DragHandle = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="8" x2="21" y2="8" />
    <line x1="3" y1="16" x2="21" y2="16" />
  </svg>
);

export default function EditFavoritesScreen({ navigate, s, t, favorites, setFavorites }) {
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const touchStartY = useRef(null);
  const itemRefs = useRef({});

  const toggle = (name) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  // ─── Reorder logic ──────────────────────────────────────────────
  const reorderFavorites = (fromIdx, toIdx) => {
    if (fromIdx === toIdx) return;
    setFavorites(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return updated;
    });
  };

  // ─── Desktop HTML5 drag events ──────────────────────────────────
  const handleDragStart = (idx) => setDraggingIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (draggingIdx !== null) reorderFavorites(draggingIdx, idx);
    setDraggingIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => {
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  // ─── Mobile touch drag ──────────────────────────────────────────
  const handleTouchStart = (e, idx) => {
    touchStartY.current = e.touches[0].clientY;
    setDraggingIdx(idx);
  };
  const handleTouchMove = (e) => {
    if (draggingIdx === null) return;
    e.preventDefault();
    const touchY = e.touches[0].clientY;

    // Find which item we're hovering over by checking each item's bounding box
    let foundIdx = null;
    Object.entries(itemRefs.current).forEach(([idx, el]) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (touchY >= rect.top && touchY <= rect.bottom) {
        foundIdx = Number(idx);
      }
    });
    if (foundIdx !== null && foundIdx !== dragOverIdx) {
      setDragOverIdx(foundIdx);
    }
  };
  const handleTouchEnd = () => {
    if (draggingIdx !== null && dragOverIdx !== null) {
      reorderFavorites(draggingIdx, dragOverIdx);
    }
    setDraggingIdx(null);
    setDragOverIdx(null);
    touchStartY.current = null;
  };

  // Favorites list (in order) and non-favorites (alphabetical)
  const favoriteItems = favorites
    .map(name => ALL_RECIPES.find(r => r.name === name))
    .filter(Boolean);
  const nonFavoriteItems = ALL_RECIPES.filter(r => !favorites.includes(r.name));

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Home")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Home")}>Home</span>
        </div>
        <div style={s.pageTitle}>Edit Favorites</div>
        <div style={s.pageSub}>Tap to add or remove. Drag the handle to reorder.</div>
      </div>

      {/* Favorites section — draggable */}
      {favoriteItems.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Your Favorites </div>
          <div style={s.settingGroup}>
            {favoriteItems.map((r, i) => {
              const isLast = i === favoriteItems.length - 1;
              const isDragging = draggingIdx === i;
              const isDragOver = dragOverIdx === i && draggingIdx !== i;

              return (
                <div
                  key={r.name}
                  ref={el => (itemRefs.current[i] = el)}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...s.settingRow(isLast),
                    cursor: "pointer",
                    background: isDragging ? t.bg3 : isDragOver ? `${t.accent}22` : "transparent",
                    opacity: isDragging ? 0.5 : 1,
                    borderTop: isDragOver && draggingIdx > i ? `2px solid ${t.accent}` : undefined,
                    borderBottom: isDragOver && draggingIdx < i ? `2px solid ${t.accent}` : undefined,
                    transition: "background 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    {/* Drag handle — only this triggers the drag */}
                    <div
                      onTouchStart={(e) => { e.stopPropagation(); handleTouchStart(e, i); }}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{
                        cursor: "grab",
                        padding: "6px 4px",
                        marginLeft: -4,
                        display: "flex",
                        alignItems: "center",
                        touchAction: "none",
                      }}
                    >
                      <DragHandle color={t.textMuted} />
                    </div>
                    <img src={r.imgSm} alt={r.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
                    <div style={{ cursor: "pointer", flex: 1 }} onClick={() => toggle(r.name)}>
                      <div style={s.settingName}>{r.name}</div>
                      <div style={s.settingDesc}>{r.label} · {r.strength}</div>
                    </div>
                  </div>
                  <div
                    onClick={() => toggle(r.name)}
                    style={{
                      width: 24, height: 24, borderRadius: "50%",
                      border: `2px solid ${t.accent}`,
                      background: t.accent,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#111009", flexShrink: 0, cursor: "pointer",
                    }}
                  >
                    ✓
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-favorites section — tap to add */}
      <div style={{ ...s.section, marginTop: favoriteItems.length > 0 ? 24 : 0 }}>
        <div style={s.sectionTitle}>{favoriteItems.length > 0 ? "More Drinks" : "All Drinks"}</div>
        <div style={s.settingGroup}>
          {nonFavoriteItems.map((r, i) => (
            <div
              key={r.name}
              style={{ ...s.settingRow(i === nonFavoriteItems.length - 1), cursor: "pointer" }}
              onClick={() => toggle(r.name)}
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
                fontSize: 12, color: "#111009", flexShrink: 0,
              }}>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavBar current="Home" navigate={navigate} s={s} t={t} />
    </div>
  );
}