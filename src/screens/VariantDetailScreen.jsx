import { useState } from "react";
import NavBar from "../components/NavBar";

export default function VariantDetailScreen({ group, navigate, s, t, units, favorites, setFavorites }) {
  const [selected, setSelected] = useState(group.variants[0].id);
  const variant = group.variants.find(v => v.id === selected);
  const yieldVal = units === "ml" ? `${variant.yield_ml}ml` : `${variant.yield_oz}oz`;
  const ingredients = units === "ml" ? variant.ingredients_ml : variant.ingredients_oz;

  // Favorite key is the group name (e.g. "Espresso", "Latte", "Freddo")
  const isFav = favorites.includes(group.name);
  const toggleFavorite = () => {
    setFavorites(prev =>
      prev.includes(group.name)
        ? prev.filter(f => f !== group.name)
        : [...prev, group.name]
    );
  };

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Recipes")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Recipes")}>Espresso Drinks</span>
        </div>
        <div style={s.heroRow}>
          <div style={s.heroImgWrap}>
            <img style={s.heroImg} src={group.imgSm} alt={group.name} />
          </div>
          <div style={s.heroText}>
            <div style={s.heroLabel}>{group.label} · {group.strength}</div>
            <div style={s.heroName}>{group.name}</div>
            <div style={s.heroTags}>
              {variant.tags.map(tag => <div key={tag} style={s.heroTag}>{tag}</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Variant selector */}
      <div style={{ padding: "20px 26px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${group.variants.length}, 1fr)`, gap: 8 }}>
          {group.variants.map(v => (
            <div
              key={v.id}
              onClick={() => setSelected(v.id)}
              style={{
                padding: "10px 0", borderRadius: 12, textAlign: "center",
                fontSize: 12, fontWeight: selected === v.id ? 500 : 400,
                cursor: "pointer",
                background: selected === v.id ? t.accent : t.bg2,
                color: selected === v.id ? "#111009" : t.textMuted,
                border: `1px solid ${selected === v.id ? t.accent : t.border}`,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {v.label}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: "16px 26px 0" }}>
        <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 300, lineHeight: 1.6 }}>
          {variant.description}
        </div>
      </div>

      {/* Stat strip */}
      <div style={s.statStrip}>
        {[
          [variant.time, "Time"],
          [yieldVal, "Yield"],
          [`${variant.shots}`, `Shot${variant.shots > 1 ? "s" : ""}`],
          [variant.temp, "Temp"],
        ].map(([val, label], i, arr) => (
          <div key={label} style={s.statItem(i === arr.length - 1)}>
            <div style={s.statVal}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Ingredients */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Ingredients</div>
        {ingredients.map(ing => (
          <div key={ing.name} style={s.ingredientRow}>
            <span style={s.ingredientName}>{ing.name}</span>
            <span style={s.ingredientAmt}>{ing.amount}</span>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Directions</div>
        <div style={s.steps}>
          {variant.steps.map((step, i) => (
            <div key={i} style={s.stepRow}>
              <div style={s.stepNumWrap}>
                <div style={s.stepNum}>{i + 1}</div>
                {i < variant.steps.length - 1 && <div style={s.stepLine} />}
              </div>
              <div style={{ ...s.stepBody, paddingBottom: i < variant.steps.length - 1 ? 16 : 0 }}>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Barista Tips</div>
        <div style={s.tipsCard}>
          <div style={s.tipsIcon}>💡</div>
          <div>
            <div style={s.tipsTitle}>Pro tip</div>
            <div style={s.tipsBody}>{variant.tip}</div>
          </div>
        </div>
      </div>

      <button onClick={toggleFavorite} style={{
        ...s.saveBtn,
        background: isFav ? "transparent" : s.saveBtn.background,
        border: isFav ? `1px solid ${t.accent}` : "none",
        color: isFav ? t.accent : "#111009",
      }}>
        {isFav ? "♥ \u00a0Saved to Favorites" : "♥ \u00a0Save to Favorites"}
      </button>

      <NavBar current="Recipes" navigate={navigate} s={s} t={t} />
    </div>
  );
}