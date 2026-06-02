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

  useEffect(() => {
    async function buscar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCarregando(false); return; }

      const { data } = await supabase
        .from("perfis")
        .select("id, nome, username, avatar_url, floripoints")
        .eq("id", user.id)
        .single();

      if (data) setPerfil(data);
      setCarregando(false);
    }
    buscar();

    // Atualiza se a sessão mudar (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => buscar());
    return () => subscription.unsubscribe();
  }, []);

  return { perfil, carregando };
}