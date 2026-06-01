"use client";
import { useRef } from "react";
import banner2 from "@/app/public/banner2.jpg";
import eventoImg from "@/app/public/eventoImg.png";
import eventoImg2 from "@/app/public/eventoImg2.png";
import userAvatar from "@/app/public/userAvatar.jpg";
import LikeIcon from "@/app/public/icons/Like.svg";
import ShareIcon from "@/app/public/icons/Share.svg";

const eventos = [
  { id: 1, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
  { id: 2, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
  { id: 3, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
  { id: 4, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
  { id: 5, title: "Evento no centro", description: "Hoje as 14:30 terá um evento de limpeza no centro de Floripa. O que acha de ajudar? Ajudar renderá mais pontos para a sua conta, que pode ser trocado por personalizações do seu perfil.", images: [eventoImg, eventoImg2] },
];

// Informações do futuro database, por enquanto tá tudo mocked
const usuariosSugeridos = [
  { id: 1, nome: "Rayana", descricao: "Não podemos esquecer dos nossos veículos, eles também são seres vivos e devem ser cuidados.", avatar: userAvatar },
  { id: 2, nome: "Rayana", descricao: "Não podemos esquecer dos nossos veículos, eles também são seres vivos e devem ser cuidados.", avatar: userAvatar },
  { id: 3, nome: "Rayana", descricao: "Não podemos esquecer dos nossos veículos, eles também são seres vivos e devem ser cuidados.", avatar: userAvatar },
  { id: 4, nome: "Rayana", descricao: "Não podemos esquecer dos nossos veículos, eles também são seres vivos e devem ser cuidados.", avatar: userAvatar },
];

function EventoCard({ evento }: { evento: typeof eventos[0] }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const scrollImg = () => imgRef.current?.scrollBy({ left: 240, behavior: "smooth" });

  return (
    <div className="w-110 shrink-0 bg-[#BFD788] border-2 border-[#2A3D2F] rounded-lg p-4 flex flex-col gap-3">
      <h3 className="font-bold text-[#2A3D2F]">{evento.title}</h3>
      <p className="text-sm text-[#2A3D2F]">{evento.description}</p>
      <div className="relative">

        <div ref={imgRef} className="flex gap-2 overflow-x-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {evento.images.map((img, i) => (
            <img key={i} src={img.src} alt="" className="w-full h-36 object-cover rounded shrink-0" />
          ))}
        </div>
        {evento.images.length > 1 && (
          <button onClick={scrollImg} className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center text-[#2A3D2F] text-xs shadow">›</button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex gap-3">

          <button
            className="bg-[#2A3D2F] text-white text-sm px-4 py-1.5 rounded font-semibold hover:bg-[#1e2e22] transition-colors">
            Participar
          </button>
          <button className="text-sm text-[#2A3D2F] font-semibold hover:opacity-80">Ver mais</button>
        </div>

        <div className="flex gap-2 mr-2 text-[#2A3D2F]">
          <button><img src={LikeIcon.src} /></button>
          <button><img src={ShareIcon.src} /></button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => carrosselRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });

  return (
    <div className="flex bg-[#BFD788] w-screen h-screen overflow-hidden font-sans dark:bg-black">

      {/* Asidebar na esquerda */}
      <div className="h-full w-20 bg-red-500 shrink-0"></div>

      {/* Conteúdo cental */}
      <div className="flex flex-col items-center py-6 px-6 bg-[#F0FFD3] flex-1 overflow-y-auto overflow-x-hidden">
        <div className="relative w-full max-w-5xl">
          <img src={banner2.src} className="rounded-xl w-full h-96 object-cover" />

          <div className="absolute bottom-8 left-8 text-white opacity-80">
            <h1 className="font-bold text-4xl mb-2">PUBLIQUE<br />UM EVENTO</h1>
            <p className="max-w-lg text-lg font-light">Você pode publicar eventos por toda a floripa, juntando pessoas locais para ajudar a melhorar o melhor lugar do Brasil, se tornando ainda melhor</p>
          </div>
        </div>

        {/* Eventos */}
        <section className="w-full max-w-5xl mt-10">
          <h2 className="text-3xl font-bold mb-4 text-[#2A3D2F]">Eventos</h2>
          <div className="relative">
            <div ref={carrosselRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
              {eventos.map((evento) => <EventoCard key={evento.id} evento={evento} />)}
            </div>

            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border border-gray-200 shadow rounded-full w-9 h-9 flex items-center justify-center text-[#2A3D2F] hover:bg-gray-50 transition-colors z-10">‹</button>
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border border-gray-200 shadow rounded-full w-9 h-9 flex items-center justify-center text-[#2A3D2F] hover:bg-gray-50 transition-colors z-10">›</button>
          </div>
        </section>
      </div>

      {/* Conteúdo direito  */}
      <div className="flex flex-col w-84 shrink-0 bg-[#BFD788] border-l border-[#BFD788] overflow-y-auto overflow-x-hidden py-6 px-4 gap-6">

        {/* Mapa */}
        <div className="w-full h-64 bg-[#BFD788] rounded-sm border-2 border-[#2A3D2F] flex items-center justify-center text-[#2A3D2F] text-sm font-semibold">
          Mapa aqui
        </div>

        <div className="w-full h-0.5 bg-[#2A3D2F] rounded-full opacity-80"></div>

        {/* Usuários sugeridos */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-[#2A3D2F] text-base">Pessoas sugeridas</h3>

          {usuariosSugeridos.map((user) => (
            <div key={user.id} className="flex items-start gap-3">
              <img src={user.avatar.src} alt={user.nome} className="w-11 h-13 rounded-2xl object-cover shrink-0" />

              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold text-sm text-[#2A3D2F]">{user.nome}</span>
                <p className="text-xs text-[#2A3D2F] leading-snug line-clamp-2">{user.descricao}</p>
                <div className="flex gap-2 mt-1">
                  <button className="text-xs flex items-center gap-1 text-[#3C5E45] font-semibold hover:opacity-70 transition-opacity">
                    <img src={LikeIcon.src} className="w-5 mb-1" />
                    Aplaudir
                  </button>
                  <button className="text-xs bg-[#2A3D2F] text-white px-2 py-0.5 rounded hover:bg-[#1e2e22] transition-colors">Conhecer</button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}