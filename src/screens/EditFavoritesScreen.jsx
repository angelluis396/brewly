import NavBar from "../components/NavBar";
import { RECIPES, RECIPE_GROUPS } from "../data/recipes";

const ALL_RECIPES = [
  ...RECIPE_GROUPS.map(g => ({ name: g.name, label: g.label, strength: g.strength, imgSm: g.imgSm, type: "group" })),
  ...RECIPES.map(r => ({ name: r.name, label: r.label, strength: r.strength, imgSm: r.imgSm, type: "recipe" })),
].sort((a, b) => a.name.localeCompare(b.name));

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
        <div style={s.sectionTitle}>Espresso Drinks</div>
        <div style={s.settingGroup}>
          {ALL_RECIPES.map((r, i) => {
            const active = favorites.includes(r.name);
            return (
              <div
                key={r.name}
                style={{ ...s.settingRow(i === ALL_RECIPES.length - 1), cursor: "pointer" }}
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