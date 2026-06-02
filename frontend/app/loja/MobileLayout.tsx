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

export default function MobileLayout() {
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
        <div
            className="flex h-screen w-screen overflow-hidden"
            style={{ backgroundColor: "var(--bg-feed)" }}
        >
            <main className="flex-1 overflow-y-auto pb-20">
                <div className="px-3 py-5">

                    {/* Header com pontos */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" style={{ color: "var(--cor-primaria)" }} />
                            <h1 className="text-lg font-semibold" style={{ color: "var(--cor-primaria)" }}>
                                Loja FloriPoints
                            </h1>
                        </div>
                        <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: "var(--cor-primaria)", color: "var(--cor-branco)" }}
                        >
                            <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                            <span className="font-semibold text-xs">{floripoints.toLocaleString("pt-BR")} pts</span>
                        </div>
                    </div>

                    {/* Banner info */}
                    <div
                        className="rounded-xl p-3 mb-4 text-xs"
                        style={{
                            backgroundColor: "color-mix(in srgb, var(--cor-primaria) 10%, transparent)",
                            border: "1px solid color-mix(in srgb, var(--cor-primaria) 20%, transparent)",
                            color: "var(--cor-primaria)",
                        }}
                    >
                        💡 <strong>Como ganhar FloriPoints:</strong> Participe de eventos e publique uma ajuda semanal para ganhar <strong>300 pts</strong>.
                    </div>

                    {/* Toast */}
                    {mensagem && (
                        <div
                            className={`fixed top-4 left-3 right-3 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${mensagem.tipo === "ok" ? "bg-green-600 text-white" : "bg-red-500 text-white"
                                }`}
                        >
                            {mensagem.texto}
                        </div>
                    )}

                    {/* Filtros de tipo */}
                    <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-hide">
                        {(["todos", "moldura", "emoji", "badge"] as FiltroTipo[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFiltroTipo(f)}
                                className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                                style={
                                    filtroTipo === f
                                        ? {
                                            backgroundColor: "var(--cor-primaria)",
                                            color: "var(--cor-branco)",
                                            borderColor: "var(--cor-primaria)",
                                        }
                                        : {
                                            backgroundColor: "var(--bg-main)",
                                            color: "var(--cor-primaria)",
                                            borderColor: "var(--cor-borda)",
                                        }
                                }
                            >
                                {f === "todos" ? "Todos" : f === "moldura" ? "Molduras" : f === "emoji" ? "Emojis" : "Badges"}
                            </button>
                        ))}
                    </div>

                    {/* Filtros de raridade */}
                    <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                        {(["todos", "comum", "incomum", "raro", "lendario"] as FiltroRaridade[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFiltroRaridade(f)}
                                className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                                style={
                                    filtroRaridade === f
                                        ? {
                                            backgroundColor: "var(--cor-primaria)",
                                            color: "var(--cor-branco)",
                                            borderColor: "var(--cor-primaria)",
                                        }
                                        : {
                                            backgroundColor: "var(--bg-main)",
                                            color: "var(--cor-primaria)",
                                            borderColor: "var(--cor-borda)",
                                        }
                                }
                            >
                                {f === "todos" ? "Raridade" : raridadeLabel[f]}
                            </button>
                        ))}
                    </div>

                    {/* Grid de itens */}
                    {itensFiltrados.length === 0 ? (
                        <p className="text-center py-16 text-sm" style={{ color: "var(--cor-texto-suave)" }}>
                            Nenhum item encontrado.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {itensFiltrados.map((item) => {
                                const possuiItem = inventario.has(item.id);
                                const Icone = raridadeIcone[item.raridade];
                                return (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border p-3 flex flex-col gap-2 transition-all"
                                        style={{
                                            backgroundColor: "var(--bg-card)",
                                            borderColor: possuiItem
                                                ? "color-mix(in srgb, var(--cor-primaria) 40%, transparent)"
                                                : "var(--cor-borda)",
                                            opacity: possuiItem ? 0.85 : 1,
                                        }}
                                    >
                                        {/* Preview */}
                                        <div
                                            className="aspect-square rounded-lg flex items-center justify-center overflow-hidden"
                                            style={{ backgroundColor: "var(--bg-feed)" }}
                                        >
                                            {item.imagem_url ? (
                                                <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl">
                                                    {item.tipo === "emoji" ? item.nome.split(" ")[0] : item.tipo === "moldura" ? "🖼️" : "🏅"}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <p
                                                className="font-medium text-xs truncate"
                                                style={{ color: "var(--cor-texto)" }}
                                            >
                                                {item.nome}
                                            </p>
                                            <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full mt-1 font-medium ${raridadeCor[item.raridade]}`}>
                                                <Icone className="w-3 h-3" />
                                                {raridadeLabel[item.raridade]}
                                            </span>
                                        </div>

                                        {/* Botão */}
                                        {possuiItem ? (
                                            <div
                                                className="text-center text-xs font-medium py-1.5 rounded-lg"
                                                style={{
                                                    color: "var(--cor-primaria)",
                                                    backgroundColor: "color-mix(in srgb, var(--cor-primaria) 10%, transparent)",
                                                }}
                                            >
                                                ✓ No inventário
                                            </div>
                                        ) : item.apenas_evento_marca ? (
                                            <div className="text-center text-xs text-yellow-600 font-medium py-1.5 bg-yellow-50 rounded-lg">
                                                👑 Evento exclusivo
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => comprar(item)}
                                                disabled={comprando === item.id || floripoints < item.preco_pontos}
                                                className="w-full py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-60"
                                                style={
                                                    floripoints >= item.preco_pontos
                                                        ? {
                                                            backgroundColor: "var(--cor-primaria)",
                                                            color: "var(--cor-branco)",
                                                        }
                                                        : {
                                                            backgroundColor: "var(--cor-borda)",
                                                            color: "var(--cor-texto-suave)",
                                                            cursor: "not-allowed",
                                                        }
                                                }
                                            >
                                                {comprando === item.id ? (
                                                    "Comprando..."
                                                ) : (
                                                    <span className="flex items-center justify-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
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

            <Sidebar paginaAtiva="loja" />
        </div>
    );
}