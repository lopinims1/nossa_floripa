"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/asidebar";
import { useTema } from "@/lib/ThemeContext";
import {
  Palette, Bell, Lock, Trash2, LogOut, ChevronRight, Check
} from "lucide-react";

type Secao = "tema" | "notificacoes" | "privacidade" | "conta";

const temas = [
  { id: "floripa", nome: "Floripa (padrão)", bg: "#FFF5E7", verde: "#3C5E45", descricao: "Bege quente com verde floresta" },
  { id: "escuro", nome: "Modo escuro", bg: "#1a1a1a", verde: "#5a9e6f", descricao: "Escuro com verde suave" },
  { id: "oceano", nome: "Oceano", bg: "#E8F4F8", verde: "#1a6b8a", descricao: "Azul claro com azul profundo" },
  { id: "aurora", nome: "Aurora", bg: "#F8E8F4", verde: "#8a1a6b", descricao: "Rosa claro com roxo vibrante" },
];

export default function DesktopLayout() {
  const router = useRouter();
  const { tema, setTema } = useTema();
  const [secaoAtiva, setSecaoAtiva] = useState<Secao>("tema");
  const [notifPost, setNotifPost] = useState(true);
  const [notifEvento, setNotifEvento] = useState(true);
  const [notifSeguidor, setNotifSeguidor] = useState(false);
  const [perfilPrivado, setPerfilPrivado] = useState(false);
  const [confirmandoDelete, setConfirmandoDelete] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function deletarConta() {
    if (!confirmandoDelete) {
      setConfirmandoDelete(true);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("perfis").delete().eq("id", user.id);
    await supabase.auth.signOut();
    router.push("/login");
  }

  const secoes = [
    { id: "tema" as Secao, label: "Aparência", icone: Palette },
    { id: "notificacoes" as Secao, label: "Notificações", icone: Bell },
    { id: "privacidade" as Secao, label: "Privacidade", icone: Lock },
    { id: "conta" as Secao, label: "Conta", icone: Trash2 },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#FFF5E7] overflow-hidden">
      <Sidebar paginaAtiva="config" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-[#3C5E45] text-2xl font-semibold mb-8">Configurações</h1>

          <div className="flex gap-6">
            {/* Menu lateral */}
            <div className="w-48 flex-shrink-0">
              <nav className="flex flex-col gap-1">
                {secoes.map(({ id, label, icone: Icone }) => (
                  <button
                    key={id}
                    onClick={() => setSecaoAtiva(id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${secaoAtiva === id
                        ? "bg-[#3C5E45] text-white"
                        : "text-[#3C5E45] hover:bg-[#3C5E45]/10"
                      }`}
                  >
                    <Icone className="w-4 h-4" />
                    {label}
                  </button>
                ))}

                <div className="border-t border-[#C8A97E] my-2" />

                <button
                  onClick={sair}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </nav>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 bg-white rounded-2xl border border-[#E8D5C0] p-6">

              {/* TEMA */}
              {secaoAtiva === "tema" && (
                <div>
                  <h2 className="text-[#3C5E45] font-semibold text-lg mb-1">Aparência</h2>
                  <p className="text-[#A89070] text-sm mb-6">Escolha o tema visual do app.</p>

                  <div className="grid grid-cols-2 gap-3">
                    {temas.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTema(t.id as any)}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${tema === t.id ? "border-[#3C5E45]" : "border-[#E8D5C0] hover:border-[#C8A97E]"
                          }`}
                      >
                        {/* Preview */}
                        <div
                          className="w-full h-12 rounded-lg mb-3 flex items-center px-3 gap-2"
                          style={{ backgroundColor: t.bg }}
                        >
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.verde }} />
                          <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: t.verde + "40" }} />
                        </div>
                        <p className="font-medium text-[#3C5E45] text-sm">{t.nome}</p>
                        <p className="text-xs text-[#A89070] mt-0.5">{t.descricao}</p>
                        {tema === t.id && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-[#3C5E45] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* NOTIFICAÇÕES */}
              {secaoAtiva === "notificacoes" && (
                <div>
                  <h2 className="text-[#3C5E45] font-semibold text-lg mb-1">Notificações</h2>
                  <p className="text-[#A89070] text-sm mb-6">Gerencie o que você quer receber.</p>

                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Curtidas e comentários nos seus posts", sub: "Quando alguém interage com suas publicações", val: notifPost, set: setNotifPost },
                      { label: "Novos eventos", sub: "Quando um evento for publicado perto de você", val: notifEvento, set: setNotifEvento },
                      { label: "Novos seguidores", sub: "Quando alguém começa a te seguir", val: notifSeguidor, set: setNotifSeguidor },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#F0E8DE]">
                        <div>
                          <p className="text-sm font-medium text-[#3C5E45]">{item.label}</p>
                          <p className="text-xs text-[#A89070] mt-0.5">{item.sub}</p>
                        </div>
                        <button
                          onClick={() => item.set(!item.val)}
                          className={`w-11 h-6 rounded-full transition-all relative ${item.val ? "bg-[#3C5E45]" : "bg-[#C8A97E]"
                            }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${item.val ? "left-6" : "left-1"
                            }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRIVACIDADE */}
              {secaoAtiva === "privacidade" && (
                <div>
                  <h2 className="text-[#3C5E45] font-semibold text-lg mb-1">Privacidade</h2>
                  <p className="text-[#A89070] text-sm mb-6">Controle quem pode ver seu conteúdo.</p>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between py-3 border-b border-[#F0E8DE]">
                      <div>
                        <p className="text-sm font-medium text-[#3C5E45]">Perfil privado</p>
                        <p className="text-xs text-[#A89070] mt-0.5">Somente seguidores aprovados veem seus posts</p>
                      </div>
                      <button
                        onClick={() => setPerfilPrivado(!perfilPrivado)}
                        className={`w-11 h-6 rounded-full transition-all relative ${perfilPrivado ? "bg-[#3C5E45]" : "bg-[#C8A97E]"
                          }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${perfilPrivado ? "left-6" : "left-1"
                          }`} />
                      </button>
                    </div>
                    <div className="py-3">
                      <p className="text-sm text-[#A89070]">
                        Mais opções de privacidade em breve — bloqueio de usuários, controle de comentários e muito mais.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTA */}
              {secaoAtiva === "conta" && (
                <div>
                  <h2 className="text-[#3C5E45] font-semibold text-lg mb-1">Conta</h2>
                  <p className="text-[#A89070] text-sm mb-6">Gerencie os dados da sua conta.</p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => router.push("/perfil")}
                      className="flex items-center justify-between w-full py-3 px-4 rounded-xl border border-[#E8D5C0] hover:border-[#3C5E45] transition-all text-left"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#3C5E45]">Editar perfil</p>
                        <p className="text-xs text-[#A89070]">Nome, bio, foto e username</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A89070]" />
                    </button>

                    <div className="border-t border-[#F0E8DE] my-2" />

                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-red-600 mb-1">Zona de perigo</p>
                      <p className="text-xs text-red-400 mb-4">Esta ação é irreversível. Todos os seus dados serão apagados permanentemente.</p>
                      <button
                        onClick={deletarConta}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${confirmandoDelete
                            ? "bg-red-500 text-white"
                            : "bg-white text-red-500 border border-red-300 hover:bg-red-50"
                          }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        {confirmandoDelete ? "Confirmar exclusão" : "Deletar conta"}
                      </button>
                      {confirmandoDelete && (
                        <button
                          onClick={() => setConfirmandoDelete(false)}
                          className="ml-2 text-xs text-[#A89070] underline mt-2"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}