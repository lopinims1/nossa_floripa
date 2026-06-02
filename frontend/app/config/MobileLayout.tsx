"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/asidebar";
import { useTema, temas as temasObj } from "@/lib/ThemeContext";
import {
    Palette, Bell, Lock, Trash2, LogOut, ChevronRight, Check, ChevronLeft
} from "lucide-react";

type Secao = "tema" | "notificacoes" | "privacidade" | "conta";

const temas = [
    { id: "floripa", nome: "Floripa (padrão)", descricao: "Bege quente com verde floresta" },
    { id: "noturno", nome: "Modo noturno", descricao: "Escuro com verde suave" },
    { id: "oceano", nome: "Oceano", descricao: "Azul claro com azul profundo" },
    { id: "urbano", nome: "Urbano", descricao: "Escuro com dourado vibrante" },
];

export default function MobileLayout() {
    const router = useRouter();
    const { tema, setTema } = useTema();
    const [secaoAtiva, setSecaoAtiva] = useState<Secao | null>(null);
    const [notifPost, setNotifPost] = useState(true);
    const [notifEvento, setNotifEvento] = useState(true);
    const [notifSeguidor, setNotifSeguidor] = useState(false);
    const [perfilPrivado, setPerfilPrivado] = useState(false);
    const [confirmandoDelete, setConfirmandoDelete] = useState(false);

    async function sair() {
        await supabase.auth.signOut();
        router.push("/login");
    }

    async function deletarConta() {
        if (!confirmandoDelete) { setConfirmandoDelete(true); return; }
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

    // Toggle helper
    const Toggle = ({ val, set }: { val: boolean; set: (v: boolean) => void }) => (
        <button
            onClick={() => set(!val)}
            className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
            style={{ background: val ? "var(--cor-primaria)" : "var(--cor-borda)" }}
        >
            <div
                className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
                style={{ left: val ? "1.375rem" : "0.25rem" }}
            />
        </button>
    );

    return (
        <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--bg-feed)" }}>

            <main className="flex-1 overflow-y-auto overflow-x-hidden">

                {/* — LISTA DE SEÇÕES (quando nenhuma está aberta) — */}
                {!secaoAtiva && (
                    <div className="px-4 pt-6 pb-4">
                        <h1 className="font-semibold text-xl mb-6" style={{ color: "var(--cor-texto)" }}>
                            Configurações
                        </h1>

                        <nav className="flex flex-col gap-2">
                            {secoes.map(({ id, label, icone: Icone }) => (
                                <button
                                    key={id}
                                    onClick={() => setSecaoAtiva(id)}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left"
                                    style={{ background: "var(--bg-main)", borderColor: "var(--cor-borda)" }}
                                >
                                    <Icone className="w-4 h-4 flex-shrink-0" style={{ color: "var(--cor-primaria)" } as any} />
                                    <span className="flex-1 text-sm font-medium" style={{ color: "var(--cor-texto)" }}>{label}</span>
                                    <ChevronRight className="w-4 h-4" style={{ color: "var(--cor-texto-suave)" } as any} />
                                </button>
                            ))}

                            <div className="my-1" style={{ borderTop: "1px solid var(--cor-borda)" }} />

                            <button
                                onClick={sair}
                                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left"
                                style={{ background: "var(--bg-main)", borderColor: "var(--cor-borda)" }}
                            >
                                <LogOut className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-red-500">Sair</span>
                            </button>
                        </nav>
                    </div>
                )}

                {/* — SEÇÃO ABERTA — */}
                {secaoAtiva && (
                    <div className="px-4 pt-5 pb-6">
                        {/* Header com voltar */}
                        <button
                            onClick={() => setSecaoAtiva(null)}
                            className="flex items-center gap-1 mb-5 transition-opacity hover:opacity-70"
                            style={{ color: "var(--cor-primaria)" }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Configurações</span>
                        </button>

                        <div
                            className="rounded-2xl border p-5"
                            style={{ background: "var(--bg-main)", borderColor: "var(--cor-borda)" }}
                        >

                            {/* TEMA */}
                            {secaoAtiva === "tema" && (
                                <div>
                                    <h2 className="font-semibold text-lg mb-1" style={{ color: "var(--cor-texto)" }}>Aparência</h2>
                                    <p className="text-sm mb-5" style={{ color: "var(--cor-texto-suave)" }}>Escolha o tema visual do app.</p>

                                    <div className="flex flex-col gap-3">
                                        {temas.map((t) => {
                                            const vars = temasObj[t.id as keyof typeof temasObj];
                                            const bgPreview = vars?.["--bg-feed"] ?? "#fff";
                                            const corPreview = vars?.["--cor-primaria"] ?? "#000";
                                            const ativo = tema === t.id;
                                            return (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTema(t.id as any)}
                                                    className="flex items-center gap-4 p-3.5 rounded-xl border-2 text-left transition-all"
                                                    style={{ borderColor: ativo ? "var(--cor-primaria)" : "var(--cor-borda)" }}
                                                >
                                                    {/* Mini preview */}
                                                    <div
                                                        className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
                                                        style={{ background: bgPreview }}
                                                    >
                                                        <div className="w-5 h-5 rounded-full" style={{ background: corPreview }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium" style={{ color: "var(--cor-texto)" }}>{t.nome}</p>
                                                        <p className="text-xs mt-0.5" style={{ color: "var(--cor-texto-suave)" }}>{t.descricao}</p>
                                                    </div>
                                                    {ativo && (
                                                        <div
                                                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                                            style={{ background: "var(--cor-primaria)" }}
                                                        >
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* NOTIFICAÇÕES */}
                            {secaoAtiva === "notificacoes" && (
                                <div>
                                    <h2 className="font-semibold text-lg mb-1" style={{ color: "var(--cor-texto)" }}>Notificações</h2>
                                    <p className="text-sm mb-5" style={{ color: "var(--cor-texto-suave)" }}>Gerencie o que você quer receber.</p>

                                    <div className="flex flex-col gap-1">
                                        {[
                                            { label: "Curtidas e comentários", sub: "Quando alguém interage com suas publicações", val: notifPost, set: setNotifPost },
                                            { label: "Novos eventos", sub: "Quando um evento for publicado perto de você", val: notifEvento, set: setNotifEvento },
                                            { label: "Novos seguidores", sub: "Quando alguém começa a te seguir", val: notifSeguidor, set: setNotifSeguidor },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between py-3.5"
                                                style={{ borderBottom: "1px solid var(--cor-borda)" }}
                                            >
                                                <div className="flex-1 min-w-0 pr-3">
                                                    <p className="text-sm font-medium" style={{ color: "var(--cor-texto)" }}>{item.label}</p>
                                                    <p className="text-xs mt-0.5" style={{ color: "var(--cor-texto-suave)" }}>{item.sub}</p>
                                                </div>
                                                <Toggle val={item.val} set={item.set} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PRIVACIDADE */}
                            {secaoAtiva === "privacidade" && (
                                <div>
                                    <h2 className="font-semibold text-lg mb-1" style={{ color: "var(--cor-texto)" }}>Privacidade</h2>
                                    <p className="text-sm mb-5" style={{ color: "var(--cor-texto-suave)" }}>Controle quem pode ver seu conteúdo.</p>

                                    <div
                                        className="flex items-center justify-between py-3.5"
                                        style={{ borderBottom: "1px solid var(--cor-borda)" }}
                                    >
                                        <div className="flex-1 min-w-0 pr-3">
                                            <p className="text-sm font-medium" style={{ color: "var(--cor-texto)" }}>Perfil privado</p>
                                            <p className="text-xs mt-0.5" style={{ color: "var(--cor-texto-suave)" }}>
                                                Somente seguidores aprovados veem seus posts
                                            </p>
                                        </div>
                                        <Toggle val={perfilPrivado} set={setPerfilPrivado} />
                                    </div>

                                    <p className="text-xs mt-4" style={{ color: "var(--cor-texto-suave)" }}>
                                        Mais opções em breve — bloqueio de usuários, controle de comentários e muito mais.
                                    </p>
                                </div>
                            )}

                            {/* CONTA */}
                            {secaoAtiva === "conta" && (
                                <div>
                                    <h2 className="font-semibold text-lg mb-1" style={{ color: "var(--cor-texto)" }}>Conta</h2>
                                    <p className="text-sm mb-5" style={{ color: "var(--cor-texto-suave)" }}>Gerencie os dados da sua conta.</p>

                                    <button
                                        onClick={() => router.push("/perfil")}
                                        className="flex items-center justify-between w-full py-3.5 px-4 rounded-xl border transition-all text-left mb-4"
                                        style={{ borderColor: "var(--cor-borda)", background: "var(--bg-card)" }}
                                    >
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: "var(--cor-texto)" }}>Editar perfil</p>
                                            <p className="text-xs mt-0.5" style={{ color: "var(--cor-texto-suave)" }}>Nome, bio, foto e username</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--cor-texto-suave)" } as any} />
                                    </button>

                                    <div className="rounded-xl p-4 bg-red-50 border border-red-200">
                                        <p className="text-sm font-medium text-red-600 mb-1">Zona de perigo</p>
                                        <p className="text-xs text-red-400 mb-4">
                                            Esta ação é irreversível. Todos os seus dados serão apagados permanentemente.
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                onClick={deletarConta}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${confirmandoDelete ? "bg-red-500 text-white" : "bg-white text-red-500 border border-red-300"
                                                    }`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {confirmandoDelete ? "Confirmar exclusão" : "Deletar conta"}
                                            </button>
                                            {confirmandoDelete && (
                                                <button
                                                    onClick={() => setConfirmandoDelete(false)}
                                                    className="text-xs text-red-400 underline"
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
                )}
            </main>

            <Sidebar paginaAtiva="config" />
        </div>
    );
}