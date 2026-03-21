import { useState } from "react";
import NavBar from "../components/NavBar";
import { RECIPES } from "../data/recipes";
import { METHODS } from "../data/methods";



export default function HomeScreen({ navigate, s, t, favorites }) {
  const [activeTab, setActiveTab] = useState("Latte");

  const handleFavClick = (name) => {
    setActiveTab(name);
    const recipe = RECIPES.find(r => r.name === name);
    const method = METHODS.find(m => m.name === name);
    if (recipe) navigate("RecipeDetail", recipe);
    else if (method) navigate("MethodDetail", method);
  };

  return (
    <div>
      <div style={s.header}>
        <div style={s.logo}>brew<em style={s.logoEm}>ly</em></div>
        <div style={s.tagline}>The barista in your back pocket.</div>
      </div>

      <div style={s.section}>
        <div style={s.sectionRow}>
          <span style={s.sectionTitle}>Your Favorites</span>
          <span style={s.seeAll} onClick={() => navigate("EditFavorites")}>Edit →</span>
        </div>
        <div style={s.tabsScroll}>
          {favorites.map(f => (
            <div key={f} style={s.tab(activeTab === f)} onClick={() => handleFavClick(f)}>{f}</div>
          ))}
        </div>
      </div>

      <div style={{ ...s.section, marginTop: 24 }}>
        <div style={s.sectionRow}>
          <span style={s.sectionTitle}>Espresso Drinks</span>
          <span style={s.seeAll} onClick={() => navigate("Recipes")}>All recipes →</span>
        </div>
        <div style={s.recipesScroll}>
          {RECIPES.map(r => (
            <div key={r.id} style={s.recipeCard} onClick={() => navigate("RecipeDetail", r)}>
              <img style={s.recipeImg} src={r.img} alt={r.name} />
              <div style={s.recipeBody}>
                <div style={s.recipeLabel}>{r.label}</div>
                <div style={s.recipeName}>{r.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...s.section, marginTop: 28 }}>
        <div style={s.sectionRow}>
          <span style={s.sectionTitle}>Methods</span>
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