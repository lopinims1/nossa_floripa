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

export default function DesktopLayout() {
  const [query, setQuery] = useState("");
  const [filtroBusca, setFiltroBusca] = useState<FiltroBusca>("contas");
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsTrending, setPostsTrending] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carrega trending ao montar
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

  // Busca ao digitar
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
    <div className="flex h-screen w-screen bg-[#FFF5E7] overflow-hidden">
      <Sidebar/>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">

          {/* Campo de busca */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3C5E45] w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full bg-white border border-[#C8A97E] rounded-xl pl-12 pr-10 py-3.5 text-[#3C5E45] placeholder-[#A89070] outline-none focus:border-[#3C5E45] transition-colors text-base"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A89070] hover:text-[#3C5E45] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtro "Procurar por" */}
          <div className="flex gap-3 mb-8">
            <span className="text-sm text-[#A89070] self-center">Procurar por:</span>
            <button
              onClick={() => setFiltroBusca("contas")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${filtroBusca === "contas"
                  ? "bg-[#3C5E45] text-white border-[#3C5E45]"
                  : "bg-white text-[#3C5E45] border-[#C8A97E] hover:border-[#3C5E45]"
                }`}
            >
              <User className="w-3.5 h-3.5" /> Contas
            </button>
            <button
              onClick={() => setFiltroBusca("videos")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${filtroBusca === "videos"
                  ? "bg-[#3C5E45] text-white border-[#3C5E45]"
                  : "bg-white text-[#3C5E45] border-[#C8A97E] hover:border-[#3C5E45]"
                }`}
            >
              <Film className="w-3.5 h-3.5" /> Posts
            </button>
          </div>

          {/* Estado: buscando */}
          {carregando && (
            <p className="text-center text-[#A89070] py-12">Buscando...</p>
          )}

          {/* Resultados de contas */}
          {mostrando && !carregando && filtroBusca === "contas" && (
            <>
              {perfis.length === 0 ? (
                <p className="text-center text-[#A89070] py-12">Nenhuma conta encontrada.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {perfis.map((p) => (
                    <a
                      key={p.id}
                      href={`/perfil/${p.username}`}
                      className="flex items-center gap-4 bg-white rounded-xl p-4 border border-[#E8D5C0] hover:border-[#3C5E45] transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#3C5E45]/20 overflow-hidden flex-shrink-0">
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt={p.nome} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#3C5E45] font-bold text-lg">
                            {p.nome?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#3C5E45] truncate">{p.nome}</p>
                        <p className="text-sm text-[#A89070]">@{p.username}</p>
                        {p.bio && <p className="text-sm text-[#6B6B6B] truncate mt-0.5">{p.bio}</p>}
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
                <p className="text-center text-[#A89070] py-12">Nenhum post encontrado.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="aspect-square rounded-xl overflow-hidden bg-[#E8D5C0] relative group cursor-pointer"
                    >
                      {post.imagem_url ? (
                        <img src={post.imagem_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-3 text-center text-sm text-[#6B6B6B]">
                          {post.conteudo}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/30 overflow-hidden">
                            {post.perfis?.avatar_url && (
                              <img src={post.perfis.avatar_url} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="text-white text-xs font-medium">{post.perfis?.nome}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Estado inicial: trending / explorar */}
          {!mostrando && (
            <>
              <h2 className="text-[#3C5E45] font-semibold text-lg mb-4">Explorar</h2>
              {postsTrending.length === 0 ? (
                <p className="text-center text-[#A89070] py-12">Nenhum conteúdo ainda.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {postsTrending.map((post) => (
                    <div
                      key={post.id}
                      className="aspect-square rounded-xl overflow-hidden bg-[#E8D5C0] relative group cursor-pointer"
                    >
                      {post.imagem_url ? (
                        <img src={post.imagem_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-3 text-center text-sm text-[#6B6B6B]">
                          {post.conteudo}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/30 overflow-hidden">
                            {post.perfis?.avatar_url && (
                              <img src={post.perfis.avatar_url} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="text-white text-xs font-medium">{post.perfis?.nome}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}