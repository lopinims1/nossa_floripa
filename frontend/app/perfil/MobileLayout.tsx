import Asidebar from '@/components/asidebar'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
})

export default function MobileLayout() {

    return (
        <div
            className="flex justify-center items-center h-screen w-screen"
            style={{ backgroundColor: "var(--bg-feed)" }}
        >
            <div className="flex justify-center items-center flex-col gap-4">

                <div className="flex flex-col-reverse gap-4">

                    <button
                        className="p-3 rounded-lg"
                        style={{
                            backgroundColor: "var(--cor-primaria)",
                            color: "var(--cor-branco)",
                        }}
                    >
                        Seguir
                    </button>

                    <div className="flex gap-4">

                        <div
                            className="flex justify-center items-center w-[6rem] h-[6rem] rounded-[50%]"
                            style={{ backgroundColor: "color-mix(in srgb, var(--cor-primaria) 30%, transparent)" }}
                        >
                            <p style={{ color: "var(--cor-texto)" }}> Perfil </p>
                        </div>

                        <div className="flex flex-col">

                            <div className="flex gap-3">

                                <div className="flex flex-col">
                                    <p
                                        className={`text-3xl font-bold ${roboto.className}`}
                                        style={{ color: "var(--cor-texto)" }}
                                    >
                                        RAYANA
                                    </p>
                                    <p
                                        className={`text-[20px] ${roboto.className}`}
                                        style={{ color: "var(--cor-texto-suave)" }}
                                    >
                                        @rayanadossantos
                                    </p>
                                </div>

                                <p style={{ color: "var(--cor-primaria)" }}>Verified</p>

                                <p
                                    className="text-5xl"
                                    style={{ color: "var(--cor-texto-suave)" }}
                                >
                                    ...
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">

                                <div
                                    className="flex gap-3"
                                    style={{ color: "var(--cor-texto)" }}
                                >
                                    <span><span className="font-bold">27</span> posts</span>
                                    <span><span className="font-bold">9</span> eventos</span>
                                    <span><span className="font-bold">391</span> aplausos</span>
                                </div>

                                <span style={{ color: "var(--cor-texto)" }}>
                                    <span className="font-bold">62</span> seguidores
                                </span>
                            </div>

                            <div className="flex flex-col gap-0.5 pt-5">
                                <span style={{ color: "var(--cor-texto)" }}>❤️ To sempre tentando ajudar quem precisa.</span>
                                <span style={{ color: "var(--cor-texto)" }}>🔥 A mais-mais da Nossa Floripa!</span>
                                <span style={{ color: "var(--cor-texto)" }}>🎨 Venha ajudar com a genteee!!!</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <p
                        className={`text-xl font-medium ${roboto.className}`}
                        style={{ color: "var(--cor-texto)" }}
                    >
                        Posts
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-lg min-h-54 min-w-50"
                            style={{ backgroundColor: "color-mix(in srgb, var(--cor-primaria) 30%, transparent)" }}
                        />
                    ))}
                </div>
            </div>
            
            <Asidebar />
        </div>
    )
}