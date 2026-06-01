"use client"
import Link from "next/link"
import Image from "next/image"
import Home from "@/components/asidebar/icons/Home Icon.svg"
import Search from "@/components/asidebar/icons/Search Icon.svg"
import Publicar from "@/components/asidebar/icons/Publicar icon.svg"
import Curtidos from "@/components/asidebar/icons/Curtidos Icon.svg"
import Seguindo from "@/components/asidebar/icons/Seguindo Icon.svg"
import Perfil from "@/components/asidebar/icons/Perfil Icon.svg"
import Config from "@/components/asidebar/icons/Config Icon.svg"

const icons = [
    { id: 1, image: Home, label: "Home", href: "/" },
    { id: 2, image: Search, label: "Buscar", href: "/buscar" },
    { id: 3, image: Publicar, label: "Publicar", href: "/publicar" },
    { id: 4, image: Curtidos, label: "Curtidos", href: "/curtidos" },
    { id: 5, image: Seguindo, label: "Seguindo", href: "/seguindo" },
    { id: 6, image: Perfil, label: "Perfil", href: "/perfil" },
]

export default function Asidebar() {
    return (
        <aside className="group w-20 hover:w-52 h-screen shrink-0 bg-[#c5d98a] flex flex-col py-6 gap-2 transition-all duration-300 ease-in-out overflow-hidden">
            {/* Avatar */}
            <div className="px-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden shrink-0">
                    {/* User img */}
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-8 flex-1 w-full px-3">
                {icons.map(({ id, image: Icon, label, href }) => (
                    <Link
                        key={id}
                        href={href}
                        title={label}
                        className="w-full h-12 flex items-center gap-3 px-2 rounded-xl text-[#4a5a2a] hover:bg-white/40 transition-colors duration-200">

                        <span className="shrink-0 w-10 h-10 flex items-center justify-center">
                            <Image src={Icon} alt={label} width={36} height={36} />
                        </span>
                        <span className="
                            whitespace-nowrap font-semibold text-sm
                            opacity-0 group-hover:opacity-100
                            -translate-x-2 group-hover:translate-x-0
                            transition-all duration-300 ease-in-out
                        ">
                            {label}
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="w-full px-3 mt-2">
                <Link
                    href="/config"
                    title="Config"
                    className="w-full h-10 flex items-center gap-3 px-2 rounded-xl
                               text-[#4a5a2a] hover:bg-white/40 transition-colors duration-200"
                >
                    <span className="shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image src={Config} alt="Config" width={40} height={40} />
                    </span>
                    
                        <span className="whitespace-nowrap font-semibold text-sm text-[#4a5a2a]
                                         animate-in fade-in slide-in-from-left-2 duration-200">
                            Config
                        </span>
                    
                </Link>
            </div>
        </aside>
    )
}