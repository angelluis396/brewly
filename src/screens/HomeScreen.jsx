import { useState } from "react";
import NavBar from "../components/NavBar";
import { RECIPES, RECIPE_GROUPS } from "../data/recipes";
import { METHODS } from "../data/methods";
import { useJournal } from "../context/JournalContext";
import CustomDrinkCard from "../components/CustomDrinkCard";
import EmptyMyDrinks from "../components/EmptyMyDrinks";

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

      {/* Espresso Drinks */}
      <div style={{ ...s.section, marginTop: 24 }}>
        <div style={s.sectionRow}>
          <span style={s.sectionTitle}>Espresso Drinks</span>
          <span style={s.seeAll} onClick={() => navigate("Recipes")}>All recipes →</span>
        </div>
        <div style={s.recipesScroll}>
          {[...RECIPE_GROUPS, ...RECIPES]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(item => (
              <div
                key={item.id || item.name}
                style={s.recipeCard}
                onClick={() => {
                  if (RECIPE_GROUPS.find(g => g.id === item.id)) navigate("VariantDetail", item);
                  else navigate("RecipeDetail", item);
                }}
              >
                <img style={s.recipeImg} src={item.img} alt={item.name} />
                <div style={s.recipeBody}>
                  <div style={s.recipeLabel}>{item.label}</div>
                  <div style={s.recipeName}>{item.name}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* My Drinks */}
      <div style={{ ...s.section, marginTop: 28 }}>
        <div style={s.sectionRow}>
          <span style={s.sectionTitle}>My Drinks</span>
          {drinks.length > 0 && (
            <span style={s.seeAll} onClick={() => navigate("Recipes")}>View all →</span>
          )}
        </div>
        {drinks.length === 0 ? (
          <EmptyMyDrinks
            t={t}
            onCreateClick={() => navigate("Journal")}
          />
        ) : drinks.length === 1 ? (
          <CustomDrinkCard
            drink={drinks[0]}
            t={t}
            variant="single"
            onClick={() => navigate("DrinkEntryDetail", drinks[0])}
          />
        ) : (
          <div style={s.recipesScroll}>
            {drinks.map(drink => (
              <CustomDrinkCard
                key={drink.id}
                drink={drink}
                t={t}
                variant="card"
                onClick={() => navigate("DrinkEntryDetail", drink)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Brew Methods */}
      <div style={{ ...s.section, marginTop: 28 }}>
        <div style={s.sectionRow}>
          <span style={s.sectionTitle}>Brew Methods</span>
          <span style={s.seeAll} onClick={() => navigate("Methods")}>All methods →</span>
        </div>
        <div style={s.recipesScroll}>
          {METHODS.map(m => (
            <div key={m.id} style={s.recipeCard} onClick={() => navigate("MethodDetail", m)}>
              <img style={s.recipeImg} src={m.img} alt={m.name} />
              <div style={s.recipeBody}>
                <div style={s.recipeLabel}>{m.brewType}</div>
                <div style={s.recipeName}>{m.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavBar current="Home" navigate={navigate} s={s} t={t} />
    </div>
  );
}