"use client";
import { Merriweather, Merriweather_Sans } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/app/login/public/Icons/Logo.svg";
import row1 from "@/app/login/public/row1.png";
import row2 from "@/app/login/public/row2.png";
import row3 from "@/app/login/public/row3.png";
import Google from "@/app/login/public/Icons/GoogleIcon.svg";
import { supabase } from "@/lib/supabase";

const merriweather = Merriweather({ subsets: ["latin"], weight: ["600"] });
const merriweatherSans = Merriweather_Sans({ subsets: ["latin"], weight: ["600"] });

const imagens = [row1, row2, row3];

const erroAmigavel = (msg: string) => {
    if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
    if (msg.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
    if (msg.includes("User not found") || msg.includes("No user found")) return "Nenhuma conta encontrada com esse e-mail.";
    if (msg.includes("too many requests")) return "Muitas tentativas. Aguarde alguns minutos.";
    return "Erro ao entrar. Tente novamente.";
};

export default function DesktopLayout() {
    const [imagemAtual, setImagemAtual] = useState(0);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const t = setInterval(() => setImagemAtual((p) => (p + 1) % imagens.length), 4000);
        return () => clearInterval(t);
    }, []);

    async function handleLogin() {
        setErro("");
        if (!email || !senha) { setErro("Preencha e-mail e senha."); return; }
        setCarregando(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) { setErro(erroAmigavel(error.message)); setCarregando(false); return; }
        await supabase.auth.getSession();
        setCarregando(false);
        window.location.href = "/";
    }

    async function handleGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin + "/" }
        });
    }

    const inputBase =
        "w-full border bg-transparent rounded-sm px-4 py-3 text-lg text-[#3C5E45] placeholder-[#A89070] outline-none focus:border-[#3C5E45] transition-colors";

    return (
        <div className="flex bg-[#FFF5E7] dark:bg-black h-screen w-screen p-10">
            <div className="flex items-center justify-between max-w-400 w-full pl-5 pr-15 mx-auto">

                <div className="relative w-210 overflow-hidden">
                    {imagens.map((img, i) => (
                        <img key={i} src={img.src} alt=""
                            className={`w-full absolute top-0 left-0 transition-opacity duration-700 ${i === imagemAtual ? "opacity-100" : "opacity-0"}`}
                        />
                    ))}
                    <img src={imagens[0].src} className="w-full invisible" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {imagens.map((_, i) => (
                            <button key={i} onClick={() => setImagemAtual(i)}
                                className={`h-2 rounded-full transition-all ${i === imagemAtual ? "bg-white w-5" : "bg-white/50 w-2"}`} />
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-center w-full max-w-lg mb-30">
                    <div className="flex flex-col gap-7 w-full">

                        <div className="flex items-center justify-center gap-3">
                            <img src={Logo.src} alt="" className="w-12" />
                            <h1 className={`text-2xl text-[#3C5E45] ${merriweather.className}`}>Nossa floripa</h1>
                        </div>

                        <h1 className={`text-[#3C5E45] text-5xl text-center mb-10 ${merriweatherSans.className}`}>
                            BEM VINDO À <br /> FLORIPA
                        </h1>

                        <div className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Digite o seu e-mail"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErro(""); }}
                                className={`${inputBase} ${erro ? "border-red-400" : "border-[#C8A97E]"}`}
                            />
                            <input
                                type="password"
                                placeholder="Digite a sua senha"
                                value={senha}
                                onChange={(e) => { setSenha(e.target.value); setErro(""); }}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                className={`${inputBase} ${erro ? "border-red-400" : "border-[#C8A97E]"}`}
                            />

                            {erro && (
                                <p className="text-red-500 text-sm ml-1 -mt-1">{erro}</p>
                            )}

                            <button className="text-sm text-[#3C5E45] text-left ml-1 underline underline-offset-2 hover:opacity-70 transition-opacity">
                                Esqueceu a senha?
                            </button>

                            <div className="flex items-center justify-center py-4">
                                <button onClick={handleGoogle} className="text-[#6B6B6B] flex items-center gap-2 text-xl">
                                    <img src={Google.src} className="w-9" />
                                    Google
                                </button>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={carregando}
                                className="w-full bg-[#3C5E45] text-white text-xl py-2.5 rounded-md font-semibold hover:bg-[#2e4a36] transition-colors disabled:opacity-60">
                                {carregando ? "ENTRANDO..." : "ENTRAR"}
                            </button>

                            <p className="text-sm text-center text-[#A89070]">
                                Não tem uma conta?{" "}
                                <a href="/register" className="text-[#3C5E45] underline underline-offset-2 hover:opacity-70 transition-opacity">
                                    Registre-se
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}