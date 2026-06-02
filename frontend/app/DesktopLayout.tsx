"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import banner2 from "@/app/public/banner2.jpg";
import eventoImg from "@/app/public/eventoImg.png";
import eventoImg2 from "@/app/public/eventoImg2.png";
import Asidebar from "@/components/asidebar";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  conteudo: string;
  imagem_url: string | null;
  created_at: string;
  tipo: string;
  perfis: { nome: string; username: string; avatar_url: string | null };
  curtidas: { id: string }[];
  comentarios: { id: string }[];
};

type Evento = {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
  local: string;
  data_evento: string;
  pontos_recompensa: number;
  perfis: { nome: string };
};

function MenuPost({ postId, onClose }: { postId: string; onClose: () => void }) {
  return (
    <div className="absolute right-0 top-8 z-50 bg-[#172219] rounded-2xl overflow-hidden w-52 shadow-2xl" onClick={(e) => e.stopPropagation()}>
      {[
        { label: "Denunciar", vermelho: true },
        { label: "Não tenho interesse", vermelho: false },
        { label: "Compartilhar", vermelho: false },
        { label: "Copiar link", vermelho: false },
        { label: "Cancelar", vermelho: false },
      ].map((item, i) => (
        <button
          key={i}
          onClick={onClose}
          className={`w-full py-3 text-center text-sm border-b border-[#253228] last:border-0 transition-colors hover:bg-[#253228]
            ${item.vermelho ? "text-[#ed4956] font-bold" : "text-[#ffedd2]"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function PostCard({ post, usuarioId }: { post: Post; usuarioId: string | null }) {
  const router = useRouter();
  const [curtido, setCurtido] = useState(post.curtidas?.some((c: any) => c.usuario_id === usuarioId) ?? false);
  const [totalCurtidas, setTotalCurtidas] = useState(post.curtidas?.length ?? 0);
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleCurtida = async () => {
    if (!usuarioId) return;
    if (curtido) {
      await supabase.from("curtidas").delete().eq("post_id", post.id).eq("usuario_id", usuarioId);
      setTotalCurtidas((p) => p - 1);
    } else {
      await supabase.from("curtidas").insert({ post_id: post.id, usuario_id: usuarioId });
      setTotalCurtidas((p) => p + 1);
    }
    setCurtido(!curtido);
  };

  return (
    <div className="w-full max-w-xl bg-[var(--bg-main)] rounded-2xl border border-[var(--cor-borda)] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 relative">
        <div
          onClick={() => router.push(`/perfil/${post.perfis?.username ?? ""}`)}
          className="w-10 h-10 rounded-full bg-[var(--bg-card)] overflow-hidden cursor-pointer shrink-0"
        >
          {post.perfis?.avatar_url
            ? <img src={post.perfis.avatar_url} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-[var(--cor-primaria)] font-bold">{post.perfis?.nome?.[0]}</div>
          }
        </div>
        <div className="flex-1">
          <p
            onClick={() => router.push(`/perfil/${post.perfis?.username ?? ""}`)}
            className="font-bold text-sm text-[var(--cor-texto)] cursor-pointer hover:underline"
          >
            {post.perfis?.nome}
          </p>
          <p className="text-xs text-[var(--cor-texto-suave)]">
            {post.tipo === "ajuda_semanal" ? "⭐ Ajuda semanal · " : ""}
            {new Date(post.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="relative">
          <button onClick={() => setMenuAberto(!menuAberto)} className="text-[var(--cor-texto-suave)] hover:text-[var(--cor-texto)] px-2">•••</button>
          {menuAberto && <MenuPost postId={post.id} onClose={() => setMenuAberto(false)} />}
        </div>
      </div>

      {/* Imagem */}
      {post.imagem_url && (
        <div className="w-full aspect-square bg-[var(--bg-card)] overflow-hidden">
          <img src={post.imagem_url} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Conteúdo */}
      {post.conteudo && (
        <div className="px-4 py-3">
          <p className="text-sm text-[var(--cor-texto)] leading-relaxed">{post.conteudo}</p>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center gap-4 px-4 pb-4 pt-1">
        <button onClick={toggleCurtida} className="flex items-center gap-1.5 text-sm font-semibold text-[var(--cor-primaria)] hover:opacity-70 transition-opacity">
          {curtido ? "👏" : "👏"} {totalCurtidas > 0 && totalCurtidas}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-[var(--cor-texto-suave)] hover:text-[var(--cor-texto)] transition-colors">
          💬 {post.comentarios?.length > 0 && post.comentarios.length}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-[var(--cor-texto-suave)] hover:text-[var(--cor-texto)] transition-colors ml-auto">
          ↗
        </button>
      </div>
    </div>
  );
}

function EventoCard({ evento }: { evento: Evento }) {
  const [participando, setParticipar] = useState(false);

  return (
    <div className="w-72 shrink-0 bg-[var(--bg-card)] border-2 border-[var(--cor-borda)] rounded-xl p-4 flex flex-col gap-3">
      <div>
        <h3 className="font-bold text-[var(--cor-secundario)] text-sm">{evento.titulo}</h3>
        <p className="text-xs text-[var(--cor-texto-suave)] mt-1 line-clamp-3">{evento.descricao}</p>
      </div>
      {evento.imagem_url && (
        <img src={evento.imagem_url} className="w-full h-28 object-cover rounded-lg" />
      )}
      {evento.local && (
        <p className="text-xs text-[var(--cor-texto-suave)]">📍 {evento.local}</p>
      )}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => setParticipar(!participando)}
          className={`text-xs px-4 py-1.5 rounded-lg font-semibold transition-all
            ${participando
              ? "bg-[var(--cor-accent)] text-[var(--cor-secundaria)] border border-[var(--cor-primaria)]"
              : "bg-[var(--cor-secundaria)] text-[var(--cor-branco)] hover:opacity-90"
            }`}
        >
          {participando ? "✓ Participando" : "Participar"}
        </button>
        <span className="text-xs font-bold text-[var(--cor-primaria)]">+{evento.pontos_recompensa} pts</span>
      </div>
    </div>
  );
}

export default function DesktopLayout() {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [semMais, setSemMais] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const POR_PAGINA = 5;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUsuarioId(data.user?.id ?? null));
    carregarEventos();
    carregarPosts(0);
  }, []);

  const carregarEventos = async () => {
    const { data } = await supabase
      .from("eventos")
      .select("*, perfis(nome)")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setEventos(data);
  };

  const carregarPosts = useCallback(async (pag: number) => {
    if (carregando || semMais) return;
    setCarregando(true);
    const { data } = await supabase
      .from("posts")
      .select("*, perfis(nome, username, avatar_url), curtidas(id, usuario_id), comentarios(id)")
      .order("created_at", { ascending: false })
      .range(pag * POR_PAGINA, (pag + 1) * POR_PAGINA - 1);
    if (data) {
      if (data.length < POR_PAGINA) setSemMais(true);
      setPosts((prev) => pag === 0 ? data : [...prev, ...data]);
      setPagina(pag + 1);
    }
    setCarregando(false);
  }, [carregando, semMais]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) carregarPosts(pagina); },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [pagina, carregarPosts]);

  const scroll = (dir: "left" | "right") =>
    carrosselRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });

  return (
    <div className="flex bg-[var(--bg-sidebar)] w-screen h-screen overflow-hidden font-sans">
      <Asidebar />

      {/* Central */}
      <div className="flex flex-col items-center py-6 px-6 bg-[var(--bg-feed)] flex-1 overflow-y-auto overflow-x-hidden">
        {/* Banner */}
        <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden">
          <img src={banner2.src} className="w-full h-72 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="font-black text-3xl leading-tight">PUBLIQUE<br />UM EVENTO</h1>
            <p className="text-sm max-w-xs mt-1 opacity-90">Junte pessoas para ajudar a melhorar Floripa e ganhe FloriPoints</p>
          </div>
        </div>

        {/* Eventos */}
        <section className="w-full max-w-3xl mt-8">
          <h2 className="text-xl font-bold mb-3 text-[var(--cor-texto)]">Eventos</h2>
          <div className="relative">
            <div ref={carrosselRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
              {eventos.length === 0
                ? [1,2,3].map(i => (
                    <div key={i} className="w-72 shrink-0 h-48 bg-[var(--bg-card)] rounded-xl animate-pulse border border-[var(--cor-borda)]" />
                  ))
                : eventos.map(e => <EventoCard key={e.id} evento={e} />)
              }
            </div>
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[var(--bg-main)] border border-[var(--cor-borda)] shadow rounded-full w-8 h-8 flex items-center justify-center text-[var(--cor-texto)] hover:bg-[var(--bg-card)] z-10">‹</button>
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[var(--bg-main)] border border-[var(--cor-borda)] shadow rounded-full w-8 h-8 flex items-center justify-center text-[var(--cor-texto)] hover:bg-[var(--bg-card)] z-10">›</button>
          </div>
        </section>

        {/* Feed */}
        <section className="w-full max-w-3xl mt-8 flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-[var(--cor-texto)] self-start">Feed</h2>
          {posts.map(post => <PostCard key={post.id} post={post} usuarioId={usuarioId} />)}
          <div ref={observerRef} className="w-full py-4 flex justify-center">
            {carregando && <div className="w-8 h-8 border-2 border-[var(--cor-primaria)] border-t-transparent rounded-full animate-spin" />}
            {semMais && posts.length > 0 && <p className="text-sm text-[var(--cor-texto-suave)]">Você chegou ao fim do feed 🌿</p>}
            {posts.length === 0 && !carregando && (
              <p className="text-sm text-[var(--cor-texto-suave)] text-center py-8">Nenhum post ainda. Seja o primeiro a publicar! 🌱</p>
            )}
          </div>
        </section>
      </div>

      {/* Direita */}
      <div className="flex flex-col w-80 shrink-0 bg-[var(--bg-right)] border-l border-[var(--cor-borda)] overflow-y-auto py-6 px-4 gap-6">
        <div className="w-full h-56 bg-[var(--bg-card)] rounded-xl border border-[var(--cor-borda)] flex items-center justify-center text-[var(--cor-texto-suave)] text-sm font-medium">
          🗺️ Mapa de eventos
        </div>
        <div className="w-full h-px bg-[var(--cor-borda)] opacity-60" />
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-[var(--cor-texto)] text-sm mb-2">Posts recentes</h3>
          {posts.slice(0, 5).map(post => (
            <div key={post.id} className="flex items-start gap-2 py-2 border-b border-[var(--cor-borda)] last:border-0">
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-card)] overflow-hidden shrink-0">
                {post.perfis?.avatar_url
                  ? <img src={post.perfis.avatar_url} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[var(--cor-primaria)]">{post.perfis?.nome?.[0]}</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-[var(--cor-texto)]">{post.perfis?.nome}</p>
                <p className="text-xs text-[var(--cor-texto-suave)] line-clamp-2">{post.conteudo}</p>
              </div>
              {post.imagem_url && (
                <img src={post.imagem_url} className="w-12 h-12 object-cover rounded-lg shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}