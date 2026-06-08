import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext({});

const DEFAULT_PREFS = {
  favorites: ["Latte", "Cortado", "Cold Brew", "Cappuccino", "Flat White"],
  units: "ml",
  is_dark: false,
  default_method: "Pour Over",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadPrefs(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadPrefs(session.user.id);
      else {
        setPrefs(DEFAULT_PREFS);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load prefs from Supabase
  const loadPrefs = async (userId) => {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      // First time user — insert default prefs
      await supabase.from("user_preferences").insert({ id: userId, ...DEFAULT_PREFS });
      setPrefs(DEFAULT_PREFS);
    } else {
      setPrefs({
        favorites: data.favorites || DEFAULT_PREFS.favorites,
        units: data.units || DEFAULT_PREFS.units,
        is_dark: data.is_dark ?? DEFAULT_PREFS.is_dark,
        default_method: data.default_method || DEFAULT_PREFS.default_method,
      });
    }
    setLoading(false);
  };

  // Save a single pref field to Supabase
  const savePref = async (key, value) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
    if (!user) return;
    await supabase
      .from("user_preferences")
      .update({ [key]: value })
      .eq("id", user.id);
  };

  // Sign up with email/password
  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { data, error };
  };

  // Sign in with email/password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    return { data, error };
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPrefs(DEFAULT_PREFS);
  };

  return (
    <AuthContext.Provider value={{ user, prefs, loading, savePref, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
