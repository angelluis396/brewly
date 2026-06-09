import { useState } from "react";
import { darkTheme, lightTheme, makeStyles } from "./theme/theme";
import { useAuth } from "./context/AuthContext";
import { useSwipe } from "./hooks/useSwipe";
import HomeScreen from "./screens/HomeScreen";
import RecipesScreen from "./screens/RecipesScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import VariantDetailScreen from "./screens/VariantDetailScreen";
import MethodsScreen from "./screens/MethodsScreen";
import MethodDetailScreen from "./screens/MethodDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditFavoritesScreen from "./screens/EditFavoritesScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import JournalScreen from "./screens/JournalScreen";
import DrinkEntryForm from "./screens/DrinkEntryForm";
import EspressoEntryForm from "./screens/EspressoEntryForm";
import DrinkEntryDetailScreen from "./screens/DrinkEntryDetailScreen";
import EspressoEntryDetailScreen from "./screens/EspressoEntryDetailScreen";
import GrindersScreen from "./screens/GrindersScreen";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; }
`;

// Nav tab order for left/right swipe between tabs
const TAB_ORDER = ["Home", "Recipes", "Journal", "Methods", "Profile"];

// Map of detail / sub-screen → which screen to go back to on swipe right
const BACK_MAP = {
  RecipeDetail: "Recipes",
  VariantDetail: "Recipes",
  MethodDetail: "Methods",
  EditFavorites: "Home",
  Journal: null, // it's a top-level tab
  DrinkEntryForm: "Journal",
  EspressoEntryForm: "Journal",
  DrinkEntryDetail: "Journal",
  EspressoEntryDetail: "Journal",
  Grinders: "Profile",
};

export default function App() {
  const { user, loading, prefs, savePref } = useAuth();
  const [screen, setScreen] = useState("Home");
  const [selectedItem, setSelectedItem] = useState(null);

  const favorites = prefs.favorites;
  const units = prefs.units;
  const isDark = prefs.is_dark;
  const defaultMethod = prefs.default_method || "Pour Over";

  const setFavorites = (val) => savePref("favorites", typeof val === "function" ? val(favorites) : val);
  const setUnits = (val) => savePref("units", val);
  const setIsDark = (val) => savePref("is_dark", val);
  const setDefaultMethod = (val) => savePref("default_method", val);

  const t = isDark ? darkTheme : lightTheme;
  const s = makeStyles(t);

  const navigate = (dest, item = null) => {
    setScreen(dest);
    setSelectedItem(item);
    window.scrollTo(0, 0);
  };

  // ─── Swipe gestures ──────────────────────────────────────────────────
  // Right swipe from left edge → go back to parent screen
  // Left/right swipes (anywhere) when on a nav tab → switch tabs
  const isOnNavTab = TAB_ORDER.includes(screen);
  const currentTabIdx = TAB_ORDER.indexOf(screen);

  useSwipe({
    edgeOnly: !isOnNavTab, // edge-only when on a detail page; full-width when on a nav tab
    onSwipeRight: () => {
      if (isOnNavTab) {
        // Swipe right = previous tab
        if (currentTabIdx > 0) navigate(TAB_ORDER[currentTabIdx - 1]);
      } else {
        // Swipe right from edge = go back
        const back = BACK_MAP[screen];
        if (back) navigate(back);
      }
    },
    onSwipeLeft: () => {
      if (isOnNavTab && currentTabIdx < TAB_ORDER.length - 1) {
        navigate(TAB_ORDER[currentTabIdx + 1]);
      }
    },
  });

  if (loading) {
    return (
      <>
        <style>{FONTS}</style>
        <div style={{ background: lightTheme.bg, minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 36, fontStyle: "italic", color: lightTheme.accent }}>
            brewly
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    const authProps = { navigate, s, t };
    return (
      <>
        <style>{FONTS}</style>
        <div style={{ background: t.bg, minHeight: "100vh", width: "100%" }}>
          {(screen === "Login" || screen === "Home") && <LoginScreen {...authProps} />}
          {screen === "SignUp" && <SignUpScreen {...authProps} />}
        </div>
      </>
    );
  }

  const sharedProps = { navigate, s, t, units };

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ background: t.bg, minHeight: "100vh", width: "100%" }}>
        <div style={s.app}>
          {screen === "Home"                 && <HomeScreen                 {...sharedProps} favorites={favorites} />}
          {screen === "Recipes"              && <RecipesScreen              {...sharedProps} />}
          {screen === "RecipeDetail"         && <RecipeDetailScreen         {...sharedProps} item={selectedItem} favorites={favorites} setFavorites={setFavorites} />}
          {screen === "VariantDetail"        && <VariantDetailScreen        {...sharedProps} group={selectedItem} favorites={favorites} setFavorites={setFavorites} />}
          {screen === "Methods"              && <MethodsScreen              {...sharedProps} />}
          {screen === "MethodDetail"         && <MethodDetailScreen         {...sharedProps} item={selectedItem} favorites={favorites} setFavorites={setFavorites} />}
          {screen === "EditFavorites"        && <EditFavoritesScreen        {...sharedProps} favorites={favorites} setFavorites={setFavorites} />}
          {screen === "Journal"              && <JournalScreen              {...sharedProps} />}
          {screen === "DrinkEntryForm"       && <DrinkEntryForm             {...sharedProps} item={selectedItem} />}
          {screen === "EspressoEntryForm"    && <EspressoEntryForm          {...sharedProps} item={selectedItem} />}
          {screen === "DrinkEntryDetail"     && <DrinkEntryDetailScreen     {...sharedProps} item={selectedItem} />}
          {screen === "EspressoEntryDetail"  && <EspressoEntryDetailScreen  {...sharedProps} item={selectedItem} />}
          {screen === "Grinders"             && <GrindersScreen             {...sharedProps} />}
          {screen === "Profile"              && (
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