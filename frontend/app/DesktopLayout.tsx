"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import banner2 from "@/app/public/banner2.jpg";
import Asidebar from "@/components/asidebar";
import { supabase } from "@/lib/supabase";
import LikeIcon from "@/app/public/icons/Like.svg";
import ShareIcon from "@/app/public/icons/Share.svg";
import localIcon from "@/app/public/icons/LocationIcon.svg";
import Comment from "@/app/public/icons/Comment.svg";
import Image from "next/image";

type Post = {
  id: string;
  conteudo: string;
  imagem_url: string | null;
  created_at: string;
  tipo: string;
  autor_id: string;
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
  criador_id: string;
  perfis: { nome: string };
};

function MenuPost({ proprio, onDeletar, onEditar, onClose }: {
  proprio: boolean;
  onDeletar: () => void;
  onEditar: () => void;
  onClose: () => void;
}) {
  const opcoes = proprio
    ? [
        { label: "Editar", vermelho: false, acao: onEditar },
        { label: "Deletar", vermelho: true, acao: onDeletar },
        { label: "Compartilhar", vermelho: false, acao: onClose },
        { label: "Cancelar", vermelho: false, acao: onClose },
      ]
    : [
        { label: "Denunciar", vermelho: true, acao: onClose },
        { label: "Não tenho interesse", vermelho: false, acao: onClose },
        { label: "Compartilhar", vermelho: false, acao: onClose },
        { label: "Cancelar", vermelho: false, acao: onClose },
      ];

  return (
    <div className="absolute right-0 top-8 z-50 bg-(--bg-card) rounded-2xl overflow-hidden w-52 shadow-2xl border border-(--cor-borda)" onClick={(e) => e.stopPropagation()}>
      {opcoes.map((item, i) => (
        <button key={i} onClick={() => { item.acao(); onClose(); }}
          className={`w-full py-3 text-center text-sm border-b border-(--cor-borda) last:border-0 transition-colors hover:bg-(--bg-sidebar)
            ${item.vermelho ? "text-red-500 font-bold" : "text-(--cor-texto)"}`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ModalEditarPost({ post, onSalvar, onClose }: { post: Post; onSalvar: (conteudo: string) => void; onClose: () => void }) {
  const [conteudo, setConteudo] = useState(post.conteudo);
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    setSalvando(true);
    await supabase.from("posts").update({ conteudo }).eq("id", post.id);
    onSalvar(conteudo);
    setSalvando(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-(--bg-main) rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-2xl border border-(--cor-borda)">
        <h2 className="font-bold text-lg text-(--cor-texto)">Editar post</h2>
        <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={4}
          className="w-full border border-(--cor-borda) bg-transparent rounded-lg px-3 py-2 text-sm text-(--cor-texto) outline-none focus:border-(--cor-primaria) transition resize-none" />
        <div className="flex gap-2">
          <button onClick={salvar} disabled={salvando} className="flex-1 bg-(--cor-primaria) text-white py-2 rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-60">
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={onClose} className="flex-1 border border-(--cor-borda) py-2 rounded-lg text-sm text-(--cor-texto) hover:bg-(--bg-card)">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, usuarioId, onDeletar }: { post: Post; usuarioId: string | null; onDeletar: (id: string) => void }) {
  const router = useRouter();
  const [curtido, setCurtido] = useState(post.curtidas?.some((c) => c.usuario_id === usuarioId) ?? false);
  const [totalCurtidas, setTotalCurtidas] = useState(post.curtidas?.length ?? 0);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [conteudo, setConteudo] = useState(post.conteudo);
  const proprio = usuarioId === post.autor_id;

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

  const deletar = async () => {
    if (!confirm("Deletar este post?")) return;
    await supabase.from("posts").delete().eq("id", post.id);
    onDeletar(post.id);
  };

  return (
    <>
      <div className="w-full max-w-xl bg-(--bg-main) rounded-2xl border border-(--cor-borda) overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 p-4 relative">
          <div onClick={() => router.push(`/perfil/${post.perfis?.username ?? ""}`)}
            className="w-10 h-10 rounded-full bg-(--bg-card) overflow-hidden cursor-pointer shrink-0">
            {post.perfis?.avatar_url
              ? <img src={post.perfis.avatar_url} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-(--cor-primaria) font-bold">{post.perfis?.nome?.[0]}</div>
            }
          </div>
          <div className="flex-1">
            <p onClick={() => router.push(`/perfil/${post.perfis?.username ?? ""}`)}
              className="font-bold text-sm text-(--cor-texto) cursor-pointer hover:underline">{post.perfis?.nome}</p>
            <p className="text-xs text-(--cor-texto-suave)">
              {post.tipo === "ajuda" ? "⭐ Ajuda semanal" : ""}
              {new Date(post.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="relative">
            <button onClick={() => setMenuAberto(!menuAberto)} className="text-(--cor-texto-suave) hover:text-(--cor-texto) px-2">•••</button>
            {menuAberto && (
              <MenuPost
                proprio={proprio}
                onDeletar={deletar}
                onEditar={() => { setModalEditar(true); setMenuAberto(false); }}
                onClose={() => setMenuAberto(false)}
              />
            )}
          </div>
        </div>

        {post.imagem_url && (
          <div className="w-full aspect-square bg-(--bg-card) overflow-hidden">
            <img src={post.imagem_url} className="w-full h-full object-cover" />
          </div>
        )}

        {conteudo && (
          <div className="px-4 py-3">
            <p className="text-sm text-(--cor-texto) leading-relaxed">{conteudo}</p>
          </div>
        )}

        <div className="flex items-center gap-4 px-4 pb-4 pt-1">
          <button onClick={toggleCurtida} className="flex items-center gap-1.5 text-sm font-semibold text-(--cor-primaria) hover:opacity-70 transition-opacity">
            <Image src={LikeIcon} alt="Curtir" width={20} height={20} />
            {totalCurtidas > 0 && <span>{totalCurtidas}</span>}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-(--cor-texto-suave) hover:opacity-70 hover:text-(--cor-texto) transition-opacity">
            <img src={Comment.src} className="w-6 h-6" />
            {post.comentarios?.length > 0 && post.comentarios.length}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-(--cor-texto-suave) hover:text-(--cor-texto) transition-colors ml-auto">
            <Image src={ShareIcon} alt="Compartilhar" width={20} height={20} />
          </button>
        </div>
      </div>

      {modalEditar && (
        <ModalEditarPost post={{ ...post, conteudo }} onSalvar={(c) => setConteudo(c)} onClose={() => setModalEditar(false)} />
      )}
    </>
  );
}

function MenuEvento({ proprio, onDeletar, onEditar, onClose }: {
  proprio: boolean;
  onDeletar: () => void;
  onEditar: () => void;
  onClose: () => void;
}) {
  if (!proprio) return null;
  return (
    <div className="absolute right-0 top-8 z-50 bg-(--bg-card) rounded-2xl overflow-hidden w-44 shadow-2xl border border-(--cor-borda)" onClick={(e) => e.stopPropagation()}>
      {[
        { label: "Editar", vermelho: false, acao: onEditar },
        { label: "Deletar", vermelho: true, acao: onDeletar },
        { label: "Cancelar", vermelho: false, acao: onClose },
      ].map((item, i) => (
        <button key={i} onClick={() => { item.acao(); onClose(); }}
          className={`w-full py-3 text-center text-sm border-b border-(--cor-borda) last:border-0 transition-colors hover:bg-(--bg-sidebar)
            ${item.vermelho ? "text-red-500 font-bold" : "text-(--cor-texto)"}`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ModalEditarEvento({ evento, onSalvar, onClose }: { evento: Evento; onSalvar: (e: Partial<Evento>) => void; onClose: () => void }) {
  const [titulo, setTitulo] = useState(evento.titulo);
  const [descricao, setDescricao] = useState(evento.descricao);
  const [local, setLocal] = useState(evento.local);
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    setSalvando(true);
    await supabase.from("eventos").update({ titulo, descricao, local }).eq("id", evento.id);
    onSalvar({ titulo, descricao, local });
    setSalvando(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-(--bg-main) rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-2xl border border-(--cor-borda)">
        <h2 className="font-bold text-lg text-(--cor-texto)">Editar evento</h2>
        {[
          { label: "Título", value: titulo, set: setTitulo },
          { label: "Local", value: local, set: setLocal },
        ].map((f) => (
          <div key={f.label}>
            <label className="text-xs font-semibold text-(--cor-texto-suave) mb-1 block">{f.label}</label>
            <input value={f.value} onChange={(e) => f.set(e.target.value)}
              className="w-full border border-(--cor-borda) bg-transparent rounded-lg px-3 py-2 text-sm text-(--cor-texto) outline-none focus:border-(--cor-primaria) transition" />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold text-(--cor-texto-suave) mb-1 block">Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3}
            className="w-full border border-(--cor-borda) bg-transparent rounded-lg px-3 py-2 text-sm text-(--cor-texto) outline-none focus:border-(--cor-primaria) transition resize-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={salvar} disabled={salvando} className="flex-1 bg-(--cor-primaria) text-white py-2 rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-60">
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={onClose} className="flex-1 border border-[var(--cor-b.
          orda)] py-2 rounded-lg text-sm text-(--cor-texto) hover:bg-(--bg-card)">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

function EventoCard({ evento, usuarioId, onDeletar }: { evento: Evento; usuarioId: string | null; onDeletar: (id: string) => void }) {
  const [participando, setParticipar] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [dados, setDados] = useState(evento);
  const proprio = usuarioId === evento.criador_id;

  const deletar = async () => {
    if (!confirm("Deletar este evento?")) return;
    await supabase.from("eventos").delete().eq("id", evento.id);
    onDeletar(evento.id);
  };

  return (
    <>
      <div className="w-96 shrink-0 bg-(--bg-card) border-2 border-(--cor-borda) rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <h3 className="font-extrabold text-(--cor-texto) text-lg leading-tight flex-1">{dados.titulo}</h3>
          {proprio && (
            <div className="relative ml-2">
              <button onClick={() => setMenuAberto(!menuAberto)} className="text-(--cor-texto-suave) hover:text-(--cor-texto) px-1">•••</button>
              {menuAberto && (
                <MenuEvento
                  proprio={proprio}
                  onDeletar={deletar}
                  onEditar={() => { setModalEditar(true); setMenuAberto(false); }}
                  onClose={() => setMenuAberto(false)}
                />
              )}
            </div>
          )}
        </div>

        {dados.imagem_url
          ? <img src={dados.imagem_url} className="w-full h-36 object-cover rounded-xl" />
          : <div className="w-full h-24 bg-(--bg-main) rounded-xl flex items-center justify-center text-(--cor-texto-suave) text-xs">Sem imagem</div>
        }

        <p className="text-sm text-(--cor-texto) leading-relaxed line-clamp-3">{dados.descricao}</p>

        {dados.local && (
          <p className="text-xs text-(--cor-texto-suave) flex items-center gap-1">
            <img src={localIcon.src} className="w-4 h-4" />
            {dados.local}
          </p>
        )}

        {dados.pontos_recompensa > 0 && (
          <p className="text-xs text-(--cor-primaria) font-semibold">🌿 {dados.pontos_recompensa} FloriPoints</p>
        )}

        <div className="flex items-center gap-3 mt-auto pt-1">
          <button
            onClick={() => setParticipar(!participando)}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all
              ${participando
                ? "bg-(--cor-accent) text-(--cor-secundaria) border border-(--cor-primaria)"
                : "bg-(--cor-secundaria) text-(--cor-branco) hover:opacity-90"
              }`}
          >
            {participando ? "✓ Participando" : "Participar"}
          </button>
          <div className="flex gap-3 ml-auto">
            <button className="opacity-50 hover:opacity-70 transition-opacity">
              <Image src={LikeIcon} alt="Curtir" width={24} height={24} />
            </button>
            <button className="opacity-50 hover:opacity-70 transition-opacity">
              <Image src={ShareIcon} alt="Compartilhar" width={24} height={24} />
            </button>
          </div>
        </div>
      </div>

      {modalEditar && (
        <ModalEditarEvento evento={dados} onSalvar={(e) => setDados((prev) => ({ ...prev, ...e }))} onClose={() => setModalEditar(false)} />
      )}
    </>
  );
}

export default function DesktopLayout() {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [semMais, setSemMais] = useState(false);
  const [iniciou, setIniciou] = useState(false);
  const [maskPos, setMaskPos] = useState<"start" | "middle" | "end">("start");
  const observerRef = useRef<HTMLDivElement>(null);
  const semMaisRef = useRef(false);
  const carregandoRef = useRef(false);
  const paginaRef = useRef(0);
  const POR_PAGINA = 5;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUsuarioId(data.user?.id ?? null));
    carregarEventos();
    carregarPosts();
  }, []);

  const carregarEventos = async () => {
    const { data } = await supabase
      .from("eventos")
      .select("*, perfis(nome)")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data && data.length > 0) setEventos(data);
  };

  const carregarPosts = useCallback(async () => {
    if (carregandoRef.current || semMaisRef.current) return;
    carregandoRef.current = true;
    setCarregando(true);
    const pag = paginaRef.current;
    const { data } = await supabase
      .from("posts")
      .select("*, perfis(nome, username, avatar_url), curtidas(id, usuario_id), comentarios(id)")
      .order("created_at", { ascending: false })
      .range(pag * POR_PAGINA, (pag + 1) * POR_PAGINA - 1);
    if (data) {
      if (data.length < POR_PAGINA) { semMaisRef.current = true; setSemMais(true); }
      setPosts((prev) => (pag === 0 ? data : [...prev, ...data]));
      paginaRef.current = pag + 1;
    }
    carregandoRef.current = false;
    setCarregando(false);
    setIniciou(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) carregarPosts(); },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [carregarPosts]);

  const handleCarrosselScroll = useCallback(() => {
    const el = carrosselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollLeft <= 0) setMaskPos("start");
    else if (scrollLeft + clientWidth >= scrollWidth - 1) setMaskPos("end");
    else setMaskPos("middle");
  }, []);

  const scroll = (dir: "left" | "right") =>
    carrosselRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });

  return (
    <div className="flex bg-(--bg-sidebar) w-full h-screen font-sans">
      <Asidebar />

      <div className="flex flex-col items-center py-6 px-6 bg-(--bg-feed) flex-1 overflow-y-auto overflow-x-hidden">
        <div className="relative w-full max-w-3xl rounded-2xl">
          <img src={banner2.src} className="w-full h-72 object-cover block rounded-2xl" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent rounded-2xl" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="font-black text-3xl leading-tight">PUBLIQUE<br />UM EVENTO</h1>
            <p className="text-sm max-w-xs mt-1 opacity-90">Junte pessoas para ajudar a melhorar Floripa e ganhe FloriPoints</p>
          </div>
        </div>

        <section className="w-full max-w-3xl mt-8">
          <h2 className="text-xl font-bold mb-3 text-(--cor-texto)">Eventos</h2>
          {eventos.length === 0
            ? <p className="text-sm text-(--cor-texto-suave) py-4">Nenhum evento ainda. Crie o primeiro! 🎉</p>
            : (
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-12 z-10 pointer-events-none"
                  style={{ background: "linear-gradient(to right, var(--bg-feed) 0%, transparent 100%)", opacity: maskPos !== "start" ? 1 : 0, transition: "opacity 300ms" }} />
                <div className="absolute right-0 top-0 h-full w-12 z-10 pointer-events-none"
                  style={{ background: "linear-gradient(to left, var(--bg-feed) 0%, transparent 100%)", opacity: maskPos !== "end" ? 1 : 0, transition: "opacity 300ms" }} />
                <div ref={carrosselRef} onScroll={handleCarrosselScroll}
                  className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
                  {eventos.map((e) => (
                    <EventoCard key={e.id} evento={e} usuarioId={usuarioId} onDeletar={(id) => setEventos((prev) => prev.filter((ev) => ev.id !== id))} />
                  ))}
                </div>
                <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-(--bg-main) border border-(--cor-borda) shadow rounded-full w-8 h-8 flex items-center justify-center text-(--cor-texto) hover:bg-(--bg-card) z-10">‹</button>
                <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-(--bg-main) border border-(--cor-borda) shadow rounded-full w-8 h-8 flex items-center justify-center text-(--cor-texto) hover:bg-(--bg-card) z-10">›</button>
              </div>
            )
          }
        </section>

        <section className="w-full max-w-3xl mt-8 flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-(--cor-texto) self-start">Feed</h2>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} usuarioId={usuarioId} onDeletar={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))} />
          ))}
          <div ref={observerRef} className="w-full py-4 flex justify-center">
            {carregando && <div className="w-8 h-8 border-2 border-(--cor-primaria) border-t-transparent rounded-full animate-spin" />}
            {semMais && posts.length > 0 && <p className="text-sm text-(--cor-texto-suave)">Você chegou ao fim do feed 🌿</p>}
            {iniciou && posts.length === 0 && !carregando && <p className="text-sm text-(--cor-texto-suave) text-center py-8">Nenhum post ainda. Seja o primeiro a publicar! 🌱</p>}
          </div>
        </section>
      </div>

      <div className="flex flex-col w-80 shrink-0 bg-(--bg-right) border-l border-(--cor-borda) overflow-y-auto py-6 px-4 gap-6">

        <div className="w-full h-px bg-(--cor-borda) opacity-60" />
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-(--cor-texto) text-sm mb-2">Posts recentes</h3>
          {posts.slice(0, 5).map((post) => (
            <div key={post.id} className="flex items-start gap-2 py-2 border-b border-(--cor-borda) last:border-0">
              <div className="w-9 h-9 rounded-xl bg-(--bg-card) overflow-hidden shrink-0">
                {post.perfis?.avatar_url
                  ? <img src={post.perfis.avatar_url} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-(--cor-primaria)">{post.perfis?.nome?.[0]}</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-(--cor-texto)">{post.perfis?.nome}</p>
                <p className="text-xs text-(--cor-texto-suave) line-clamp-2">{post.conteudo}</p>
              </div>
              {post.imagem_url && <img src={post.imagem_url} className="w-12 h-12 object-cover rounded-lg shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}