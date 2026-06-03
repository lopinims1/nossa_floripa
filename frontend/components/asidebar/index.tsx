"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { useTema, Tema, temas } from "@/lib/ThemeContext"
import { usePerfilAtual } from "@/lib/usePerfilAtual"
import Home from "@/components/asidebar/icons/Home Icon.svg"
import Search from "@/components/asidebar/icons/Search Icon.svg"
import Publicar from "@/components/asidebar/icons/Publicar icon.svg"
import Curtidos from "@/components/asidebar/icons/Curtidos Icon.svg"
import Seguindo from "@/components/asidebar/icons/Seguindo Icon.svg"
import Perfil from "@/components/asidebar/icons/Perfil Icon.svg"
import Config from "@/components/asidebar/icons/Config Icon.svg"
import Theme from "@/components/asidebar/icons/Theme.svg"

const temaInfo: Record<Tema, { label: string }> = {
  floripa: { label: "🌿 Floripa" },
  noturno: { label: "🌙 Noturno" },
  oceano:  { label: "🌊 Oceano" },
  urbano:  { label: "🏙️ Urbano" },
}

const navIcons = [
  { image: Home,     label: "Home",     href: "/",         isPublicar: false },
  { image: Search,   label: "Buscar",   href: "/buscar",   isPublicar: false },
  { image: Publicar, label: "Publicar", href: "/publicar", isPublicar: true  },
  { image: Curtidos, label: "Curtidos", href: "/curtidos", isPublicar: false },
  { image: Seguindo, label: "Seguindo", href: "/seguindo", isPublicar: false },
]

