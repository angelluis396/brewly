import { useState, useRef } from "react";
import { darkTheme, lightTheme, makeStyles } from "./theme/theme";
import { useAuth } from "./context/AuthContext";
import PageTransition from "./components/Pagetransition";
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
  html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; overflow-x: hidden; }
`;

// Top-level nav tabs (left/right swipe between these)
const TAB_ORDER = ["Home", "Recipes", "Journal", "Methods", "Profile"];

// Parent screens for back-swipe
const BACK_MAP = {
  RecipeDetail: "Recipes",
  VariantDetail: "Recipes",
  MethodDetail: "Methods",
  EditFavorites: "Home",
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
  const [direction, setDirection] = useState("forward");
  const lastScreen = useRef("Home");

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

  // Determine if navigation is "forward" (deeper into app) or "back" (toward home)
  const isBackNavigation = (from, to) => {
    // If we're going from a detail page back to its parent
    if (BACK_MAP[from] === to) return true;
    // If we're switching tabs leftward in the order
    const fromIdx = TAB_ORDER.indexOf(from);
    const toIdx = TAB_ORDER.indexOf(to);
    if (fromIdx !== -1 && toIdx !== -1 && toIdx < fromIdx) return true;
    return false;
  };

  const navigate = (dest, item = null) => {
    const dir = isBackNavigation(lastScreen.current, dest) ? "back" : "forward";
    setDirection(dir);
    setScreen(dest);
    setSelectedItem(item);
    lastScreen.current = dest;
    window.scrollTo(0, 0);
  };

  // ─── Swipe handlers ──────────────────────────────────────────────────
  const isOnNavTab = TAB_ORDER.includes(screen);
  const currentTabIdx = TAB_ORDER.indexOf(screen);

  const handleSwipeBack = () => {
    const back = BACK_MAP[screen];
    if (back) navigate(back);
  };
  const handleSwipeRight = () => {
    if (currentTabIdx > 0) navigate(TAB_ORDER[currentTabIdx - 1]);
  };
  const handleSwipeLeft = () => {
    if (currentTabIdx < TAB_ORDER.length - 1) navigate(TAB_ORDER[currentTabIdx + 1]);
  };

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

  const renderScreen = () => {
    switch (screen) {
      case "Home":                return <HomeScreen                {...sharedProps} favorites={favorites} />;
      case "Recipes":             return <RecipesScreen             {...sharedProps} />;
      case "RecipeDetail":        return <RecipeDetailScreen        {...sharedProps} item={selectedItem} favorites={favorites} setFavorites={setFavorites} />;
      case "VariantDetail":       return <VariantDetailScreen       {...sharedProps} group={selectedItem} favorites={favorites} setFavorites={setFavorites} />;
      case "Methods":             return <MethodsScreen             {...sharedProps} />;
      case "MethodDetail":        return <MethodDetailScreen        {...sharedProps} item={selectedItem} favorites={favorites} setFavorites={setFavorites} />;
      case "EditFavorites":       return <EditFavoritesScreen       {...sharedProps} favorites={favorites} setFavorites={setFavorites} />;
      case "Journal":             return <JournalScreen             {...sharedProps} />;
      case "DrinkEntryForm":      return <DrinkEntryForm            {...sharedProps} item={selectedItem} />;
      case "EspressoEntryForm":   return <EspressoEntryForm         {...sharedProps} item={selectedItem} />;
      case "DrinkEntryDetail":    return <DrinkEntryDetailScreen    {...sharedProps} item={selectedItem} />;
      case "EspressoEntryDetail": return <EspressoEntryDetailScreen {...sharedProps} item={selectedItem} />;
      case "Grinders":            return <GrindersScreen            {...sharedProps} />;
      case "Profile":             return (
        <ProfileScreen
          {...sharedProps}
          setUnits={setUnits}
          defaultMethod={defaultMethod}
          setDefaultMethod={setDefaultMethod}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      );
      default: return null;
    }
  };

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ background: t.bg, minHeight: "100vh", width: "100%" }}>
        <PageTransition
          screenKey={screen}
          direction={direction}
          canSwipeBack={!isOnNavTab && !!BACK_MAP[screen]}
          canSwipeTabs={isOnNavTab}
          onSwipeBack={handleSwipeBack}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          bgColor={t.bg}
        >
          <div style={s.app}>
            {renderScreen()}
          </div>
        </PageTransition>
      </div>
    </>
  );
}