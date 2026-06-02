"use client"
import { useRef, useState, useCallback } from "react";
import banner2 from "@/app/public/banner2.jpg";
import eventoImg from "@/app/public/eventoImg.png";
import eventoImg2 from "@/app/public/eventoImg2.png";
import userAvatar from "@/app/public/userAvatar.jpg";
import LikeIcon from "@/app/public/icons/Like.svg";
import ShareIcon from "@/app/public/icons/Share.svg";
import Asidebar from "@/components/asidebar";

const eventos = [
    { id: 1, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
    { id: 2, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
    { id: 3, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
    { id: 4, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
    { id: 5, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
];

function EventoCard({ evento }: { evento: typeof eventos[0] }) {
    const imgRef = useRef<HTMLDivElement>(null);
    const scrollImg = () => imgRef.current?.scrollBy({ left: 240, behavior: "smooth" });

    return (
        <div className="w-130 shrink-0 bg-[#BFD788] border-3 border-[#57715E] rounded-lg p-4 flex flex-col gap-3">

            <h3 className="font-bold text-[#2A3D2F] text-xl">{evento.title}</h3>

            <p className="text-sm text-[#2A3D2F]">{evento.description}</p>

            <div className="relative">

                <div ref={imgRef} className="flex gap-7 overflow-x-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
                    {evento.images.map((img, i) => (
                        <img key={i} src={img.src} className="w-56.5 h-36 object-cover rounded shrink-0" />
                    ))}
                </div>

            </div>

            <div className="flex items-center gap-26 mt-auto">
                <div className="flex gap-3">
                    <button
                        className="bg-[#2A3D2F] text-white text-md px-8 py-2 rounded font-semibold hover:bg-[#1e2e22] transition-colors">
                        Participar
                    </button>

                    <button className="text-lg text-[#2A3D2F] font-bold">Ver mais</button>
                </div>

                <div className="flex gap-4 mr-2 text-[#2A3D2F]">
                    <button><img src={LikeIcon.src} className="min-w-6.5" /></button>

                    <button><img src={ShareIcon.src} className="min-w-6.5" /></button>
                </div>

            </div>
        </div>
    );
}

export default function MobileLayout() {
    // Adicione junto aos outros useRef/useState no MobileLayout:
    const carrosselRef = useRef<HTMLDivElement>(null);
    const [maskPos, setMaskPos] = useState<"start" | "middle" | "end">("start");

    const handleScroll = useCallback(() => {
        const el = carrosselRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        if (scrollLeft <= 0) setMaskPos("start");
        else if (scrollLeft + clientWidth >= scrollWidth - 1) setMaskPos("end");
        else setMaskPos("middle");
    }, []);

    const scroll = (dir: "left" | "right") =>
        carrosselRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });

    // Defina os gradientes baseados na posição:
    const maskStyle: React.CSSProperties = {
        WebkitMaskImage:
            maskPos === "start"
                ? "linear-gradient(to right, #000 80%, transparent 100%)"
                : maskPos === "end"
                    ? "linear-gradient(to right, transparent 0%, #000 20%)"
                    : "linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        maskImage:
            maskPos === "start"
                ? "linear-gradient(to right, #000 80%, transparent 100%)"
                : maskPos === "end"
                    ? "linear-gradient(to right, transparent 0%, #000 20%)"
                    : "linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        transition: "mask-image 0.3s ease, -webkit-mask-image 0.3s ease",
    };

    return (
        <div>
            <div className="bg-[#BFD788] flex w-screen h-screen">
                {/* Conteúdo cental */}
                <div className="flex flex-col items-center gap-15 py-6 px-6 bg-[#F0FFD3] flex-1 overflow-y-auto overflow-x-hidden">

                    <div className="relative w-full"> {/* Banner */}

                        <img src={banner2.src} className="rounded-2xl h-75 object-cover" />

                        <div className="absolute bottom-4 left-8 text-white">
                            <h1 className="font-bold text-2xl">PUBLIQUE<br />UM EVENTO</h1>

                            <p className="text-sm font-light opacity-80">Você pode publicar eventos por toda a <br /> floripa, juntando pessoas locais para ajudar <br /> a melhorar o melhor lugar do Brasil, se <br /> tornando ainda melhor</p>
                        </div>
                    </div>

                    <div className="w-full max-w-5xl pt-10">
                        {/* Eventos */}
                        <section className="w-full">

                            <div className="relative">

                                {/* Fade esquerda */}
                                <div
                                    className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
                                    style={{
                                        background: "linear-gradient(to right, rgba(0,0,0,0.50) 0%, transparent 100%)",
                                        opacity: maskPos !== "start" ? 1 : 0,
                                        transition: "opacity 300ms ease-in-out",
                                    }}
                                />

                                {/* Fade direita */}
                                <div
                                    className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
                                    style={{
                                        background: "linear-gradient(to left, rgba(0,0,0,0.50) 0%, transparent 100%)",
                                        opacity: maskPos !== "end" ? 1 : 0,
                                        transition: "opacity 300ms ease-in-out",
                                    }}
                                />

                                <div
                                    ref={carrosselRef}
                                    onScroll={handleScroll}
                                    className="flex gap-14 overflow-x-auto scroll-smooth"
                                    style={{ scrollbarWidth: "none" }}
                                >
                                    {eventos.map((evento) => <EventoCard key={evento.id} evento={evento} />)}
                                </div>

                            </div>

                        </section>

                    </div>

                    <div>
                        <p>Feed</p>
                    </div>
                </div>

                <Asidebar />
            </div>
        </div>
    )
}