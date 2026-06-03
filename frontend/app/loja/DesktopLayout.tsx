"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Asidebar from "@/components/asidebar";
import { supabase } from "@/lib/supabase";

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

type InventarioItem = {
  id: string;
  item_id: string;
  equipado: boolean;
};

const raridadeCor: Record<string, string> = {
  comum: "text-gray-400 border-gray-400",
  incomum: "text-green-400 border-green-400",
  raro: "text-blue-400 border-blue-400",
  lendario: "text-yellow-400 border-yellow-400",
};

const raridadeLabel: Record<string, string> = {
  comum: "Comum",
  incomum: "Incomum",
  raro: "Raro",
  lendario: "Lendário ✨",
};

// Preview visual de molduras por nome
const molduraEstilo: Record<string, string> = {
  "Moldura Arco-Íris": "bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 to-blue-400",
  "Moldura Praia": "bg-gradient-to-br from-yellow-300 to-blue-400",
  "Moldura Floripa": "bg-gradient-to-br from-green-400 to-emerald-700",
  "Moldura Lendária": "bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-500",
  "Moldura Dourada": "bg-gradient-to-br from-yellow-400 to-amber-600",
};

function ItemCard({
  item,
  noInventario,
  equipado,
  floripoints,
  onComprar,
  onEquipar,
}: {
  item: Item;
  noInventario: boolean;
  equipado: boolean;
  floripoints: number;
  onComprar: (item: Item) => void;
  onEquipar: (item: Item) => void;
}) {
  const podePagar = floripoints >= item.preco_pontos;

  const renderPreview = () => {
    if (item.tipo === "moldura") {
      const estilo = molduraEstilo[item.nome] ?? "bg-gradient-to-br from-purple-400 to-pink-400";
      return (
        <div className={`w-16 h-16 rounded-full ${estilo} p-1`}>
          <div className="w-full h-full rounded-full bg-[var(--bg-feed)] flex items-center justify-center text-2xl font-black text-[var(--cor-primaria)]">
            A
          </div>
        </div>
      );
    }
    if (item.tipo === "emoji") {
      return <span className="text-5xl">{item.nome.split(" ")[1] ?? "⭐"}</span>;
    }
    if (item.tipo === "badge") {
      return <span className="text-5xl">🏅</span>;
    }
    return <div className="w-16 h-16 bg-[var(--bg-card)] rounded-full" />;
  };

  return (
    <div className={`relative flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all
      ${equipado ? "border-[var(--cor-primaria)] bg-[var(--bg-card)]" : "border-[var(--cor-borda)] bg-[var(--bg-main)] hover:border-[var(--cor-primaria)]/50"}`}>

      {/* Badge raridade */}
      <span className={`absolute top-3 right-3 text-xs font-bold border rounded-full px-2 py-0.5 ${raridadeCor[item.raridade]}`}>
        {raridadeLabel[item.raridade]}
      </span>

      {/* Preview */}
      <div className="flex justify-center items-center h-24">
        {renderPreview()}
      </div>

      {/* Info */}
      <div>
        <p className="font-bold text-sm text-[var(--cor-texto)]">{item.nome}</p>
        {item.descricao && <p className="text-xs text-[var(--cor-texto-suave)] mt-0.5">{item.descricao}</p>}
        {item.apenas_evento_marca && (
          <p className="text-xs text-yellow-400 mt-1">🎪 Exclusivo de evento</p>
        )}
      </div>

      {/* Preço / ação */}
      <div className="mt-auto">
        {noInventario ? (
          <button
            onClick={() => onEquipar(item)}
            className={`w-full py-2 rounded-xl text-sm font-bold transition-all
              ${equipado
                ? "bg-[var(--cor-primaria)] text-white"
                : "border border-[var(--cor-primaria)] text-[var(--cor-primaria)] hover:bg-[var(--cor-primaria)] hover:text-white"
              }`}
          >
            {equipado ? "✓ Equipado" : "Equipar"}
          </button>
        ) : (
          <button
            onClick={() => onComprar(item)}
            disabled={!podePagar || item.apenas_evento_marca}
            className="w-full py-2 rounded-xl text-sm font-bold transition-all bg-[var(--cor-secundaria)] text-[var(--cor-branco)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {item.apenas_evento_marca ? "🔒 Exclusivo" : `🌿 ${item.preco_pontos} pts`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LojaDesktopLayout() {
  const [itens, setItens] = useState<Item[]>([]);
  const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const [floripoints, setFloripoints] = useState(0);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "moldura" | "emoji" | "badge">("todos");
  const [abaAtiva, setAbaAtiva] = useState<"loja" | "inventario">("loja");
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUsuarioId(user.id);

    const [itensRes, inventarioRes, perfilRes] = await Promise.all([
      supabase.from("loja_itens").select("*").order("preco_pontos"),
      supabase.from("inventario").select("*").eq("usuario_id", user.id),
      supabase.from("perfis").select("floripoints").eq("id", user.id).single(),
    ]);

    setItens(itensRes.data ?? []);
    setInventario(inventarioRes.data ?? []);
    setFloripoints(perfilRes.data?.floripoints ?? 0);
    setCarregando(false);
  };

  const mostrarToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const comprar = async (item: Item) => {
    if (!usuarioId || floripoints < item.preco_pontos) return;

    // Desconta pontos
    const novoPts = floripoints - item.preco_pontos;
    await supabase.from("perfis").update({ floripoints: novoPts }).eq("id", usuarioId);

    // Adiciona ao inventário
    const { data } = await supabase.from("inventario").insert({
      usuario_id: usuarioId,
      item_id: item.id,
      equipado: false,
    }).select().single();

    if (data) {
      setInventario((prev) => [...prev, data]);
      setFloripoints(novoPts);
      mostrarToast(`✅ ${item.nome} comprado!`);
    }
  };

  const equipar = async (item: Item) => {
    if (!usuarioId) return;

    const invItem = inventario.find((i) => i.item_id === item.id);
    if (!invItem) return;

    const jaEquipado = invItem.equipado;

    // Desequipa todos do mesmo tipo primeiro
    const mesmotipo = inventario.filter((i) => {
      const loja = itens.find((l) => l.id === i.item_id);
      return loja?.tipo === item.tipo && i.equipado;
    });

    for (const outro of mesmotipo) {
      await supabase.from("inventario").update({ equipado: false }).eq("id", outro.id);
    }

    // Equipa/desequipa o atual
    const novoEquipado = !jaEquipado;
    await supabase.from("inventario").update({ equipado: novoEquipado }).eq("id", invItem.id);

    // Atualiza moldura no perfil se for moldura
    if (item.tipo === "moldura") {
      await supabase.from("perfis").update({
        moldura_ativa: novoEquipado ? item.id : null,
      }).eq("id", usuarioId);
    }

    setInventario((prev) =>
      prev.map((i) => {
        if (mesmotipo.find((m) => m.id === i.id)) return { ...i, equipado: false };
        if (i.id === invItem.id) return { ...i, equipado: novoEquipado };
        return i;
      })
    );

    mostrarToast(novoEquipado ? `✨ ${item.nome} equipado!` : `${item.nome} desequipado.`);
  };

  const itensNoInventario = new Set(inventario.map((i) => i.item_id));
  const equipados = new Set(inventario.filter((i) => i.equipado).map((i) => i.item_id));

  const itensFiltrados = itens.filter((i) =>
    (filtroTipo === "todos" || i.tipo === filtroTipo) &&
    (abaAtiva === "loja" ? !itensNoInventario.has(i.id) : itensNoInventario.has(i.id))
  );

  return (
    <div className="flex bg-[var(--bg-sidebar)] w-screen h-screen overflow-hidden font-sans">
      <Asidebar />

      <div className="flex-1 bg-[var(--bg-feed)] overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-black text-2xl text-[var(--cor-texto)]">🛍️ Loja</h1>
              <p className="text-sm text-[var(--cor-texto-suave)] mt-1">Personalize seu perfil com FloriPoints</p>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--cor-borda)] rounded-xl px-4 py-2">
              <span className="text-lg">🌿</span>
              <span className="font-bold text-[var(--cor-primaria)]">{floripoints} pts</span>
            </div>
          </div>

          {/* Abas loja / inventário */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "loja", label: "🛍️ Loja" },
              { key: "inventario", label: "🎒 Inventário" },
            ].map((a) => (
              <button key={a.key} onClick={() => setAbaAtiva(a.key as "loja" | "inventario")}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border
                  ${abaAtiva === a.key
                    ? "bg-[var(--cor-primaria)] text-white border-transparent"
                    : "border-[var(--cor-borda)] text-[var(--cor-texto-suave)] hover:bg-[var(--bg-card)]"
                  }`}>
                {a.label}
              </button>
            ))}
          </div>

          {/* Filtros tipo */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "todos", label: "Todos" },
              { key: "moldura", label: "🔵 Molduras" },
              { key: "emoji", label: "⭐ Emojis" },
              { key: "badge", label: "🏅 Badges" },
            ].map((f) => (
              <button key={f.key} onClick={() => setFiltroTipo(f.key as typeof filtroTipo)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border
                  ${filtroTipo === f.key
                    ? "bg-[var(--cor-secundaria)] text-white border-transparent"
                    : "border-[var(--cor-borda)] text-[var(--cor-texto-suave)] hover:bg-[var(--bg-card)]"
                  }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid itens */}
          {carregando ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-[var(--cor-primaria)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : itensFiltrados.length === 0 ? (
            <p className="text-center text-[var(--cor-texto-suave)] py-20 text-sm">
              {abaAtiva === "inventario" ? "Seu inventário está vazio. Compre itens na loja! 🛍️" : "Nenhum item disponível nessa categoria."}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {itensFiltrados.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  noInventario={itensNoInventario.has(item.id)}
                  equipado={equipados.has(item.id)}
                  floripoints={floripoints}
                  onComprar={comprar}
                  onEquipar={equipar}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--cor-primaria)] text-white px-6 py-3 rounded-xl shadow-xl text-sm font-semibold z-50 animate-in fade-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}
    </div>
  );
}