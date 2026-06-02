"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useTema, Tema, temas } from "@/lib/ThemeContext";
import { supabase } from "@/lib/supabase";

const temaInfo: Record<Tema, { label: string; emoji: string }> = {
  floripa: { label: "Floripa", emoji: "🌿" },
  noturno: { label: "Noturno", emoji: "🌙" },
  oceano: { label: "Oceano", emoji: "🌊" },
  urbano: { label: "Urbano", emoji: "🏙️" },
};

type Props = {
  paginaAtiva?: string;
};

export default function Asidebar({ paginaAtiva }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { tema, setTema } = useTema();
  const [modalPublicar, setModalPublicar] = useState(false);
  const [modalTema, setModalTema] = useState(false);

  const nav = (href: string) => router.push(href);
  const ativo = (href: string) => pathname === href || paginaAtiva === href.replace("/", "");

  const iconBtn = (href: string, icon: string, label: string, onClick?: () => void) => (
    <button
      onClick={onClick ?? (() => nav(href))}
      title={label}
      className={`w-12 h-12 flex items-center justify-center rounded-2xl text-2xl transition-all duration-200
        ${ativo(href)
          ? "bg-[var(--cor-secundaria)] text-[var(--cor-branco)] shadow-lg scale-105"
          : "text-[var(--cor-secundaria)] hover:bg-[var(--cor-secundaria)] hover:text-[var(--cor-branco)] hover:scale-105"
        }`}
    >
      {icon}
    </button>
  );

  return (
    <>
      <aside className="w-20 shrink-0 flex flex-col items-center py-6 gap-5 bg-[var(--bg-sidebar)] border-r border-[var(--cor-borda)]">
        {/* Logo */}
        <div
          onClick={() => nav("/")}
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md mb-2 text-lg font-bold text-[var(--cor-primaria)]"
        >
          NF
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {iconBtn("/", "🏠", "Home")}
          {iconBtn("/buscar", "🔍", "Pesquisar")}
          {iconBtn("", "➕", "Publicar", () => setModalPublicar(true))}
          {iconBtn("/curtidos", "🤍", "Curtidos")}
          {iconBtn("/seguindo", "👥", "Seguindo")}
          {iconBtn("/loja", "🛍️", "Loja")}
          {iconBtn("/perfil", "👤", "Meu Perfil")}
        </div>

        {/* Config + Tema */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setModalTema(true)}
            title="Trocar tema"
            className="w-12 h-12 flex items-center justify-center rounded-2xl text-2xl text-[var(--cor-secundaria)] hover:bg-[var(--cor-secundaria)] hover:text-[var(--cor-branco)] transition-all"
          >
            🎨
          </button>
          {iconBtn("/config", "⚙️", "Configurações")}
        </div>
      </aside>

      {/* Modal Publicar */}
      {modalPublicar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setModalPublicar(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--bg-main)] rounded-2xl p-6 w-80 flex flex-col gap-3 shadow-2xl border border-[var(--cor-borda)]"
          >
            <h2 className="font-bold text-lg text-[var(--cor-texto)] mb-2">O que quer publicar?</h2>
            {[
              { label: "📸 Post no feed", sub: "Compartilhe uma boa ação", href: "/publicar?tipo=post" },
              { label: "🌟 Ajuda semanal", sub: "1 por semana • ganha 300 FloriPoints", href: "/publicar?tipo=ajuda" },
              { label: "📅 Criar evento", sub: "Junte pessoas para ajudar Floripa", href: "/publicar?tipo=evento" },
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => { setModalPublicar(false); router.push(item.href); }}
                className="flex flex-col text-left p-4 rounded-xl border border-[var(--cor-borda)] hover:bg-[var(--bg-card)] transition-all"
              >
                <span className="font-semibold text-[var(--cor-texto)]">{item.label}</span>
                <span className="text-xs text-[var(--cor-texto-suave)] mt-0.5">{item.sub}</span>
              </button>
            ))}
            <button onClick={() => setModalPublicar(false)} className="text-sm text-[var(--cor-texto-suave)] mt-1 hover:opacity-70">Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal Tema */}
      {modalTema && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setModalTema(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--bg-main)] rounded-2xl p-6 w-80 flex flex-col gap-3 shadow-2xl border border-[var(--cor-borda)]"
          >
            <h2 className="font-bold text-lg text-[var(--cor-texto)] mb-2">🎨 Escolha um tema</h2>
            {(Object.keys(temaInfo) as Tema[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTema(t); setModalTema(false); }}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all
                  ${tema === t
                    ? "border-[var(--cor-primaria)] bg-[var(--bg-card)] font-bold"
                    : "border-[var(--cor-borda)] hover:bg-[var(--bg-card)]"
                  }`}
              >
                <span className="text-2xl">{temaInfo[t].emoji}</span>
                <div className="text-left">
                  <p className="font-semibold text-[var(--cor-texto)]">{temaInfo[t].label}</p>
                  <div className="flex gap-1 mt-1">
                    {Object.values(temas[t]).slice(0, 4).map((cor, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ background: String(cor) }} />
                    ))}
                  </div>
                </div>
                {tema === t && <span className="ml-auto text-[var(--cor-primaria)]">✓</span>}
              </button>
            ))}
            <button onClick={() => setModalTema(false)} className="text-sm text-[var(--cor-texto-suave)] mt-1 hover:opacity-70">Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}