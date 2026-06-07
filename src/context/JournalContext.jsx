import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "./AuthContext";

const JournalContext = createContext({});

export function JournalProvider({ children }) {
  const { user } = useAuth();
  const [drinks, setDrinks] = useState([]);
  const [espresso, setEspresso] = useState([]);
  const [grinders, setGrinders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all journal data when user logs in
  useEffect(() => {
    if (!user) {
      setDrinks([]);
      setEspresso([]);
      setGrinders([]);
      setLoading(false);
      return;
    }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadDrinks(), loadEspresso(), loadGrinders()]);
    setLoading(false);
  };

  const loadDrinks = async () => {
    const { data } = await supabase
      .from("journal_drinks")
      .select("*")
      .order("created_at", { ascending: false });
    setDrinks(data || []);
  };

  const loadEspresso = async () => {
    const { data } = await supabase
      .from("journal_espresso")
      .select("*")
      .order("created_at", { ascending: false });
    setEspresso(data || []);
  };

  const loadGrinders = async () => {
    const { data } = await supabase
      .from("grinders")
      .select("*")
      .order("created_at", { ascending: true });
    setGrinders(data || []);
  };

  // ─── DRINK ENTRIES ──────────────────────────────────────────────────────

  const addDrink = async (entry) => {
    const { data, error } = await supabase
      .from("journal_drinks")
      .insert({ ...entry, user_id: user.id })
      .select()
      .single();
    if (!error && data) setDrinks(prev => [data, ...prev]);
    return { data, error };
  };

  const updateDrink = async (id, updates) => {
    const { data, error } = await supabase
      .from("journal_drinks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) setDrinks(prev => prev.map(d => d.id === id ? data : d));
    return { data, error };
  };

  const deleteDrink = async (id) => {
    const { error } = await supabase.from("journal_drinks").delete().eq("id", id);
    if (!error) setDrinks(prev => prev.filter(d => d.id !== id));
    return { error };
  };

  // ─── ESPRESSO ENTRIES ───────────────────────────────────────────────────

  const addEspresso = async (entry) => {
    const { data, error } = await supabase
      .from("journal_espresso")
      .insert({ ...entry, user_id: user.id })
      .select()
      .single();
    if (!error && data) setEspresso(prev => [data, ...prev]);
    return { data, error };
  };

  const updateEspresso = async (id, updates) => {
    const { data, error } = await supabase
      .from("journal_espresso")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) setEspresso(prev => prev.map(e => e.id === id ? data : e));
    return { data, error };
  };

  const deleteEspresso = async (id) => {
    const { error } = await supabase.from("journal_espresso").delete().eq("id", id);
    if (!error) setEspresso(prev => prev.filter(e => e.id !== id));
    return { error };
  };

  // ─── GRINDERS ───────────────────────────────────────────────────────────

  const addGrinder = async (name, isDefault = false) => {
    if (isDefault) {
      // Unset existing default
      await supabase.from("grinders").update({ is_default: false }).eq("user_id", user.id);
    }
    const { data, error } = await supabase
      .from("grinders")
      .insert({ name, is_default: isDefault, user_id: user.id })
      .select()
      .single();
    if (!error && data) await loadGrinders();
    return { data, error };
  };

  const updateGrinder = async (id, updates) => {
    if (updates.is_default) {
      await supabase.from("grinders").update({ is_default: false }).eq("user_id", user.id);
    }
    const { data, error } = await supabase
      .from("grinders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) await loadGrinders();
    return { data, error };
  };

  const deleteGrinder = async (id) => {
    const { error } = await supabase.from("grinders").delete().eq("id", id);
    if (!error) setGrinders(prev => prev.filter(g => g.id !== id));
    return { error };
  };

  const defaultGrinder = grinders.find(g => g.is_default) || grinders[0] || null;

  return (
    <JournalContext.Provider value={{
      drinks, espresso, grinders, defaultGrinder, loading,
      addDrink, updateDrink, deleteDrink,
      addEspresso, updateEspresso, deleteEspresso,
      addGrinder, updateGrinder, deleteGrinder,
    }}>
      {children}
    </JournalContext.Provider>
  );
}

export const useJournal = () => useContext(JournalContext);