"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/asidebar";
import { ShoppingBag, Star, Sparkles, Crown, Package } from "lucide-react";

type Item = {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: "moldura" | "emoji" | "badge";
  raridade: "comum" | "incomum" | "raro" | "lendario";
  preco_pontos: number;
  imagem_url: string | null;
  apenas_evento_marca: boolean;
};

type FiltroTipo = "todos" | "moldura" | "emoji" | "badge";
type FiltroRaridade = "todos" | "comum" | "incomum" | "raro" | "lendario";

const raridadeCor: Record<string, string> = {
  comum: "text-[#6B6B6B] bg-[#F0F0F0]",
  incomum: "text-blue-600 bg-blue-50",
  raro: "text-purple-600 bg-purple-50",
  lendario: "text-yellow-600 bg-yellow-50",
};

const raridadeLabel: Record<string, string> = {
  comum: "Comum",
  incomum: "Incomum",
  raro: "Raro",
  lendario: "Lendário",
};

const raridadeIcone: Record<string, any> = {
  comum: Package,
  incomum: Star,
  raro: Sparkles,
  lendario: Crown,
};

export default function LojaDesktopLayout() {
  const [itens, setItens] = useState<Item[]>([]);
  const [inventario, setInventario] = useState<Set<string>>(new Set());
  const [floripoints, setFloripoints] = useState(0);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [filtroRaridade, setFiltroRaridade] = useState<FiltroRaridade>("todos");
  const [comprando, setComprando] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: "ok" | "erro" } | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUsuarioId(user.id);

      const [{ data: perfil }, { data: itensData }, { data: inv }] = await Promise.all([
        supabase.from("perfis").select("floripoints").eq("id", user.id).single(),
        supabase.from("loja_itens").select("*").order("preco_pontos"),
        supabase.from("inventario").select("item_id").eq("usuario_id", user.id),
      ]);

      setFloripoints(perfil?.floripoints || 0);
      setItens((itensData || []) as Item[]);
      setInventario(new Set(inv?.map((i: any) => i.item_id) || []));
    }
    init();
  }, []);

  async function comprar(item: Item) {
    if (!usuarioId) return;
    if (inventario.has(item.id)) return;
    if (item.apenas_evento_marca) {
      setMensagem({ texto: "Este item só é obtido em eventos de marcas parceiras!", tipo: "erro" });
      setTimeout(() => setMensagem(null), 3000);
      return;
    }
    if (floripoints < item.preco_pontos) {
      setMensagem({ texto: "FloriPoints insuficientes! Participe de eventos para ganhar mais.", tipo: "erro" });
      setTimeout(() => setMensagem(null), 3000);
      return;
    }

    setComprando(item.id);
    const novoPontos = floripoints - item.preco_pontos;

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("inventario").insert({ usuario_id: usuarioId, item_id: item.id }),
      supabase.from("perfis").update({ floripoints: novoPontos }).eq("id", usuarioId),
    ]);

    if (e1 || e2) {
      setMensagem({ texto: "Erro ao comprar. Tente novamente.", tipo: "erro" });
    } else {
      setFloripoints(novoPontos);
      setInventario(prev => new Set([...prev, item.id]));
      setMensagem({ texto: `"${item.nome}" adicionado ao inventário! 🎉`, tipo: "ok" });
    }
    setComprando(null);
    setTimeout(() => setMensagem(null), 3000);
  }

  const itensFiltrados = itens.filter((i) => {
    if (filtroTipo !== "todos" && i.tipo !== filtroTipo) return false;
    if (filtroRaridade !== "todos" && i.raridade !== filtroRaridade) return false;
    return true;
  });

  return (
    <div className="flex h-screen w-screen bg-[#FFF5E7] overflow-hidden">
      <Sidebar paginaAtiva="loja" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Header com pontos */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-[#3C5E45]" />
              <h1 className="text-[#3C5E45] text-2xl font-semibold">Loja FloriPoints</h1>
            </div>
            <div className="flex items-center gap-2 bg-[#3C5E45] text-white px-5 py-2.5 rounded-full">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span className="font-semibold">{floripoints.toLocaleString("pt-BR")} pts</span>
            </div>
          </div>

          {/* Banner info */}
          <div className="bg-[#3C5E45]/10 border border-[#3C5E45]/20 rounded-xl p-4 mb-6 text-sm text-[#3C5E45]">
            💡 <strong>Como ganhar FloriPoints:</strong> Participe de eventos na aba Eventos e ganhe pontos.
            Publique uma ajuda semanal para a comunidade e ganhe <strong>300 pts</strong> por semana.
          </div>

          {/* Toast */}
          {mensagem && (
            <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              mensagem.tipo === "ok" ? "bg-[#3C5E45] text-white" : "bg-red-500 text-white"
            }`}>
              {mensagem.texto}
            </div>
          )}

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-2">
              {(["todos", "moldura", "emoji", "badge"] as FiltroTipo[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroTipo(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                    filtroTipo === f
                      ? "bg-[#3C5E45] text-white border-[#3C5E45]"
                      : "bg-white text-[#3C5E45] border-[#C8A97E] hover:border-[#3C5E45]"
                  }`}
                >
                  {f === "todos" ? "Todos" : f === "moldura" ? "Molduras" : f === "emoji" ? "Emojis" : "Badges"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["todos", "comum", "incomum", "raro", "lendario"] as FiltroRaridade[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroRaridade(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    filtroRaridade === f
                      ? "bg-[#3C5E45] text-white border-[#3C5E45]"
                      : "bg-white text-[#3C5E45] border-[#C8A97E] hover:border-[#3C5E45]"
                  }`}
                >
                  {f === "todos" ? "Raridade" : raridadeLabel[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de itens */}
          {itensFiltrados.length === 0 ? (
            <p className="text-center text-[#A89070] py-16">Nenhum item encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {itensFiltrados.map((item) => {
                const possuiItem = inventario.has(item.id);
                const Icone = raridadeIcone[item.raridade];
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border p-4 flex flex-col gap-3 transition-all ${
                      possuiItem ? "border-[#3C5E45]/40 opacity-80" : "border-[#E8D5C0] hover:border-[#3C5E45] hover:shadow-sm"
                    }`}
                  >
                    {/* Preview do item */}
                    <div className="aspect-square rounded-lg bg-[#FFF5E7] flex items-center justify-center overflow-hidden">
                      {item.imagem_url ? (
                        <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">
                          {item.tipo === "emoji" ? item.nome.split(" ")[0] : item.tipo === "moldura" ? "🖼️" : "🏅"}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-medium text-[#3C5E45] text-sm truncate">{item.nome}</p>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${raridadeCor[item.raridade]}`}>
                        <Icone className="w-3 h-3" />
                        {raridadeLabel[item.raridade]}
                      </span>
                    </div>

                    {/* Botão */}
                    {possuiItem ? (
                      <div className="text-center text-xs text-[#3C5E45] font-medium py-2 bg-[#3C5E45]/10 rounded-lg">
                        ✓ No inventário
                      </div>
                    ) : item.apenas_evento_marca ? (
                      <div className="text-center text-xs text-yellow-600 font-medium py-2 bg-yellow-50 rounded-lg">
                        👑 Evento exclusivo
                      </div>
                    ) : (
                      <button
                        onClick={() => comprar(item)}
                        disabled={comprando === item.id || floripoints < item.preco_pontos}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                          floripoints >= item.preco_pontos
                            ? "bg-[#3C5E45] text-white hover:bg-[#2e4a36]"
                            : "bg-[#E8D5C0] text-[#A89070] cursor-not-allowed"
                        } disabled:opacity-60`}
                      >
                        {comprando === item.id ? "Comprando..." : (
                          <span className="flex items-center justify-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                            {item.preco_pontos.toLocaleString("pt-BR")} pts
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}