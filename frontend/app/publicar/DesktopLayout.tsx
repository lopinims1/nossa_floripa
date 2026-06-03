"use client";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Asidebar from "@/components/asidebar";
import { supabase } from "@/lib/supabase";

type Tipo = "post" | "ajuda" | "evento";

export default function PublicarDesktopLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoInicial = (searchParams.get("tipo") as Tipo) ?? "post";

  const [tipo, setTipo] = useState<Tipo>(tipoInicial);
  const [conteudo, setConteudo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [local, setLocal] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [pontosRecompensa, setPontosRecompensa] = useState(0);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [publicando, setPublicando] = useState(false);
  const [erro, setErro] = useState("");
  const inputImagemRef = useRef<HTMLInputElement>(null);

  const handleImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagemFile(file);
    setImagemPreview(URL.createObjectURL(file));
  };

  const uploadImagem = async (userId: string): Promise<string | null> => {
    if (!imagemFile) return null;
    const ext = imagemFile.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("posts").upload(path, imagemFile, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from("posts").getPublicUrl(path);
    return data.publicUrl;
  };

  const publicar = async () => {
    setErro("");
    if (tipo === "evento" && !titulo) { setErro("Preencha o título do evento."); return; }
    if (!conteudo && tipo !== "evento") { setErro("Escreva algo antes de publicar."); return; }

    setPublicando(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErro("Você precisa estar logado."); setPublicando(false); return; }

    const imagem_url = await uploadImagem(user.id);

    if (tipo === "evento") {
      const { error } = await supabase.from("eventos").insert({
        criador_id: user.id,
        titulo,
        descricao: conteudo,
        imagem_url,
        local,
        data_evento: dataEvento || null,
        tipo: "evento",
        pontos_recompensa: pontosRecompensa,
      });
      if (error) { setErro("Erro ao criar evento."); setPublicando(false); return; }
    } else {
      const { error } = await supabase.from("posts").insert({
        autor_id: user.id,
        conteudo,
        imagem_url,
        tipo,
      });
      if (error) { setErro("Erro ao publicar."); setPublicando(false); return; }

      // Ajuda semanal ganha 300 FloriPoints
      if (tipo === "ajuda") {
        await supabase.rpc("incrementar_floripoints", { user_id: user.id, quantidade: 300 }).catch(() => {
          // Se não tiver a função RPC, atualiza direto
          supabase.from("perfis").select("floripoints").eq("id", user.id).single().then(({ data }) => {
            if (data) supabase.from("perfis").update({ floripoints: (data.floripoints ?? 0) + 300 }).eq("id", user.id);
          });
        });
      }
    }

    setPublicando(false);
    router.push("/");
  };

  const abas: { key: Tipo; label: string; emoji: string }[] = [
    { key: "post", label: "Post no feed", emoji: "📸" },
    { key: "ajuda", label: "Ajuda semanal", emoji: "🌟" },
    { key: "evento", label: "Criar evento", emoji: "📅" },
  ];

  return (
    <div className="flex bg-[var(--bg-sidebar)] w-screen h-screen overflow-hidden font-sans">
      <Asidebar />
      <div className="flex-1 bg-[var(--bg-feed)] overflow-y-auto">
        <div className="max-w-2xl mx-auto py-10 px-6">

          <h1 className="font-black text-2xl text-[var(--cor-texto)] mb-6">Publicar</h1>

          {/* Abas */}
          <div className="flex gap-2 mb-8">
            {abas.map((a) => (
              <button
                key={a.key}
                onClick={() => { setTipo(a.key); setErro(""); }}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border
                  ${tipo === a.key
                    ? "bg-[var(--cor-primaria)] text-white border-transparent"
                    : "border-[var(--cor-borda)] text-[var(--cor-texto-suave)] hover:bg-[var(--bg-card)]"
                  }`}
              >
                {a.emoji} {a.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">

            {/* Título (só evento) */}
            {tipo === "evento" && (
              <div>
                <label className="text-xs font-semibold text-[var(--cor-texto-suave)] mb-1 block">Título do evento *</label>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Nome do evento"
                  className="w-full border border-[var(--cor-borda)] bg-transparent rounded-xl px-4 py-3 text-sm text-[var(--cor-texto)] outline-none focus:border-[var(--cor-primaria)] transition"
                />
              </div>
            )}

            {/* Conteúdo / Descrição */}
            <div>
              <label className="text-xs font-semibold text-[var(--cor-texto-suave)] mb-1 block">
                {tipo === "post" ? "O que você fez de bom hoje? 🌱" : tipo === "ajuda" ? "Descreva como você ajudou 🌟" : "Descrição do evento"}
              </label>
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                rows={5}
                placeholder={
                  tipo === "post" ? "Compartilhe uma boa ação com a comunidade..."
                  : tipo === "ajuda" ? "Conte como você ajudou alguém essa semana..."
                  : "O que vai acontecer no evento?"
                }
                className="w-full border border-[var(--cor-borda)] bg-transparent rounded-xl px-4 py-3 text-sm text-[var(--cor-texto)] outline-none focus:border-[var(--cor-primaria)] transition resize-none"
              />
            </div>

            {/* Local e Data (só evento) */}
            {tipo === "evento" && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-[var(--cor-texto-suave)] mb-1 block">Local</label>
                  <input
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    placeholder="Ex: Lagoa da Conceição"
                    className="w-full border border-[var(--cor-borda)] bg-transparent rounded-xl px-4 py-3 text-sm text-[var(--cor-texto)] outline-none focus:border-[var(--cor-primaria)] transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-[var(--cor-texto-suave)] mb-1 block">Data e hora</label>
                  <input
                    type="datetime-local"
                    value={dataEvento}
                    onChange={(e) => setDataEvento(e.target.value)}
                    className="w-full border border-[var(--cor-borda)] bg-transparent rounded-xl px-4 py-3 text-sm text-[var(--cor-texto)] outline-none focus:border-[var(--cor-primaria)] transition"
                  />
                </div>
              </div>
            )}

            {/* Pontos recompensa (só evento) */}
            {tipo === "evento" && (
              <div>
                <label className="text-xs font-semibold text-[var(--cor-texto-suave)] mb-1 block">FloriPoints de recompensa</label>
                <input
                  type="number"
                  value={pontosRecompensa}
                  onChange={(e) => setPontosRecompensa(Number(e.target.value))}
                  min={0}
                  placeholder="Ex: 100"
                  className="w-full border border-[var(--cor-borda)] bg-transparent rounded-xl px-4 py-3 text-sm text-[var(--cor-texto)] outline-none focus:border-[var(--cor-primaria)] transition"
                />
              </div>
            )}

            {/* Upload de imagem */}
            <div>
              <label className="text-xs font-semibold text-[var(--cor-texto-suave)] mb-1 block">Imagem (opcional)</label>
              <div
                onClick={() => inputImagemRef.current?.click()}
                className="w-full border-2 border-dashed border-[var(--cor-borda)] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--cor-primaria)] transition"
              >
                {imagemPreview
                  ? <img src={imagemPreview} className="max-h-48 rounded-lg object-cover" />
                  : <>
                    <span className="text-3xl mb-2">🖼️</span>
                    <p className="text-sm text-[var(--cor-texto-suave)]">Clique para adicionar uma foto</p>
                  </>
                }
              </div>
              <input ref={inputImagemRef} type="file" accept="image/*" onChange={handleImagem} className="hidden" />
              {imagemPreview && (
                <button onClick={() => { setImagemFile(null); setImagemPreview(null); }} className="text-xs text-red-400 mt-1 hover:opacity-70">
                  Remover imagem
                </button>
              )}
            </div>

            {/* Aviso ajuda semanal */}
            {tipo === "ajuda" && (
              <div className="bg-[var(--bg-card)] border border-[var(--cor-borda)] rounded-xl p-4 text-sm text-[var(--cor-texto-suave)]">
                🌟 Você ganha <strong className="text-[var(--cor-primaria)]">300 FloriPoints</strong> por semana ao publicar uma ajuda. Só vale uma por semana!
              </div>
            )}

            {/* Erro */}
            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            {/* Botões */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => router.back()}
                className="flex-1 border border-[var(--cor-borda)] py-3 rounded-xl text-sm text-[var(--cor-texto)] hover:bg-[var(--bg-card)] transition"
              >
                Cancelar
              </button>
              <button
                onClick={publicar}
                disabled={publicando}
                className="flex-1 bg-[var(--cor-primaria)] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-60 transition"
              >
                {publicando ? "Publicando..." : tipo === "evento" ? "Criar evento" : "Publicar"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}