"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/app/login/public/Icons/Logo.svg";
import Google from "@/app/login/public/Icons/GoogleIcon.svg";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const erroAmigavel = (msg: string) => {
    if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
    if (msg.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
    if (msg.includes("User not found") || msg.includes("No user found")) return "Nenhuma conta encontrada com esse e-mail.";
    if (msg.includes("too many requests")) return "Muitas tentativas. Aguarde alguns minutos.";
    return "Erro ao entrar. Tente novamente.";
};

export default function MobileLayout() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function handleLogin() {
        setErro("");
        if (!email || !senha) { setErro("Preencha e-mail e senha."); return; }
        setCarregando(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) { setErro(erroAmigavel(error.message)); setCarregando(false); return; }
        setCarregando(false);
        router.push("/");
    }

    async function handleGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin + "/" }
        });
    }

    return (
        <div className="bg-[#2A3D2F] flex justify-center items-center h-screen w-screen">
            <div className="bg-[#FFF4F0] rounded-2xl p-7 flex flex-col gap-7 dropshadow-2xl min-w-[30rem] min-h-[60rem]">

                <div className="flex items-center justify-center gap-2">
                    <span className="flex items-center gap-2 text-[#3C5E45] text-lg font-semibold">
                        <img src={Logo.src} alt="" className="w-8" /> Nossa Floripa
                    </span>
                </div>

                <div className="flex flex-col items-center text-center gap-6 pt-14">
                    <h1 className="text-[#3C5E45] text-4xl font-semibold pb-16">Bem vindo à <br /> Floripa</h1>

                    <input
                        type="email"
                        placeholder="Digite o seu e-mail"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErro(""); }}
                        className={`p-3.5 rounded-lg border placeholder:text-[#6B6B6B] text-xl min-w-full ${erro ? "border-red-400" : "border-[#A1A1A1]"}`}
                    />

                    <input
                        type="password"
                        placeholder="Digite a sua senha"
                        value={senha}
                        onChange={(e) => { setSenha(e.target.value); setErro(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className={`p-3.5 rounded-lg border placeholder:text-[#6B6B6B] text-xl min-w-full ${erro ? "border-red-400" : "border-[#A1A1A1]"}`}
                    />

                    {erro && (
                        <p className="text-red-500 text-sm w-full text-left -mt-3">{erro}</p>
                    )}

                    <a href="#" className="underline underline-offset-2 text-[#3C5E45]">Esqueceu a senha?</a>

                    <div className="flex items-center justify-center py-4">
                        <button onClick={handleGoogle} className="text-[#6B6B6B] flex items-center gap-2 text-xl">
                            <img src={Google.src} className="w-9" />
                            Google
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 min-w-full">
                        <button
                            onClick={handleLogin}
                            disabled={carregando}
                            className="bg-[#3C5E45] text-[#FFF4F0] text-2xl font-semibold p-4 rounded-lg disabled:opacity-60">
                            {carregando ? "ENTRANDO..." : "ENTRAR"}
                        </button>

                        <div>
                            <span className="text-lg">Não tem uma conta? <Link href="/register" className="underline underline-offset-2 text-[#3C5E45]">Registre-se</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}