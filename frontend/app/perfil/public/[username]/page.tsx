"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Asidebar from "@/components/asidebar";
import { supabase } from "@/lib/supabase";

type Perfil = {
  id: string;
  nome: string;
  username: string;
  bio: string;
  avatar_url: string | null;
  moldura_ativa: string | null;
  floripoints: number;
};

type Post = {
  id: string;
  conteudo: string;
  imagem_url: string | null;
  created_at: string;
};

function MenuPerfil({ proprio, onEditar, onClose }: { proprio: boolean; onEditar: () => void; onClose: () => void }) {
  const opcoesProprio = [
    { label: "Editar perfil", acao: onEditar },
    { label: "Ver inventário", acao: onClose },
    { label: "Cancelar", acao: onClose },
  ];
  const opcoesAlheio = [
    { label: "Denunciar", vermelho: true, acao: onClose },
    { label: "Compartilhar", acao: onClose },
    { label: "Copiar link", acao: onClose },
    { label: "Sobre essa conta", acao: onClose },
    { label: "Cancelar", acao: onClose },
  ];
  const opcoes = proprio ? opcoesProprio : opcoesAlheio;

  return (
    <div className="absolute right-0 top-8 z-50 bg-[#172219] rounded-2xl overflow-hidden w-56 shadow-2xl">
      {opcoes.map((op, i) => (
        <button
          key={i}
          onClick={() => { op.acao(); onClose(); }}
          className={`w-full py-3.5 text-center text-sm border-b border-[#253228] last:border-0 hover:bg-[#253228] transition-colors
            ${"vermelho" in op && op.vermelho ? "text-[#ed4956] font-bold" : "text-[#ffedd2]"}`}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}

function ModalEditar({ perfil, onSalvar, onClose }: { perfil: Perfil; onSalvar: (p: Partial<Perfil>) => void; onClose: () => void }) {
  const [nome, setNome] = useState(perfil.nome);
  const [bio, setBio] = useState(perfil.bio ?? "");
  const [username, setUsername] = useState(perfil.username ?? "");
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    setSalvando(true);
    const { error } = await supabase.from("perfis").update({ nome, bio, username }).eq("id", perfil.id);
    if (!error) onSalvar({ nome, bio, username });
    setSalvando(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[var(--bg-main)] rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-2xl border border-[var(--cor-borda)]">
        <h2 className="font-bold text-lg text-[var(--cor-texto)]">Editar perfil</h2>
        {[
          { label: "Nome", value: nome, set: setNome },
          { label: "Username", value: username, set: setUsername },
        ].map((f) => (
          <div key={f.label}>
            <label className="text-xs font-semibold text-[var(--cor-texto-suave)] mb-1 block">{f.label}</label>
            <input
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="w-full border border-[var(--cor-borda)] bg-transparent rounded-lg px-3 py-2 text-sm text-[var(--cor-texto)] outline-none focus:border-[var(--cor-primaria)] transition"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold text-[var(--cor-texto-suave)] mb-1 block">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border border-[var(--cor-borda)] bg-transparent rounded-lg px-3 py-2 text-sm text-[var(--cor-texto)] outline-none focus:border-[var(--cor-primaria)] transition resize-none"
          />
        </div>
        <div className="flex gap-2 mt-1">
          <button onClick={salvar} disabled={salvando} className="flex-1 bg-[var(--cor-primaria)] text-white py-2 rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-60">
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={onClose} className="flex-1 border border-[var(--cor-borda)] py-2 rounded-lg text-sm text-[var(--cor-texto)] hover:bg-[var(--bg-card)]">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PerfilDesktopLayout() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = params?.username as string | undefined;

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<string | null>(null);
  const [seguindo, setSeguindo] = useState(false);
  const [totalSeguidores, setTotalSeguidores] = useState(0);
  const [totalSeguindo, setTotalSeguindo] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const proprio = usuarioAtual === perfil?.id;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUsuarioAtual(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!usuarioAtual) return;
    carregarPerfil();
  }, [usuarioAtual, usernameParam]);

  const carregarPerfil = async () => {
    let query = supabase.from("perfis").select("*");
    if (usernameParam) query = query.eq("username", usernameParam);
    else query = query.eq("id", usuarioAtual!);

    const { data } = await query.single();
    if (!data) return;
    setPerfil(data);

    const [postsRes, seguidoresRes, seguindoRes, seguindoUser] = await Promise.all([
      supabase.from("posts").select("*").eq("autor_id", data.id).order("created_at", { ascending: false }),
      supabase.from("seguidores").select("id", { count: "exact" }).eq("seguido_id", data.id),
      supabase.from("seguidores").select("id", { count: "exact" }).eq("seguidor_id", data.id),
      supabase.from("seguidores").select("id").eq("seguidor_id", usuarioAtual!).eq("seguido_id", data.id).single(),
    ]);

    setPosts(postsRes.data ?? []);
    setTotalPosts(postsRes.data?.length ?? 0);
    setTotalSeguidores(seguidoresRes.count ?? 0);
    setTotalSeguindo(seguindoRes.count ?? 0);
    setSeguindo(!!seguindoUser.data);
  };

  const toggleSeguir = async () => {
    if (!usuarioAtual || !perfil) return;
    if (seguindo) {
      await supabase.from("seguidores").delete().eq("seguidor_id", usuarioAtual).eq("seguido_id", perfil.id);
      setTotalSeguidores((p) => p - 1);
    } else {
      await supabase.from("seguidores").insert({ seguidor_id: usuarioAtual, seguido_id: perfil.id });
      setTotalSeguidores((p) => p + 1);
    }
    setSeguindo(!seguindo);
  };

  if (!perfil) return (
    <div className="flex bg-[var(--bg-sidebar)] w-screen h-screen overflow-hidden">
      <Asidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--cor-primaria)] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="flex bg-[var(--bg-sidebar)] w-screen h-screen overflow-hidden font-sans">
      <Asidebar />
      <div className="flex-1 bg-[var(--bg-feed)] overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">

          {/* Header perfil */}
          <div className="flex gap-6 items-start mb-6 relative">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-[var(--bg-card)] overflow-hidden border-4 border-[var(--cor-primaria)] shrink-0">
              {perfil.avatar_url
                ? <img src={perfil.avatar_url} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-[var(--cor-primaria)]">{perfil.nome?.[0]}</div>
              }
            </div>

            {/* Infos */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-black text-3xl text-[var(--cor-texto)]">{perfil.nome?.toUpperCase()}</h1>
                <span className="text-[var(--cor-primaria)]">✓</span>
                <div className="relative ml-auto">
                  <button onClick={() => setMenuAberto(!menuAberto)} className="text-[var(--cor-texto-suave)] hover:text-[var(--cor-texto)] text-lg px-2">•••</button>
                  {menuAberto && (
                    <MenuPerfil
                      proprio={proprio}
                      onEditar={() => { setModalEditar(true); setMenuAberto(false); }}
                      onClose={() => setMenuAberto(false)}
                    />
                  )}
                </div>
              </div>
              <p className="text-[var(--cor-texto-suave)] text-sm mb-2">@{perfil.username}</p>

              {/* Stats */}
              <div className="flex gap-5 text-sm mb-3">
                {[
                  { label: "posts", val: totalPosts },
                  { label: "seguidores", val: totalSeguidores, onClick: () => router.push(`/seguindo?id=${perfil.id}&aba=seguidores`) },
                  { label: "seguindo", val: totalSeguindo, onClick: () => router.push(`/seguindo?id=${perfil.id}&aba=seguindo`) },
                  { label: "FloriPoints 🌟", val: perfil.floripoints },
                ].map((s) => (
                  <span
                    key={s.label}
                    onClick={s.onClick}
                    className={s.onClick ? "cursor-pointer hover:underline" : ""}
                  >
                    <strong className="text-[var(--cor-texto)]">{s.val}</strong>{" "}
                    <span className="text-[var(--cor-texto-suave)]">{s.label}</span>
                  </span>
                ))}
              </div>

              {/* Bio */}
              {perfil.bio && <p className="text-sm text-[var(--cor-texto)] whitespace-pre-line">{perfil.bio}</p>}
            </div>
          </div>

          {/* Botão seguir */}
          {!proprio && (
            <button
              onClick={toggleSeguir}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all mb-8
                ${seguindo
                  ? "bg-[var(--bg-card)] border-2 border-[var(--cor-primaria)] text-[var(--cor-primaria)]"
                  : "bg-[var(--cor-secundaria)] text-[var(--cor-branco)] hover:opacity-90"
                }`}
            >
              {seguindo ? "✓ Seguindo" : "Seguir"}
            </button>
          )}

          {/* Posts */}
          <div>
            <h2 className="font-bold text-[var(--cor-texto)] mb-4">Posts</h2>
            {posts.length === 0
              ? <p className="text-[var(--cor-texto-suave)] text-sm text-center py-12">Nenhum post ainda 🌱</p>
              : (
                <div className="grid grid-cols-3 gap-2">
                  {posts.map((post) => (
                    <div key={post.id} className="aspect-square bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--cor-borda)]">
                      {post.imagem_url
                        ? <img src={post.imagem_url} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center p-3 text-xs text-[var(--cor-texto-suave)] text-center">{post.conteudo}</div>
                      }
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      </div>

      {modalEditar && (
        <ModalEditar
          perfil={perfil}
          onSalvar={(p) => setPerfil((prev) => prev ? { ...prev, ...p } : prev)}
          onClose={() => setModalEditar(false)}
        />
      )}
    </div>
  );
}