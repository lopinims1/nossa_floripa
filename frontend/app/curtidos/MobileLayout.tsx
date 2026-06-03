"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/asidebar";
import { Heart } from "lucide-react";

type Post = {
  id: string;
  conteudo: string;
  imagem_url: string | null;
  created_at: string;
  perfis: { nome: string; username: string; avatar_url: string | null };
};

export default function MobileLayout() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("curtidas")
        .select("post_id, posts(id, conteudo, imagem_url, created_at, perfis(nome, username, avatar_url))")
        .eq("usuario_id", user.id)
        .order("created_at", { ascending: false });

      setPosts((data?.map((c: any) => c.posts).filter(Boolean) || []) as Post[]);
      setCarregando(false);
    }
    carregar();
  }, []);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-feed)" }}
    >
      {/* Main content — flex-1 to fill space left of sidebar */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-3 py-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5 px-1">
            <Heart
              className="w-5 h-5"
              style={{ color: "var(--cor-primaria)", fill: "var(--cor-primaria)" }}
            />
            <h1
              className="text-lg font-semibold"
              style={{ color: "var(--cor-primaria)" }}
            >
              Posts curtidos
            </h1>
          </div>

          {/* Loading */}
          {carregando && (
            <p
              className="text-center py-16 text-sm"
              style={{ color: "var(--cor-texto-suave)" }}
            >
              Carregando...
            </p>
          )}

          {/* Empty state */}
          {!carregando && posts.length === 0 && (
            <div className="text-center py-16">
              <Heart
                className="w-10 h-10 mx-auto mb-3"
                style={{ color: "var(--cor-borda)" }}
              />
              <p className="text-sm" style={{ color: "var(--cor-texto-suave)" }}>
                Você ainda não curtiu nenhum post.
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--cor-borda)" }}>
                Explore o feed e curta o que gostar!
              </p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer"
                style={{ backgroundColor: "var(--bg-card)" }}
              >
                {post.imagem_url ? (
                  <img
                    src={post.imagem_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-2 text-center text-xs"
                    style={{ color: "var(--cor-texto-suave)" }}
                  >
                    {post.conteudo}
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-white/30 overflow-hidden flex-shrink-0">
                      {post.perfis?.avatar_url && (
                        <img
                          src={post.perfis.avatar_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-white text-xs font-medium truncate">
                      {post.perfis?.nome}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sidebar fixed to the right, same as other mobile layouts */}
      <Sidebar paginaAtiva="curtidos" />
    </div>
  );
}