import { useState } from "react";
import NavBar from "../components/NavBar";
import { RECIPES } from "../data/recipes";
import { METHODS } from "../data/methods";

const ALL_ITEMS = [
  ...RECIPES.map(r => ({ name: r.name, type: "Recipe" })),
  ...METHODS.map(m => ({ name: m.name, type: "Method" })),
];

export default function EditFavoritesScreen({ navigate, s, t, favorites, setFavorites }) {
  const toggle = (name) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Home")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Home")}>Home</span>
        </div>
        <div style={s.pageTitle}>Edit Favorites</div>
        <div style={s.pageSub}>Tap to add or remove from your favorites.</div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Recipes</div>
        <div style={s.settingGroup}>
          {RECIPES.map((r, i) => {
            const active = favorites.includes(r.name);
            return (
              <div key={r.name} style={{ ...s.settingRow(i === RECIPES.length - 1), cursor: "pointer" }} onClick={() => toggle(r.name)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={r.imgSm} alt={r.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
                  <div>
                    <div style={s.settingName}>{r.name}</div>
                    <div style={s.settingDesc}>{r.label} · {r.strength}</div>
                  </div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: `2px solid ${active ? t.accent : t.border}`,
                  background: active ? t.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#111009", flexShrink: 0,
                }}>
                  {active ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...s.section, marginTop: 24 }}>
        <div style={s.sectionTitle}>Brew Methods</div>
        <div style={s.settingGroup}>
          {METHODS.map((m, i) => {
            const active = favorites.includes(m.name);
            return (
              <div key={m.name} style={{ ...s.settingRow(i === METHODS.length - 1), cursor: "pointer" }} onClick={() => toggle(m.name)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={m.imgSm} alt={m.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
                  <div>
                    <div style={s.settingName}>{m.name}</div>
                    <div style={s.settingDesc}>{m.brewType} · {m.time}</div>
                  </div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: `2px solid ${active ? t.accent : t.border}`,
                  background: active ? t.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#111009", flexShrink: 0,
                }}>
                  {active ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NavBar current="Home" navigate={navigate} s={s} t={t} />
    </div>
  );
}
