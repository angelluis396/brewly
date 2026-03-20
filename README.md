# Brewly ☕

Your pocket barista — espresso recipes and brew method guides.

## Project Structure

```
src/
├── App.jsx                        # Root component, navigation, theme
├── data/
│   ├── recipes.js                 # All espresso drink data
│   └── methods.js                 # All brew method data
├── theme/
│   └── theme.js                   # Dark/light themes + makeStyles
├── components/
│   └── NavBar.jsx                 # Shared bottom nav bar
└── screens/
    ├── HomeScreen.jsx             # Home / dashboard
    ├── RecipesScreen.jsx          # Full recipe list with filter
    ├── RecipeDetailScreen.jsx     # Individual recipe detail
    ├── MethodsScreen.jsx          # Full methods list with filter
    ├── MethodDetailScreen.jsx     # Individual method detail
    └── ProfileScreen.jsx          # Preferences / settings
```

## Setup

```bash
npm create vite@latest brewly -- --template react
cd brewly
# Replace src/ with the files in this project
npm install
npm run dev
```

## Features

- 6 espresso drink recipes with ingredients, steps & barista tips
- 5 brew method guides with grind size visualizer, specs & steps
- Filter recipes by strength (Mild / Bold / Extra Bold)
- Filter methods by brew type (Pressure / Immersion / Percolation)
- Units toggle — ml or oz, updates all recipes & methods live
- Default brew method preference
- Dark / light mode follows system preference automatically
