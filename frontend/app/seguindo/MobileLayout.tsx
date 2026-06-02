"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/asidebar";
import { MoreHorizontal, UserCheck, UserPlus } from "lucide-react";

type Perfil = {
  id: string;
  nome: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  floripoints: number;
};

type Aba = "seguindo" | "seguidores";

export default function MobileLayout() {
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");

  const [abaAtiva, setAbaAtiva] = useState<Aba>("seguindo");
  const [seguindo, setSeguindo] = useState<Perfil[]>([]);
  const [seguidores, setSeguidores] = useState<Perfil[]>([]);
  const [usuarioAtualId, setUsuarioAtualId] = useState<string | null>(null);
  const [seguindoIds, setSeguindoIds] = useState<Set<string>>(new Set());
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUsuarioAtualId(user.id);

      const alvoId = targetUserId || user.id;

      const { data: segData } = await supabase
        .from("seguidores")
        .select("seguido_id, perfis!seguidores_seguido_id_fkey(id, nome, username, avatar_url, bio, floripoints)")
        .eq("seguidor_id", alvoId);

      const { data: segdoresData } = await supabase
        .from("seguidores")
        .select("seguidor_id, perfis!seguidores_seguidor_id_fkey(id, nome, username, avatar_url, bio, floripoints)")
        .eq("seguido_id", alvoId);

      const { data: euSigo } = await supabase
        .from("seguidores")
        .select("seguido_id")
        .eq("seguidor_id", user.id);

      setSeguindo((segData?.map((s: any) => s.perfis).filter(Boolean) || []) as Perfil[]);
      setSeguidores((segdoresData?.map((s: any) => s.perfis).filter(Boolean) || []) as Perfil[]);
      setSeguindoIds(new Set(euSigo?.map((s: any) => s.seguido_id) || []));
      setCarregando(false);
    }
    init();
  }, [targetUserId]);

  async function toggleSeguir(perfilId: string) {
    if (!usuarioAtualId || perfilId === usuarioAtualId) return;

    if (seguindoIds.has(perfilId)) {
      await supabase.from("seguidores").delete()
        .eq("seguidor_id", usuarioAtualId).eq("seguido_id", perfilId);
      setSeguindoIds(prev => { const s = new Set(prev); s.delete(perfilId); return s; });
    } else {
      await supabase.from("seguidores").insert({ seguidor_id: usuarioAtualId, seguido_id: perfilId });
      setSeguindoIds(prev => new Set([...prev, perfilId]));
    }
  }

  const lista = abaAtiva === "seguindo" ? seguindo : seguidores;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-feed)" }}
    >
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-3 py-5">
          <h1
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--cor-primaria)" }}
          >
            Conexões
          </h1>

          {/* Abas */}
          <div
            className="flex mb-4"
            style={{ borderBottom: "1px solid var(--cor-borda)" }}
          >
            {(["seguindo", "seguidores"] as Aba[]).map((aba) => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                className="px-4 py-2.5 text-xs font-medium capitalize transition-all border-b-2 -mb-px"
                style={
                  abaAtiva === aba
                    ? { borderColor: "var(--cor-primaria)", color: "var(--cor-primaria)" }
                    : { borderColor: "transparent", color: "var(--cor-texto-suave)" }
                }
              >
                {aba === "seguindo"
                  ? `Seguindo (${seguindo.length})`
                  : `Seguidores (${seguidores.length})`}
              </button>
            ))}
          </div>

          {/* Loading */}
          {carregando && (
            <p className="text-center py-16 text-sm" style={{ color: "var(--cor-texto-suave)" }}>
              Carregando...
            </p>
          )}

          {/* Empty */}
          {!carregando && lista.length === 0 && (
            <p className="text-center py-16 text-sm" style={{ color: "var(--cor-texto-suave)" }}>
              {abaAtiva === "seguindo" ? "Ainda não segue ninguém." : "Nenhum seguidor ainda."}
            </p>
          )}

          {/* Lista */}
          <div className="flex flex-col gap-2">
            {lista.map((perfil) => (
              <div
                key={perfil.id}
                className="flex items-center gap-3 rounded-xl p-3 border relative"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--cor-borda)",
                }}
              >
                {/* Avatar */}
                <a href={`/perfil/${perfil.username}`} className="flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-full overflow-hidden"
                    style={{ backgroundColor: "color-mix(in srgb, var(--cor-primaria) 20%, transparent)" }}
                  >
                    {perfil.avatar_url ? (
                      <img src={perfil.avatar_url} alt={perfil.nome} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-bold text-base"
                        style={{ color: "var(--cor-primaria)" }}
                      >
                        {perfil.nome?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </a>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <a href={`/perfil/${perfil.username}`}>
                    <p
                      className="font-semibold text-sm truncate hover:underline"
                      style={{ color: "var(--cor-primaria)" }}
                    >
                      {perfil.nome}
                    </p>
                  </a>
                  <p className="text-xs" style={{ color: "var(--cor-texto-suave)" }}>
                    @{perfil.username}
                  </p>
                  {perfil.bio && (
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ color: "var(--cor-texto-suave)" }}
                    >
                      {perfil.bio}
                    </p>
                  )}
                </div>

                {/* Ações */}
                {perfil.id !== usuarioAtualId && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleSeguir(perfil.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all"
                      style={
                        seguindoIds.has(perfil.id)
                          ? {
                              backgroundColor: "var(--bg-main)",
                              color: "var(--cor-primaria)",
                              borderColor: "var(--cor-primaria)",
                            }
                          : {
                              backgroundColor: "var(--cor-primaria)",
                              color: "var(--cor-branco)",
                              borderColor: "var(--cor-primaria)",
                            }
                      }
                    >
                      {seguindoIds.has(perfil.id) ? (
                        <><UserCheck className="w-3 h-3" /> Seguindo</>
                      ) : (
                        <><UserPlus className="w-3 h-3" /> Seguir</>
                      )}
                    </button>

                    {/* 3 pontinhos */}
                    <div className="relative">
                      <button
                        onClick={() => setMenuAberto(menuAberto === perfil.id ? null : perfil.id)}
                        className="p-1.5 rounded-full transition-colors"
                        style={{ color: "var(--cor-texto-suave)" }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuAberto === perfil.id && (
                        <div
                          className="absolute right-0 top-9 rounded-xl shadow-lg z-50 min-w-[170px] overflow-hidden"
                          style={{
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--cor-borda)",
                          }}
                        >
                          {[
                            { label: "Compartilhar", action: () => {} },
                            { label: "Copiar link", action: () => navigator.clipboard.writeText(window.location.origin + `/perfil/${perfil.username}`) },
                            { label: "Sobre essa conta", action: () => window.location.href = `/perfil/${perfil.username}` },
                            { label: "Denunciar", action: () => {}, danger: true },
                            { label: "Cancelar", action: () => setMenuAberto(null) },
                          ].map((item) => (
                            <button
                              key={item.label}
                              onClick={() => { item.action(); setMenuAberto(null); }}
                              className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                              style={
                                (item as any).danger
                                  ? { color: "#ef4444" }
                                  : { color: "var(--cor-texto)" }
                              }
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Sidebar paginaAtiva="seguindo" />

      {/* Fecha menu ao clicar fora */}
      {menuAberto && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuAberto(null)} />
      )}
    </div>
  );
}