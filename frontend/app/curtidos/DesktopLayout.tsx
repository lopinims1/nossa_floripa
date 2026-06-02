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

export default function CurtidosDesktopLayout() {
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
    <div className="flex h-screen w-screen bg-[#FFF5E7] overflow-hidden">
      <Sidebar paginaAtiva="curtidos" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-6 h-6 text-[#3C5E45] fill-[#3C5E45]" />
            <h1 className="text-[#3C5E45] text-2xl font-semibold">Posts curtidos</h1>
          </div>

          {carregando && <p className="text-center text-[#A89070] py-16">Carregando...</p>}

          {!carregando && posts.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-[#C8A97E] mx-auto mb-3" />
              <p className="text-[#A89070]">Você ainda não curtiu nenhum post.</p>
              <p className="text-sm text-[#C8A97E] mt-1">Explore o feed e curta o que gostar!</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square rounded-xl overflow-hidden bg-[#E8D5C0] relative group cursor-pointer"
              >
                {post.imagem_url ? (
                  <img src={post.imagem_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 text-center text-sm text-[#6B6B6B]">
                    {post.conteudo}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/30 overflow-hidden flex-shrink-0">
                      {post.perfis?.avatar_url && (
                        <img src={post.perfis.avatar_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-white text-xs font-medium truncate">{post.perfis?.nome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}