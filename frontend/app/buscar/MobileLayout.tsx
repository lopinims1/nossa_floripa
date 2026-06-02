"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/asidebar";
import { Search, X, User, Film } from "lucide-react";

type Perfil = {
    id: string;
    nome: string;
    username: string;
    avatar_url: string | null;
    bio: string | null;
};

type Post = {
    id: string;
    conteudo: string;
    imagem_url: string | null;
    created_at: string;
    perfis: { nome: string; username: string; avatar_url: string | null };
};

type FiltroBusca = "contas" | "videos";

export default function MobileLayout() {
    const [query, setQuery] = useState("");
    const [filtroBusca, setFiltroBusca] = useState<FiltroBusca>("contas");
    const [perfis, setPerfis] = useState<Perfil[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [postsTrending, setPostsTrending] = useState<Post[]>([]);
    const [carregando, setCarregando] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function carregarTrending() {
            const { data } = await supabase
                .from("posts")
                .select("*, perfis(nome, username, avatar_url)")
                .order("created_at", { ascending: false })
                .limit(12);
            if (data) setPostsTrending(data as any);
        }
        carregarTrending();
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setPerfis([]);
            setPosts([]);
            return;
        }
        const timer = setTimeout(() => buscar(), 300);
        return () => clearTimeout(timer);
    }, [query, filtroBusca]);

    async function buscar() {
        setCarregando(true);
        if (filtroBusca === "contas") {
            const { data } = await supabase
                .from("perfis")
                .select("id, nome, username, avatar_url, bio")
                .or(`nome.ilike.%${query}%,username.ilike.%${query}%`)
                .limit(20);
            setPerfis(data || []);
            setPosts([]);
        } else {
            const { data } = await supabase
                .from("posts")
                .select("*, perfis(nome, username, avatar_url)")
                .ilike("conteudo", `%${query}%`)
                .not("imagem_url", "is", null)
                .limit(20);
            setPosts((data as any) || []);
            setPerfis([]);
        }
        setCarregando(false);
    }

    const mostrando = query.trim().length > 0;

    return (
        <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--bg-feed)" }}>

            {/* Conteúdo principal */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
                <div className="px-4 pt-5 pb-4">

                    {/* Campo de busca */}
                    <div className="relative mb-4">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: "var(--cor-primaria)" }}
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pesquisar..."
                            className="w-full rounded-xl pl-10 pr-9 py-3 outline-none transition-colors text-sm"
                            style={{
                                background: "var(--bg-main)",
                                border: "1px solid var(--cor-borda)",
                                color: "var(--cor-texto)",
                            }}
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: "var(--cor-texto-suave)" }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filtro */}
                    <div className="flex gap-2 mb-5 items-center">
                        <span className="text-xs whitespace-nowrap" style={{ color: "var(--cor-texto-suave)" }}>
                            Procurar por:
                        </span>
                        <button
                            onClick={() => setFiltroBusca("contas")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                            style={
                                filtroBusca === "contas"
                                    ? { background: "var(--cor-secundaria)", color: "var(--cor-branco)", borderColor: "var(--cor-secundaria)" }
                                    : { background: "var(--bg-main)", color: "var(--cor-primaria)", borderColor: "var(--cor-borda)" }
                            }
                        >
                            <User className="w-3 h-3" /> Contas
                        </button>
                        <button
                            onClick={() => setFiltroBusca("videos")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                            style={
                                filtroBusca === "videos"
                                    ? { background: "var(--cor-secundaria)", color: "var(--cor-branco)", borderColor: "var(--cor-secundaria)" }
                                    : { background: "var(--bg-main)", color: "var(--cor-primaria)", borderColor: "var(--cor-borda)" }
                            }
                        >
                            <Film className="w-3 h-3" /> Posts
                        </button>
                    </div>

                    {/* Buscando */}
                    {carregando && (
                        <p className="text-center py-10 text-sm" style={{ color: "var(--cor-texto-suave)" }}>
                            Buscando...
                        </p>
                    )}

                    {/* Resultados de contas */}
                    {mostrando && !carregando && filtroBusca === "contas" && (
                        <>
                            {perfis.length === 0 ? (
                                <p className="text-center py-10 text-sm" style={{ color: "var(--cor-texto-suave)" }}>
                                    Nenhuma conta encontrada.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2.5">
                                    {perfis.map((p) => (
                                        <a
                                            key={p.id}
                                            href={`/perfil/${p.username}`}
                                            className="flex items-center gap-3 rounded-xl p-3.5 border transition-all"
                                            style={{ background: "var(--bg-main)", borderColor: "var(--cor-borda)" }}
                                        >
                                            <div
                                                className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                                                style={{ background: "var(--bg-card)" }}
                                            >
                                                {p.avatar_url ? (
                                                    <img src={p.avatar_url} alt={p.nome} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div
                                                        className="w-full h-full flex items-center justify-center font-bold text-base"
                                                        style={{ color: "var(--cor-primaria)" }}
                                                    >
                                                        {p.nome?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate" style={{ color: "var(--cor-texto)" }}>
                                                    {p.nome}
                                                </p>
                                                <p className="text-xs" style={{ color: "var(--cor-texto-suave)" }}>
                                                    @{p.username}
                                                </p>
                                                {p.bio && (
                                                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--cor-texto-suave)" }}>
                                                        {p.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Resultados de posts */}
                    {mostrando && !carregando && filtroBusca === "videos" && (
                        <>
                            {posts.length === 0 ? (
                                <p className="text-center py-10 text-sm" style={{ color: "var(--cor-texto-suave)" }}>
                                    Nenhum post encontrado.
                                </p>
                            ) : (
                                <div className="grid grid-cols-3 gap-1">
                                    {posts.map((post) => (
                                        <PostGrid key={post.id} post={post} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Explorar */}
                    {!mostrando && (
                        <>
                            <h2 className="font-semibold text-base mb-3" style={{ color: "var(--cor-texto)" }}>
                                Explorar
                            </h2>
                            {postsTrending.length === 0 ? (
                                <p className="text-center py-10 text-sm" style={{ color: "var(--cor-texto-suave)" }}>
                                    Nenhum conteúdo ainda.
                                </p>
                            ) : (
                                <div className="grid grid-cols-3 gap-1">
                                    {postsTrending.map((post) => (
                                        <PostGrid key={post.id} post={post} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Sidebar paginaAtiva="buscar" />
        </div>
    );
}

function PostGrid({ post }: { post: Post }) {
    return (
        <div
            className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer"
            style={{ background: "var(--bg-card)" }}
        >
            {post.imagem_url ? (
                <img src={post.imagem_url} alt="" className="w-full h-full object-cover" />
            ) : (
                <div
                    className="w-full h-full flex items-center justify-center p-2 text-center text-xs"
                    style={{ color: "var(--cor-texto-suave)" }}
                >
                    {post.conteudo}
                </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-white/30 overflow-hidden">
                        {post.perfis?.avatar_url && (
                            <img src={post.perfis.avatar_url} alt="" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <span className="text-white text-[10px] font-medium truncate">{post.perfis?.nome}</span>
                </div>
            </div>
        </div>
    );
}