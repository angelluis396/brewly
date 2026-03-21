# Brewly ☕

> Your back pocket barista — espresso recipes, brew method guides, and everything in between.

---

## Screenshots

<!-- Add screenshots below. Recommended size: 390px wide -->

| Home | Espresso Drinks | Recipe Detail |
|------|----------------|---------------|
| _screenshot_ | _screenshot_ | _screenshot_ |

| Brew Methods | Method Detail | Profile |
|-------------|--------------|---------|
| _screenshot_ | _screenshot_ | _screenshot_ |

| Login | Sign Up | Edit Favorites |
|-------|---------|----------------|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## Project Structure

```
brewly/
├── public/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx          # Global auth state, sign in/out, prefs sync
│   ├── data/
│   │   ├── recipes.js               # Grouped + standalone espresso drink data
│   │   └── methods.js               # All brew method data
│   ├── theme/
│   │   └── theme.js                 # Dark/light themes + makeStyles
│   ├── components/
│   │   └── NavBar.jsx               # Shared sticky bottom nav
│   ├── screens/
│   │   ├── LoginScreen.jsx          # Email/password + Google sign in
│   │   ├── SignUpScreen.jsx         # New account creation
│   │   ├── HomeScreen.jsx           # Home / dashboard
│   │   ├── RecipesScreen.jsx        # Full recipe list with strength filter
│   │   ├── RecipeDetailScreen.jsx   # Individual recipe detail
│   │   ├── VariantDetailScreen.jsx  # Grouped recipe detail (Espresso, Latte, etc.)
│   │   ├── MethodsScreen.jsx        # Full methods list with brew type filter
│   │   ├── MethodDetailScreen.jsx   # Individual method detail
│   │   ├── EditFavoritesScreen.jsx  # Add/remove favorites
│   │   └── ProfileScreen.jsx        # User info, theme, units, sign out
│   ├── supabase.js                  # Supabase client (uses .env keys)
│   ├── App.jsx                      # Root component, navigation, auth gate
│   └── main.jsx                     # Entry point, wraps app in AuthProvider
├── .env                             # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
├── .gitignore                       # .env is excluded
├── index.html
├── package.json
└── vite.config.js
```

---

## Tech Stack

- **React** + **Vite** — frontend framework and build tool
- **Supabase** — authentication (email/password + Google OAuth) and database
- **Node.js 22+** — required by Vite

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/brewly.git
cd brewly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the following SQL in the Supabase SQL Editor:

```sql
create table user_preferences (
  id uuid references auth.users on delete cascade,
  favorites text[] default array['Latte','Cortado','Cold Brew','Cappuccino','Flat White'],
  units text default 'ml',
  is_dark boolean default false,
  primary key (id)
);

alter table user_preferences enable row level security;

create policy "Users can only access their own prefs"
  on user_preferences for all
  using (auth.uid() = id);
```

3. Enable Google OAuth under **Authentication → Providers → Google**
4. Grab your **Project URL** and **anon public key** from **Project Settings → API**

### 4. Add environment variables

Create a `.env` file in the root of the project:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run locally

```bash
npm run dev
```

App will be live at `http://localhost:5173`

---

## Deployment (Vercel)

---

## Features

- **User accounts** — email/password and Google sign in via Supabase
- **13 espresso drink recipes** — ingredients, steps & barista tips
- **Grouped drink variants** — Espresso (Single/Double/Ristretto/Lungo), Latte (Latte/Piccolo/Breve), Macchiato (Espresso/Latte), Freddo (Espresso/Cappuccino)
- **7 brew method guides** — grind size visualizer, specs & step-by-step directions
- **Filter recipes** by strength (Mild / Bold / Extra Bold)
- **Filter methods** by brew type (Pressure / Immersion / Percolation)
- **Favorites** — save and manage your go-to drinks, synced across devices
- **Units toggle** — ml or oz, updates all recipes & methods live
- **Dark / light mode** — manual toggle or follows system preference
- **Sticky nav bar** — always accessible while scrolling
- **Mobile optimized** — designed for iPhone, works great in browser too

