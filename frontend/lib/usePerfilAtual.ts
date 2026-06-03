"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type PerfilAtual = {
  id: string;
  nome: string;
  username: string;
  avatar_url: string | null;
  floripoints: number;
};

export function usePerfilAtual() {
  const [perfil, setPerfil] = useState<PerfilAtual | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function buscar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setPerfil(null); setCarregando(false); return; }

    const { data } = await supabase
      .from("perfis")
      .select("id, nome, username, avatar_url, floripoints")
      .eq("id", user.id)
      .maybeSingle();

    setPerfil(data ?? null);
    setCarregando(false);
  }

  useEffect(() => {
    buscar();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        buscar();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { perfil, carregando };
}