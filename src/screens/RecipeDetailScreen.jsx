import NavBar from "../components/NavBar";

export default function RecipeDetailScreen({ item, navigate, s, t, units }) {
  const ingredients = units === "ml" ? item.ingredients_ml : item.ingredients_oz;
  const yieldVal = units === "ml" ? `${item.yield_ml}ml` : `${item.yield_oz}oz`;

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Recipes")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Recipes")}>Espresso Drinks</span>
        </div>
        <div style={s.heroRow}>
          <div style={s.heroImgWrap}>
            <img style={s.heroImg} src={item.imgSm} alt={item.name} />
          </div>
          <div style={s.heroText}>
            <div style={s.heroLabel}>{item.label} · {item.strength}</div>
            <div style={s.heroName}>{item.name}</div>
            <div style={s.heroTags}>
              {item.tags.map(tag => <div key={tag} style={s.heroTag}>{tag}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div style={s.statStrip}>
        {[
          [item.time, "Time"],
          [yieldVal, "Yield"],
          [`${item.shots}`, `Shot${item.shots > 1 ? "s" : ""}`],
          [item.temp, "Temp"],
        ].map(([val, label], i, arr) => (
          <div key={label} style={s.statItem(i === arr.length - 1)}>
            <div style={s.statVal}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Ingredients</div>
        {ingredients.map(ing => (
          <div key={ing.name} style={s.ingredientRow}>
            <span style={s.ingredientName}>{ing.name}</span>
            <span style={s.ingredientAmt}>{ing.amount}</span>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Directions</div>
        <div style={s.steps}>
          {item.steps.map((step, i) => (
            <div key={i} style={s.stepRow}>
              <div style={s.stepNumWrap}>
                <div style={s.stepNum}>{i + 1}</div>
                {i < item.steps.length - 1 && <div style={s.stepLine} />}
              </div>
              <div style={{ ...s.stepBody, paddingBottom: i < item.steps.length - 1 ? 16 : 0 }}>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Barista Tips</div>
        <div style={s.tipsCard}>
          <div style={s.tipsIcon}>💡</div>
          <div>
            <div style={s.tipsTitle}>Pro tip</div>
            <div style={s.tipsBody}>{item.tip}</div>
          </div>
        </div>
      </div>

      <button style={s.saveBtn}>♥ &nbsp;Save to Favorites</button>
      <NavBar current="Recipes" navigate={navigate} s={s} t={t} />
    </div>
  );
}