export default function Asidebar() {
  const router   = useRouter()
  const pathname = usePathname()
  const { tema, setTema } = useTema()
  const { perfil } = usePerfilAtual()
  const [open, setOpen]               = useState(false)
  const [modalPublicar, setModalPublicar] = useState(false)
  const [modalTema, setModalTema]         = useState(false)

  const ativo = (href: string) => pathname === href

  const hoverOn  = (e: React.MouseEvent<HTMLButtonElement>, isAtivo: boolean) => {
    if (!isAtivo) e.currentTarget.style.backgroundColor = "var(--cor-hover)"
  }
  const hoverOff = (e: React.MouseEvent<HTMLButtonElement>, isAtivo: boolean) => {
    if (!isAtivo) e.currentTarget.style.backgroundColor = "transparent"
  }

  return (
    <>
      <aside
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`
          ${open ? "w-52" : "w-20"}
          h-screen shrink-0
          flex flex-col py-6
          transition-all duration-300 ease-in-out
          overflow-hidden z-40
          border-r
        `}
        style={{
          backgroundColor: "var(--bg-sidebar)",
          borderColor: "var(--cor-borda)",
        }}
      >
        {/* Logo topo */}
        <div className="flex items-center px-4 mb-6">
          <div
            onClick={() => router.push("/")}
            className="w-11 h-11 shrink-0 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md font-bold text-sm"
            style={{ color: "var(--cor-primaria)" }}
          >
            NF
          </div>
          {open && (
            <span
              className="ml-3 font-bold text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200"
              style={{ color: "var(--cor-texto)" }}
            >
              Nova Floripa
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1 w-full px-3 mt-35">
          {navIcons.map(({ image: Icon, label, href, isPublicar }) => {
            const estaAtivo = ativo(href)
            return (
              <button
                key={label}
                onClick={() => isPublicar ? setModalPublicar(true) : router.push(href)}
                title={label}
                onMouseEnter={(e) => hoverOn(e, estaAtivo)}
                onMouseLeave={(e) => hoverOff(e, estaAtivo)}
                className="w-full h-12 flex items-center gap-3 px-2 rounded-xl transition-colors duration-200"
                style={{
                  color: "var(--cor-secundaria)",
                  backgroundColor: estaAtivo ? "var(--cor-ativo)" : "transparent",
                }}
              >
                <span className="shrink-0 w-10 h-10 flex items-center justify-center">
                  <Image src={Icon} alt={label} width={28} height={28} />
                </span>
                {open && (
                  <span className="whitespace-nowrap font-semibold text-sm animate-in fade-in slide-in-from-left-2 duration-200">
                    {label}
                  </span>
                )}
              </button>
            )
          })}

          {/* Perfil */}
          {(() => {
            const estaAtivo = pathname.startsWith("/perfil")
            return (
              <button
                onClick={() => router.push(perfil ? `/perfil/${perfil.username}` : "/perfil")}
                title="Perfil"
                onMouseEnter={(e) => hoverOn(e, estaAtivo)}
                onMouseLeave={(e) => hoverOff(e, estaAtivo)}
                className="w-full h-12 flex items-center gap-3 px-2 rounded-xl transition-colors duration-200"
                style={{
                  color: "var(--cor-secundaria)",
                  backgroundColor: estaAtivo ? "var(--cor-ativo)" : "transparent",
                }}
              >
                <span className="shrink-0 w-10 h-10 flex items-center justify-center">
                  {perfil?.avatar_url
                    ? <img src={perfil.avatar_url} alt={perfil.nome} className="w-9 h-9 rounded-full object-cover" />
                    : <Image src={Perfil} alt="Perfil" width={28} height={28} />
                  }
                </span>
                {open && (
                  <span className="whitespace-nowrap font-semibold text-sm animate-in fade-in slide-in-from-left-2 duration-200">
                    {perfil?.nome ?? "Perfil"}
                  </span>
                )}
              </button>
            )
          })()}
        </nav>

        {/* FloriPoints */}
        {perfil && (
          <div
            className={`mx-3 mb-3 px-2 py-2 rounded-xl flex items-center gap-2 border ${open ? "justify-start" : "justify-center"}`}
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--cor-borda)" }}
          >
            <span className="text-sm shrink-0">🌿</span>
            <span
              className="text-xs font-bold whitespace-nowrap animate-in fade-in duration-200"
              style={{ color: "var(--cor-primaria)" }}
            >
              {open ? `${perfil.floripoints} pts` : perfil.floripoints}
            </span>
          </div>
        )}

        {/* Rodapé — Tema + Config */}
        <div className="flex flex-col gap-1 w-full px-3">
          {[
            { Icon: Theme,  label: "Tema",   onClick: () => setModalTema(true),       href: "" },
            { Icon: Config, label: "Config", onClick: () => router.push("/config"),   href: "/config" },
          ].map(({ Icon, label, onClick, href }) => {
            const estaAtivo = href ? ativo(href) : false
            return (
              <button
                key={label}
                onClick={onClick}
                title={label}
                onMouseEnter={(e) => hoverOn(e, estaAtivo)}
                onMouseLeave={(e) => hoverOff(e, estaAtivo)}
                className="w-full h-12 flex items-center gap-3 px-2 rounded-xl transition-colors duration-200"
                style={{
                  color: "var(--cor-secundaria)",
                  backgroundColor: estaAtivo ? "var(--cor-ativo)" : "transparent",
                }}
              >
                <span className="shrink-0 w-10 h-10 flex items-center justify-center">
                  <Image src={Icon} alt={label} width={28} height={28} />
                </span>
                {open && (
                  <span className="whitespace-nowrap font-semibold text-sm animate-in fade-in slide-in-from-left-2 duration-200">
                    {label}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Modal Publicar */}
      {modalPublicar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setModalPublicar(false)}>
          <div onClick={(e) => e.stopPropagation()} className="rounded-2xl p-6 w-80 flex flex-col gap-3 shadow-2xl border"
            style={{ backgroundColor: "var(--bg-main)", borderColor: "var(--cor-borda)" }}>
            <h2 className="font-bold text-lg mb-2" style={{ color: "var(--cor-texto)" }}>O que quer publicar?</h2>
            {[
              { label: "📸 Post no feed",  sub: "Compartilhe uma boa ação",             href: "/publicar?tipo=post"   },
              { label: "🌟 Ajuda semanal", sub: "1 por semana • ganha 300 FloriPoints", href: "/publicar?tipo=ajuda"  },
              { label: "📅 Criar evento",  sub: "Junte pessoas para ajudar Floripa",     href: "/publicar?tipo=evento" },
            ].map((item) => (
              <button key={item.href} onClick={() => { setModalPublicar(false); router.push(item.href) }}
                className="flex flex-col text-left p-4 rounded-xl border transition-all"
                style={{ borderColor: "var(--cor-borda)", color: "var(--cor-texto)" }}>
                <span className="font-semibold">{item.label}</span>
                <span className="text-xs mt-0.5" style={{ color: "var(--cor-texto-suave)" }}>{item.sub}</span>
              </button>
            ))}
            <button onClick={() => setModalPublicar(false)} className="text-sm mt-1 hover:opacity-70"
              style={{ color: "var(--cor-texto-suave)" }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal Tema */}
      {modalTema && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setModalTema(false)}>
          <div onClick={(e) => e.stopPropagation()} className="rounded-2xl p-6 w-80 flex flex-col gap-3 shadow-2xl border"
            style={{ backgroundColor: "var(--bg-main)", borderColor: "var(--cor-borda)" }}>
            <h2 className="font-bold text-lg mb-2" style={{ color: "var(--cor-texto)" }}>Escolha um tema</h2>
            {(Object.keys(temaInfo) as Tema[]).map((t) => (
              <button key={t} onClick={() => { setTema(t); setModalTema(false) }}
                className="flex items-center gap-3 p-4 rounded-xl border transition-all"
                style={{
                  borderColor: tema === t ? "var(--cor-primaria)" : "var(--cor-borda)",
                  backgroundColor: tema === t ? "var(--bg-card)" : "transparent",
                  fontWeight: tema === t ? "700" : "400",
                }}>
                <div className="text-left flex-1">
                  <p className="font-semibold" style={{ color: "var(--cor-texto)" }}>{temaInfo[t].label}</p>
                  <div className="flex gap-1 mt-1">
                    {Object.values(temas[t]).slice(0, 4).map((cor, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ background: String(cor) }} />
                    ))}
                  </div>
                </div>
                {tema === t && <span style={{ color: "var(--cor-primaria)" }}>✓</span>}
              </button>
            ))}
            <button onClick={() => setModalTema(false)} className="text-sm mt-1 hover:opacity-70"
              style={{ color: "var(--cor-texto-suave)" }}>Fechar</button>
          </div>
        </div>
      )}
    </>
  )
}