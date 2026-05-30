import Logo from "@/app/register/public/Icons/Logo.svg";
import Google from "@/app/register/public/Icons/GoogleIcon.svg";
import Facebook from "@/app/register/public/Icons/FacebookIcon.svg";
import Link from "next/link";

export default function MobileLayout() {
    return (
        <div className="bg-[#2A3D2F] flex justify-center items-center h-screen w-screen">

            <div className="bg-[#FFF4F0] rounded-2xl p-7 flex flex-col gap-7 dropshadow-2xl min-w-[30rem] min-h-[60rem]">

                <div className="flex items-center justify-center gap-2">
                    <span className="flex items-center gap-2 text-[#3C5E45] text-lg font-semibold"> <img src={Logo.src} alt="" className="w-8" /> Nossa Floripa </span>
                </div>

                <div className="flex flex-col items-center text-center gap-6 pt-14">
                    <h1 className="text-[#3C5E45] text-4xl font-semibold pb-16"> Bem vindo à <br /> Floripa </h1>

                    <input type="text" placeholder="Nome" className="p-3.5 rounded-lg border border-[#A1A1A1] placeholder:text-[#6B6B6B] text-xl min-w-full" />

                    <input type="email" placeholder="E-mail" className="p-3.5 rounded-lg border border-[#A1A1A1] placeholder:text-[#6B6B6B] text-xl min-w-full" />

                    <input type="password" placeholder="Senha" className="p-3.5 rounded-lg border border-[#A1A1A1] placeholder:text-[#6B6B6B] text-xl min-w-full" />

                    <input type="text" inputMode="numeric" maxLength={9} placeholder="CEP" className="p-3.5 rounded-lg border border-[#A1A1A1] placeholder:text-[#6B6B6B] text-xl min-w-full" />

                    <div className="flex items-center justify-center gap-5 py-4">
                        <button className="text-[#6B6B6B] flex items-center gap-2 text-xl">
                            <img src={Google.src} className="w-9" />
                            Google
                        </button>

                        <div className="w-px h-10 bg-[#A1A1A1] rounded-full"></div>

                        <button className="text-[#6B6B6B] flex items-center gap-2 text-xl">
                            <img src={Facebook.src} className="w-9" />
                            Facebook
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 min-w-full">
                        <button className="bg-[#3C5E45] text-[#FFF4F0] text-2xl font-semibold p-4 rounded-lg"> Registrar </button>

                        <button className="bg-[#E6832E] text-[#FFF4F0] text-2xl font-semibold p-4 rounded-lg"> <Link href="/login"> Já tem conta? </Link> </button>

                        <div>
                            <span className="text-lg"> <a href="#" className="underline underline-offset-2"> Nossos termos </a> de uso </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}