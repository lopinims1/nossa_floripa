"use client";
import { Merriweather, Merriweather_Sans } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // NOVO: para redirecionar após login
import Logo from "@/app/login/public/Icons/Logo.svg";
import row1 from "@/app/login/public/row1.png";
import row2 from "@/app/login/public/row2.png";
import row3 from "@/app/login/public/row3.png";
import Google from "@/app/login/public/Icons/GoogleIcon.svg";
import Facebook from "@/app/login/public/Icons/FacebookIcon.svg";
import { supabase } from "@/lib/supabase"; // NOVO: cliente do Supabase

const merriweather = Merriweather({ subsets: ["latin"], weight: ["600"] });
const merriweatherSans = Merriweather_Sans({ subsets: ["latin"], weight: ["600"] });

const imagens = [row1, row2, row3];

export default function LoginPage() {
    const router = useRouter(); // NOVO: hook de navegação
    const [imagemAtual, setImagemAtual] = useState(0);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false); // NOVO: estado de loading

    useEffect(() => {
        const t = setInterval(() => setImagemAtual((p) => (p + 1) % imagens.length), 4000);
        return () => clearInterval(t);
    }, []);

    // NOVO: função que autentica o usuário com email e senha
    async function handleLogin() {
        if (!email || !senha) {
            alert("Preencha e-mail e senha!");
            return;
        }
        setCarregando(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) {
            alert(error.message);
            setCarregando(false);
            return;
        }
        setCarregando(false);
        router.push("/"); // NOVO: redireciona para a home após login
    }

    // NOVO: função que abre o login com Google via OAuth
    async function handleGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin + "/" }
        });
    }

    // NOVO: função que abre o login com Facebook via OAuth
    async function handleFacebook() {
        await supabase.auth.signInWithOAuth({
            provider: "facebook",
            options: { redirectTo: window.location.origin + "/" }
        });
    }

    const inputBase =
        "w-full border border-[#C8A97E] bg-transparent rounded-sm px-4 py-3 text-lg text-[#3C5E45] placeholder-[#A89070] outline-none focus:border-[#3C5E45] transition-colors";

    return (
        <div className="flex bg-[#FFF5E7] dark:bg-black h-screen w-screen p-10">
            <div className="flex items-center justify-between max-w-400 w-full pl-5 pr-15 mx-auto">

                {/* Row de imagens na tela */}
                <div className="relative w-210 overflow-hidden">
                    {imagens.map((img, i) => (
                        <img
                            key={i}
                            src={img.src}
                            alt=""
                            className={`w-full absolute top-0 left-0 transition-opacity duration-700 ${
                                i === imagemAtual ? "opacity-100" : "opacity-0"
                            }`}
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

                {/* Formulário */}
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
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputBase}
                            />
                            <input
                                type="password"
                                placeholder="Digite a sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className={inputBase}
                            />

                            <button className="text-sm text-[#3C5E45] text-left ml-1 underline underline-offset-2 hover:opacity-70 transition-opacity">
                                Esqueceu a senha?
                            </button>

                            {/* ALTERADO: adicionado onClick nas funções do Google e Facebook */}
                            <div className="flex items-center justify-center gap-5 py-4">
                                <button
                                    onClick={handleGoogle}
                                    className="text-[#6B6B6B] flex items-center gap-2 text-xl">
                                    <img src={Google.src} className="w-9" />
                                    Google
                                </button>

                                <div className="w-px h-10 bg-[#A1A1A1] rounded-full"></div>

                                <button
                                    onClick={handleFacebook}
                                    className="text-[#6B6B6B] flex items-center gap-2 text-xl">
                                    <img src={Facebook.src} className="w-9" />
                                    Facebook
                                </button>
                            </div>

                            {/* ALTERADO: adicionado onClick, disabled e texto de loading */}
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

/*
 * ALTERAÇÕES FEITAS:
 *
 * Linha 4  — import { useRouter } from "next/navigation"
 *            Adicionado para redirecionar o usuário após o login.
 *
 * Linha 11 — import { supabase } from "@/lib/supabase"
 *            Adicionado o cliente Supabase criado em lib/supabase.ts.
 *
 * Linha 19 — const router = useRouter()
 *            Hook de navegação inicializado dentro do componente.
 *
 * Linha 22 — const [carregando, setCarregando] = useState(false)
 *            Novo estado para desabilitar o botão enquanto faz login.
 *
 * Linhas 29-40 — async function handleLogin()
 *            Função nova que:
 *            - Valida se email e senha estão preenchidos
 *            - Chama supabase.auth.signInWithPassword()
 *            - Redireciona para "/" após login bem-sucedido
 *
 * Linhas 42-47 — async function handleGoogle()
 *            Função nova que abre o OAuth do Google via Supabase.
 *            Redireciona para a home após autenticação.
 *
 * Linhas 49-54 — async function handleFacebook()
 *            Função nova que abre o OAuth do Facebook via Supabase.
 *            Redireciona para a home após autenticação.
 *
 * Linha 98 — botão Google
 *            Adicionado onClick={handleGoogle}.
 *
 * Linha 105 — botão Facebook
 *            Adicionado onClick={handleFacebook}.
 *
 * Linhas 111-115 — botão ENTRAR
 *            Adicionado onClick={handleLogin}, disabled={carregando}
 *            e texto dinâmico "ENTRANDO..." durante o loading.
 */