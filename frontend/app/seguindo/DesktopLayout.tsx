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

export default function SeguindoDesktopLayout() {
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId"); // perfil de outro usuário (opcional)

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

      // Quem o alvo segue
      const { data: segData } = await supabase
        .from("seguidores")
        .select("seguido_id, perfis!seguidores_seguido_id_fkey(id, nome, username, avatar_url, bio, floripoints)")
        .eq("seguidor_id", alvoId);

      // Quem segue o alvo
      const { data: segdoresData } = await supabase
        .from("seguidores")
        .select("seguidor_id, perfis!seguidores_seguidor_id_fkey(id, nome, username, avatar_url, bio, floripoints)")
        .eq("seguido_id", alvoId);

      // IDs que o usuário atual segue (para mostrar botão correto)
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
    <div className="flex h-screen w-screen bg-[#FFF5E7] overflow-hidden">
      <Sidebar paginaAtiva="seguindo" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-[#3C5E45] text-2xl font-semibold mb-6">Conexões</h1>

          {/* Abas */}
          <div className="flex border-b border-[#C8A97E] mb-6">
            {(["seguindo", "seguidores"] as Aba[]).map((aba) => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                  abaAtiva === aba
                    ? "border-[#3C5E45] text-[#3C5E45]"
                    : "border-transparent text-[#A89070] hover:text-[#3C5E45]"
                }`}
              >
                {aba === "seguindo" ? `Seguindo (${seguindo.length})` : `Seguidores (${seguidores.length})`}
              </button>
            ))}
          </div>

          {carregando && (
            <p className="text-center text-[#A89070] py-16">Carregando...</p>
          )}

          {!carregando && lista.length === 0 && (
            <p className="text-center text-[#A89070] py-16">
              {abaAtiva === "seguindo" ? "Ainda não segue ninguém." : "Nenhum seguidor ainda."}
            </p>
          )}

          <div className="flex flex-col gap-3">
            {lista.map((perfil) => (
              <div
                key={perfil.id}
                className="flex items-center gap-4 bg-white rounded-xl p-4 border border-[#E8D5C0] relative"
              >
                {/* Avatar */}
                <a href={`/perfil/${perfil.username}`} className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#3C5E45]/20 overflow-hidden">
                    {perfil.avatar_url ? (
                      <img src={perfil.avatar_url} alt={perfil.nome} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#3C5E45] font-bold text-lg">
                        {perfil.nome?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </a>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <a href={`/perfil/${perfil.username}`}>
                    <p className="font-semibold text-[#3C5E45] hover:underline truncate">{perfil.nome}</p>
                  </a>
                  <p className="text-sm text-[#A89070]">@{perfil.username}</p>
                  {perfil.bio && (
                    <p className="text-sm text-[#6B6B6B] truncate mt-0.5">{perfil.bio}</p>
                  )}
                </div>

                {/* Ações */}
                {perfil.id !== usuarioAtualId && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSeguir(perfil.id)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        seguindoIds.has(perfil.id)
                          ? "bg-white text-[#3C5E45] border-[#3C5E45] hover:bg-red-50 hover:text-red-500 hover:border-red-300"
                          : "bg-[#3C5E45] text-white border-[#3C5E45] hover:bg-[#2e4a36]"
                      }`}
                    >
                      {seguindoIds.has(perfil.id) ? (
                        <><UserCheck className="w-3.5 h-3.5" /> Seguindo</>
                      ) : (
                        <><UserPlus className="w-3.5 h-3.5" /> Seguir</>
                      )}
                    </button>

                    {/* 3 pontinhos */}
                    <div className="relative">
                      <button
                        onClick={() => setMenuAberto(menuAberto === perfil.id ? null : perfil.id)}
                        className="p-2 rounded-full hover:bg-[#F0E8DE] transition-colors text-[#A89070]"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuAberto === perfil.id && (
                        <div className="absolute right-0 top-10 bg-white border border-[#E8D5C0] rounded-xl shadow-lg z-50 min-w-[180px] overflow-hidden">
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
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-[#F0E8DE] transition-colors ${
                                (item as any).danger ? "text-red-500" : "text-[#3C5E45]"
                              }`}
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

      {/* Fecha menu ao clicar fora */}
      {menuAberto && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuAberto(null)} />
      )}
    </div>
  );
}