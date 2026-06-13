import { useState, useRef } from "react";
import NavBar from "../components/NavBar";
import SwipeableHero from "../components/SwipeableHero";
import EmptyMyDrinks from "../components/EmptyMyDrinks";
import { RECIPES, RECIPE_GROUPS } from "../data/recipes";
import { METHODS } from "../data/methods";
import { useJournal } from "../context/JournalContext";
import { CoffeeCupIcon } from "../components/Icons";

export default function HomeScreen({ navigate, s, t, units, favorites }) {
  const [activeTab, setActiveTab] = useState(favorites[0] || "Latte");
  const { drinks } = useJournal();

  const handleFavClick = (name) => {
    setActiveTab(name);
    const group = RECIPE_GROUPS.find(g => g.name === name);
    if (group) { navigate("VariantDetail", group); return; }
    const recipe = RECIPES.find(r => r.name === name);
    if (recipe) { navigate("RecipeDetail", recipe); return; }
  };

  // Espresso drinks combined for the hero
  const espressoItems = [...RECIPE_GROUPS, ...RECIPES]
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleEspressoClick = (item) => {
    if (RECIPE_GROUPS.find(g => g.id === item.id)) navigate("VariantDetail", item);
    else navigate("RecipeDetail", item);
  };

  // Methods are already shaped right
  const handleMethodClick = (item) => navigate("MethodDetail", item);

  // Custom drinks need image fallback — they don't have an img field
  const myDrinksItems = drinks.map(d => ({
    ...d,
    label: "Custom",
    img: null, // will be handled by fallback in SwipeableHero
  }));
  const handleMyDrinkClick = (item) => navigate("DrinkEntryDetail", item);

  return (
    <div>
      <div style={s.header}>
        <div style={{ ...s.logo, cursor: "pointer" }} onClick={() => navigate("Home")}>
          brew<em style={s.logoEm}>ly</em>
        </div>
        <div style={s.tagline}>Your back pocket barista.</div>
      </div>

      {/* Favorites */}
      <div style={s.section}>
        <div style={s.sectionRow}>
          <span style={s.sectionTitle}>Your Favorites</span>
          <span style={s.seeAll} onClick={() => navigate("EditFavorites")}>Edit →</span>
        </div>
        {favorites.length === 0 ? (
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 300, paddingBottom: 10 }}>
            No favorites yet — tap Edit to add some.
          </div>
        ) : (
          <div style={s.tabsScroll}>
            {favorites.map(f => (
              <div key={f} style={s.tab(activeTab === f)} onClick={() => handleFavClick(f)}>{f}</div>
            ))}
          </div>
        )}
      </div>

      {/* Espresso Drinks — Swipeable hero */}
      <div style={{ marginTop: 24 }}>
        <div style={{ ...s.sectionRow, padding: "0 26px 8px" }}>
          <span style={s.sectionTitle}>Espresso Drinks</span>
          <span style={s.seeAll} onClick={() => navigate("Recipes")}>All recipes →</span>
        </div>
        <SwipeableHero
          items={espressoItems}
          onItemClick={handleEspressoClick}
          t={t}
        />
      </div>

      {/* My Drinks — Swipeable hero or empty state */}
      <div style={{ marginTop: 24 }}>
        <div style={{ ...s.sectionRow, padding: "0 26px 8px" }}>
          <span style={s.sectionTitle}>My Drinks</span>
          {drinks.length > 0 && (
            <span style={s.seeAll} onClick={() => navigate("Recipes")}>View all →</span>
          )}
        </div>
        {drinks.length === 0 ? (
          <div style={{ padding: "0 26px" }}>
            <EmptyMyDrinks t={t} onCreateClick={() => navigate("Journal")} />
          </div>
        ) : (
          <CustomDrinksHero
            drinks={myDrinksItems}
            onItemClick={handleMyDrinkClick}
            t={t}
          />
        )}
      </div>

      {/* Brew Methods — Swipeable hero */}
      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <div style={{ ...s.sectionRow, padding: "0 26px 8px" }}>
          <span style={s.sectionTitle}>Brew Methods</span>
          <span style={s.seeAll} onClick={() => navigate("Methods")}>All methods →</span>
        </div>
        <SwipeableHero
          items={METHODS.map(m => ({ ...m, label: m.brewType }))}
          onItemClick={handleMethodClick}
          t={t}
        />
      </div>

      <NavBar current="Home" navigate={navigate} s={s} t={t} />
    </div>
  );
}

// Custom variant for My Drinks since they don't have photos yet
function CustomDrinksHero({ drinks, onItemClick, t }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStart = useRef(null);

  if (drinks.length === 0) return null;
  const active = drinks[activeIdx];

  const next = () => {
    if (drinks.length <= 1) return;
    setActiveIdx((activeIdx + 1) % drinks.length);
  };
  const prev = () => {
    if (drinks.length <= 1) return;
    setActiveIdx((activeIdx - 1 + drinks.length) % drinks.length);
  };

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
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

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => onItemClick(active)}
      style={{
        position: "relative",
        width: "100%",
        height: 180,
        background: t.bg3,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderTop: `2px dashed ${t.accent}88`,
        borderBottom: `2px dashed ${t.accent}88`,
      }}
    >
      <CoffeeCupIcon size={48} color={t.accent} />
      <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginTop: 12 }}>
        Custom
      </div>
      <div style={{
        fontFamily: "'Libre Baskerville', serif", fontStyle: "italic",
        fontSize: 22, color: t.text, marginTop: 4,
      }}>
        {active.name}
      </div>

      {drinks.length > 1 && (
        <div style={{
          position: "absolute", bottom: 14, right: 18,
          display: "flex", gap: 5,
        }}>
          {drinks.map((_, i) => (
            <div key={i} style={{
              height: 6,
              width: i === activeIdx ? 18 : 6,
              borderRadius: i === activeIdx ? 3 : "50%",
              background: i === activeIdx ? t.accent : t.border,
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}