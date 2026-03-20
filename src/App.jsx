import { useState, useEffect } from "react";
import { darkTheme, lightTheme, makeStyles } from "./theme/theme";
import HomeScreen from "./screens/HomeScreen";
import RecipesScreen from "./screens/RecipesScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import MethodsScreen from "./screens/MethodsScreen";
import MethodDetailScreen from "./screens/MethodDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditFavoritesScreen from "./screens/EditFavoritesScreen";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; }
`;

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [screen, setScreen] = useState("Home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [units, setUnits] = useState("ml");
  const [defaultMethod, setDefaultMethod] = useState("Pour Over");
  const [favorites, setFavorites] = useState(["Latte", "Cortado", "Cold Brew", "Cappuccino", "Flat White"]);

  const t = isDark ? darkTheme : lightTheme;
  const s = makeStyles(t);

  const navigate = (dest, item = null) => {
    setScreen(dest);
    setSelectedItem(item);
    window.scrollTo(0, 0);
  };

  const sharedProps = { navigate, s, t, units };

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ background: t.bg, minHeight: "100vh", width: "100%" }}>
        <div style={s.app}>
          {screen === "Home"           && <HomeScreen         {...sharedProps} favorites={favorites} />}
          {screen === "Recipes"        && <RecipesScreen      {...sharedProps} />}
          {screen === "RecipeDetail"   && <RecipeDetailScreen  {...sharedProps} item={selectedItem} />}
          {screen === "Methods"        && <MethodsScreen      {...sharedProps} />}
          {screen === "MethodDetail"   && <MethodDetailScreen  {...sharedProps} item={selectedItem} />}
          {screen === "EditFavorites"  && <EditFavoritesScreen {...sharedProps} favorites={favorites} setFavorites={setFavorites} />}
          {screen === "Profile"        && (
            <ProfileScreen
              {...sharedProps}
              setUnits={setUnits}
              defaultMethod={defaultMethod}
              setDefaultMethod={setDefaultMethod}
              isDark={isDark}
              setIsDark={setIsDark}
            />
          )}
        </div>
      </div>
    </>
  );
}