"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PerfilPage() {
  const router = useRouter();

  useEffect(() => {
    async function carregar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: perfil } = await supabase
        .from("perfis")
        .select("username")
        .eq("id", user.id)
        .single();

      if (!perfil) {
        router.push("/");
        return;
      }

      router.replace(`/perfil/${perfil.username}`);
    }

    carregar();
  }, [router]);

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="w-10 h-10 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}