import { useState } from "react";
import NavBar from "../components/NavBar";
import { RECIPES, STRENGTH_ORDER } from "../data/recipes";

const FILTERS = ["All", "Mild", "Bold", "Extra Bold"];

export default function RecipesScreen({ navigate, s, t }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? RECIPES : RECIPES.filter(r => r.strength === filter);

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Home")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Home")}>Home</span>
        </div>
        <div style={s.pageTitle}>Espresso Drinks</div>
        <div style={s.pageSub}>{RECIPES.length} recipes · find your perfect cup</div>
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
        {filtered.map(r => (
          <div key={r.id} style={s.bigCard} onClick={() => navigate("RecipeDetail", r)}>
            <div style={s.imgWrap}>
              <img style={s.bigCardImg} src={r.img} alt={r.name} />
              <div style={s.badge}>{r.strength}</div>
            </div>
            <div style={s.bigCardBody}>
              <div>
                <div style={s.bigCardLabel}>{r.label}</div>
                <div style={s.bigCardName}>{r.name}</div>
              </div>
              <div style={s.bigCardRight}>
                <div style={s.bigCardTime}>{r.time}</div>
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