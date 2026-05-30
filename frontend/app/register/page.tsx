"use client";
import { Merriweather, Merriweather_Sans } from "next/font/google";
import { useState, useEffect } from "react";
import Logo from "@/app/register/public/Icons/Logo.svg";
import row1 from "@/app/register/public/row1.png";
import row2 from "@/app/register/public/row2.png";
import row3 from "@/app/register/public/row3.png";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const merriweather = Merriweather({ subsets: ["latin"], weight: ["600"] });
const merriweatherSans = Merriweather_Sans({ subsets: ["latin"], weight: ["600"] });

const imagens = [row1, row2, row3];

export default function RegisterPage() {
  const [imagemAtual, setImagemAtual] = useState(0);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");

  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarCep, setMostrarCep] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);


  useEffect(() => {
    const t = setInterval(() => setImagemAtual((p) => (p + 1) % imagens.length), 5000);
    return () => clearInterval(t);
  }, []);

  const inputBase =
    "w-full border border-[#C8A97E] bg-transparent rounded-sm px-4 py-3 text-lg text-[#3C5E45] placeholder-[#A89070] outline-none focus:border-[#3C5E45] transition-colors";

  const fade = (visivel: boolean) =>
    `transition-all duration-500 overflow-hidden ${visivel ? "opacity-100 max-h-20" : "opacity-0 max-h-0 pointer-events-none"}`;

  return (
    <div className="flex bg-[#FFF5E7] dark:bg-black h-screen w-screen p-10">
      <div className="flex items-center justify-between max-w-400 w-full pl-5 pr-15 mx-auto border-2 border-transparent">

        <div className="border-2 border-transparent">

          {/* Row de imagens na tela */}
          <div className="relative w-210 overflow-hidden">
            {imagens.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt=""
                className={`w-full absolute top-0 left-0 transition-opacity duration-700 ${i === imagemAtual ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}

            {/* imagem invisível só para manter a altura do container */}
            <img src={imagens[0].src} className="w-full invisible" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imagens.map((_, i) => (
                <button key={i} onClick={() => setImagemAtual(i)}
                  className={`h-2 rounded-full transition-all ${i === imagemAtual ? "bg-white w-5" : "bg-white/50 w-2"}`} />
              ))}
            </div>
          </div>

        </div>


        {/* Formulário */}
        <div className="flex items-center justify-center w-full max-w-lg mb-30 border-2 border-transparent">
          <div className="flex flex-col gap-7 w-full">

            <div className="flex items-center justify-center gap-3">
              <img src={Logo.src} alt="" className="w-12" />
              <h1 className={`text-2xl text-[#3C5E45] ${merriweather.className}`}>Nossa floripa</h1>
            </div>

            <h1 className={`text-[#3C5E45] text-5xl text-center mb-10 ${merriweatherSans.className}`}>
              BEM VINDO À <br /> FLORIPA
            </h1>

            {/* Inputs */}
            <div className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Digite o seu nome completo"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (e.target.value.trim()) setMostrarEmail(true);
                }}
                className={inputBase}
              />

              <div className={fade(mostrarEmail)}>
                <input
                  type="email"
                  placeholder="Digite o seu melhor e-mail"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value.trim()) setMostrarSenha(true);
                  }}
                  className={inputBase}
                />
              </div>

              <div className={fade(mostrarSenha)}>
                <input
                  type="password"
                  placeholder="Digite uma senha segura"
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value);
                    if (e.target.value.trim()) setMostrarCep(true);
                  }}
                  className={inputBase}
                />
              </div>

              <div className={fade(mostrarCep)}>
                <input
                  type="text"
                  placeholder="Digite o seu CEP"
                  value={cep}
                  onChange={(e) => {
                    setCep(e.target.value);
                    if (e.target.value.trim()) setMostrarTermos(true);
                  }}
                  className={inputBase}
                />
              </div>

              <div className={fade(mostrarTermos)}>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-sm text-[#3C5E45] ml-1 underline underline-offset-2 hover:opacity-70 transition-opacity">
                      {termosAceitos ? "Você aceitou os termos" : "Ler e aceitar os termos de uso"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-h-64 overflow-y-auto bg-[#FFF5E7] border-[#C8A97E] text-sm text-[#3C5E45] p-4 rounded-xl">
                    <p className="mb-3">Ao se registrar, você concorda com a coleta dos seus dados para personalizar sua experiência. Eles não serão compartilhados com terceiros.</p>
                    <button
                      onClick={() => setTermosAceitos(true)}
                      className="w-full bg-[#3C5E45] text-white py-2 rounded-md text-sm hover:bg-[#2e4a36] transition-colors"
                    >
                      Aceitar e continuar
                    </button>
                  </PopoverContent>
                </Popover>
              </div>

              <div className={fade(termosAceitos)}>
                <button className="w-full bg-[#3C5E45] text-white text-xl py-2.5 rounded-md font-semibold hover:bg-[#2e4a36] transition-colors">
                  REGISTRAR
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}