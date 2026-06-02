"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import banner2 from "@/app/public/banner2.jpg";
import Asidebar from "@/components/asidebar";
import { supabase } from "@/lib/supabase";
import LikeIcon from "@/app/public/icons/Like.svg";
import ShareIcon from "@/app/public/icons/Share.svg";
import Image from "next/image";

type Post = {
  id: string;
  conteudo: string;
  imagem_url: string | null;
  created_at: string;
  tipo: string;
  perfis: { nome: string; username: string; avatar_url: string | null };
  curtidas: { id: string; usuario_id: string }[];
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

function MenuPost({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute right-0 top-8 z-50 bg-[var(--bg-card)] rounded-2xl overflow-hidden w-52 shadow-2xl border border-[var(--cor-borda)]"
      onClick={(e) => e.stopPropagation()}
    >
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
          className={`w-full py-3 text-center text-sm border-b border-[var(--cor-borda)] last:border-0 transition-colors hover:bg-[var(--bg-sidebar)]
            ${item.vermelho ? "text-red-500 font-bold" : "text-[var(--cor-texto)]"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function PostCard({
  post,
  usuarioId,
}: {
  post: Post;
  usuarioId: string | null;
}) {
  const router = useRouter();
  const [curtido, setCurtido] = useState(
    post.curtidas?.some((c) => c.usuario_id === usuarioId) ?? false
  );
  const [totalCurtidas, setTotalCurtidas] = useState(
    post.curtidas?.length ?? 0
  );
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleCurtida = async () => {
    if (!usuarioId) return;
    if (curtido) {
      await supabase
        .from("curtidas")
        .delete()
        .eq("post_id", post.id)
        .eq("usuario_id", usuarioId);
      setTotalCurtidas((p) => p - 1);
    } else {
      await supabase
        .from("curtidas")
        .insert({ post_id: post.id, usuario_id: usuarioId });
      setTotalCurtidas((p) => p + 1);
    }
    setCurtido(!curtido);
  };

  return (
    <div className="w-full bg-[var(--bg-main)] rounded-2xl border border-[var(--cor-borda)] overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 p-4 relative">
        <div
          onClick={() => router.push(`/perfil/${post.perfis?.username ?? ""}`)}
          className="w-10 h-10 rounded-full bg-[var(--bg-card)] overflow-hidden cursor-pointer shrink-0"
        >
          {post.perfis?.avatar_url ? (
            <img
              src={post.perfis.avatar_url}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--cor-primaria)] font-bold">
              {post.perfis?.nome?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p
            onClick={() =>
              router.push(`/perfil/${post.perfis?.username ?? ""}`)
            }
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
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-[var(--cor-texto-suave)] hover:text-[var(--cor-texto)] px-2"
          >
            •••
          </button>
          {menuAberto && <MenuPost onClose={() => setMenuAberto(false)} />}
        </div>
      </div>

      {post.imagem_url && (
        <div className="w-full aspect-square bg-[var(--bg-card)] overflow-hidden">
          <img src={post.imagem_url} className="w-full h-full object-cover" />
        </div>
      )}

      {post.conteudo && (
        <div className="px-4 py-3">
          <p className="text-sm text-[var(--cor-texto)] leading-relaxed">
            {post.conteudo}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 px-4 pb-4 pt-1">
        <button
          onClick={toggleCurtida}
          className="flex items-center gap-1.5 text-sm font-semibold text-[var(--cor-primaria)] hover:opacity-70 transition-opacity"
        >
          <Image src={LikeIcon} alt="Curtir" width={20} height={20} />
          {totalCurtidas > 0 && <span>{totalCurtidas}</span>}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-[var(--cor-texto-suave)] hover:text-[var(--cor-texto)] transition-colors">
          💬 {post.comentarios?.length > 0 && post.comentarios.length}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-[var(--cor-texto-suave)] hover:text-[var(--cor-texto)] transition-colors ml-auto">
          <Image src={ShareIcon} alt="Compartilhar" width={20} height={20} />
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
        <h3 className="font-bold text-[var(--cor-secundario)] text-sm">
          {evento.titulo}
        </h3>
        <p className="text-xs text-[var(--cor-texto-suave)] mt-1 line-clamp-3">
          {evento.descricao}
        </p>
      </div>
      {evento.imagem_url && (
        <img
          src={evento.imagem_url}
          className="w-full h-28 object-cover rounded-lg"
        />
      )}
      {evento.local && (
        <p className="text-xs text-[var(--cor-texto-suave)]">
          📍 {evento.local}
        </p>
      )}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => setParticipar(!participando)}
          className={`text-xs px-4 py-1.5 rounded-lg font-semibold transition-all
            ${
              participando
                ? "bg-[var(--cor-accent)] text-[var(--cor-secundaria)] border border-[var(--cor-primaria)]"
                : "bg-[var(--cor-secundaria)] text-[var(--cor-branco)] hover:opacity-90"
            }`}
        >
          {participando ? "✓ Participando" : "Participar"}
        </button>
        <span className="text-xs font-bold text-[var(--cor-primaria)]">
          +{evento.pontos_recompensa} pts
        </span>
      </div>
    </div>
  );
}

export default function MobileLayout() {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [semMais, setSemMais] = useState(false);
  const [iniciou, setIniciou] = useState(false);
  const [maskPos, setMaskPos] = useState<"start" | "middle" | "end">("start");
  const observerRef = useRef<HTMLDivElement>(null);

  // Refs para controle interno sem causar re-renders no observer
  const semMaisRef = useRef(false);
  const carregandoRef = useRef(false);
  const paginaRef = useRef(0);
  const POR_PAGINA = 5;

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUsuarioId(data.user?.id ?? null));
    carregarEventos();
    carregarPosts();
  }, []);

  const carregarEventos = async () => {
    const { data } = await supabase
      .from("eventos")
      .select("*, perfis(nome)")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setEventos(data);
  };

  const carregarPosts = useCallback(async () => {
    if (carregandoRef.current || semMaisRef.current) return;

    carregandoRef.current = true;
    setCarregando(true);

    const pag = paginaRef.current;
    const { data } = await supabase
      .from("posts")
      .select(
        "*, perfis(nome, username, avatar_url), curtidas(id, usuario_id), comentarios(id)"
      )
      .order("created_at", { ascending: false })
      .range(pag * POR_PAGINA, (pag + 1) * POR_PAGINA - 1);

    if (data) {
      if (data.length < POR_PAGINA) {
        semMaisRef.current = true;
        setSemMais(true);
      }
      setPosts((prev) => (pag === 0 ? data : [...prev, ...data]));
      paginaRef.current = pag + 1;
    }

    carregandoRef.current = false;
    setCarregando(false);
    setIniciou(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) carregarPosts();
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [carregarPosts]);

  const handleScroll = useCallback(() => {
    const el = carrosselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollLeft <= 0) setMaskPos("start");
    else if (scrollLeft + clientWidth >= scrollWidth - 1) setMaskPos("end");
    else setMaskPos("middle");
  }, []);

  return (
    <div className="flex bg-[var(--bg-sidebar)] w-full min-h-screen overflow-hidden font-sans">
      {/* Central */}
      <div className="flex flex-col items-center py-6 px-4 bg-[var(--bg-feed)] flex-1 overflow-y-auto overflow-x-hidden">

        {/* Banner */}
        <div className="relative w-full rounded-2xl overflow-hidden">
          <img src={banner2.src} className="w-full h-56 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <h1 className="font-black text-2xl leading-tight">
              PUBLIQUE
              <br />
              UM EVENTO
            </h1>
            <p className="text-xs max-w-xs mt-1 opacity-90">
              Junte pessoas para ajudar a melhorar Floripa e ganhe FloriPoints
            </p>
          </div>
        </div>

        {/* Eventos */}
        <section className="w-full mt-7">
          <h2 className="text-lg font-bold mb-3 text-[var(--cor-texto)]">
            Eventos
          </h2>
          <div className="relative">
            {/* Fade esquerda */}
            <div
              className="absolute left-0 top-0 h-full w-10 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, var(--bg-feed) 0%, transparent 100%)",
                opacity: maskPos !== "start" ? 1 : 0,
                transition: "opacity 300ms ease-in-out",
              }}
            />
            {/* Fade direita */}
            <div
              className="absolute right-0 top-0 h-full w-10 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, var(--bg-feed) 0%, transparent 100%)",
                opacity: maskPos !== "end" ? 1 : 0,
                transition: "opacity 300ms ease-in-out",
              }}
            />

            <div
              ref={carrosselRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {eventos.length === 0
                ? [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-72 shrink-0 h-48 bg-[var(--bg-card)] rounded-xl animate-pulse border border-[var(--cor-borda)]"
                    />
                  ))
                : eventos.map((e) => <EventoCard key={e.id} evento={e} />)}
            </div>
          </div>
        </section>

        {/* Feed */}
        <section className="w-full mt-7 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[var(--cor-texto)]">Feed</h2>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} usuarioId={usuarioId} />
          ))}
          <div ref={observerRef} className="w-full py-4 flex justify-center">
            {carregando && (
              <div className="w-8 h-8 border-2 border-[var(--cor-primaria)] border-t-transparent rounded-full animate-spin" />
            )}
            {semMais && posts.length > 0 && (
              <p className="text-sm text-[var(--cor-texto-suave)]">
                Você chegou ao fim do feed 🌿
              </p>
            )}
            {iniciou && posts.length === 0 && !carregando && (
              <p className="text-sm text-[var(--cor-texto-suave)] text-center py-8">
                Nenhum post ainda. Seja o primeiro a publicar! 🌱
              </p>
            )}
          </div>
        </section>
      </div>

      <Asidebar />
    </div>
  );
}