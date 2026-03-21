import { useState } from "react";
import NavBar from "../components/NavBar";
import { RECIPES, RECIPE_GROUPS, STRENGTH_ORDER } from "../data/recipes";

const FILTERS = ["All", "Mild", "Bold", "Extra Bold"];

export default function RecipesScreen({ navigate, s, t }) {
  const [filter, setFilter] = useState("All");

  // Combine groups and standalone recipes into one sorted list
  const allItems = [
    ...RECIPE_GROUPS.map(g => ({ ...g, isGroup: true })),
    ...RECIPES.map(r => ({ ...r, isGroup: false })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  const filtered = filter === "All"
    ? allItems
    : allItems.filter(item => item.strength === filter);

  const handleCardClick = (item) => {
    if (item.isGroup) navigate("VariantDetail", item);
    else navigate("RecipeDetail", item);
  };

  const totalCount = allItems.length;

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Home")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Home")}>Home</span>
        </div>
        <div style={s.pageTitle}>Espresso Drinks</div>
        <div style={s.pageSub}>{totalCount} drinks · find your perfect cup</div>
      </div>

      <div style={s.filterRow}>
        {FILTERS.map(f => (
          <div key={f} style={s.filterChip(filter === f)} onClick={() => setFilter(f)}>
            {f !== "All" && (
              <span style={{ marginRight: 6 }}>
                {"●".repeat(STRENGTH_ORDER[f])}{"○".repeat(3 - STRENGTH_ORDER[f])}
              </span>
            )}
            {f}
          </div>
        ))}
      </div>

      <div style={s.countRow}>Showing {filtered.length} drink{filtered.length !== 1 ? "s" : ""}</div>

      <div style={s.cards}>
        {filtered.map(item => (
          <div key={item.id} style={s.bigCard} onClick={() => handleCardClick(item)}>
            <div style={s.imgWrap}>
              <img style={s.bigCardImg} src={item.img} alt={item.name} />
              <div style={s.badge}>{item.strength}</div>
              {item.isGroup && (
                <div style={{
                  position: "absolute", bottom: 14, left: 14,
                  display: "flex", gap: 5,
                }}>
                  {item.variants.map(v => (
                    <div key={v.id} style={{
                      background: "rgba(0,0,0,0.55)",
                      borderRadius: 99, padding: "3px 8px",
                      fontSize: 9, color: "#F2EDE4", letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}>
                      {v.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={s.bigCardBody}>
              <div>
                <div style={s.bigCardLabel}>{item.label}</div>
                <div style={s.bigCardName}>{item.name}</div>
              </div>
              <div style={s.bigCardRight}>
                <div style={s.bigCardTime}>{item.time}</div>
                <div style={s.goBtn}>→</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NavBar current="Recipes" navigate={navigate} s={s} t={t} />
    </div>
  );
}