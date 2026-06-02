import { Roboto } from 'next/font/google'

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
})

export default function MobileLayout() {

    return (
        <div className="bg-[#EFFFD3] flex justify-center items-center h-screen w-screen"> {/* Página */}

            <div className="flex justify-center items-center flex-col gap-4"> {/* Conteúdo */}

                <div className="flex flex-col-reverse gap-4"> {/* Top */}

                    <button className="bg-[#3C5E45] p-3 text-[#EFFFD3] rounded-lg">Seguir</button>

                    <div className="flex gap-4">

                        <div className="flex justify-center items-center w-[6rem] h-[6rem] bg-[#aa9f9f81] rounded-[50%]">
                            <p> Perfil </p>
                        </div>

                        <div className="flex flex-col">

                            <div className="flex gap-3">

                                <div className="flex flex-col">

                                    <p className="text-3xl font-bold {roboto.className}"> RAYANA </p>

                                    <p className="text-[20px] {roboto.className}"> @rayanadossantos </p>
                                </div>

                                <p>Verified</p>

                                <p className="text-5xl">...</p>
                            </div>

                            <div className="flex flex-col gap-3">

                                <div className="flex gap-3">
                                    <span> <span className="font-bold">27</span> posts</span>

                                    <span> <span className="font-bold">9</span> eventos</span>

                                    <span> <span className="font-bold">391</span> aplausos</span>
                                </div>

                                <span> <span className="font-bold">62</span> seguidores</span>
                            </div>

                            <div className="flex flex-col gap-0.5 pt-5">
                                <span>❤️ To sempre tentando ajudar quem precisa.</span>

                                <span>🔥 A mais-mais da Nossa Floripa!</span>

                                <span>🎨 Venha ajudar com a genteee!!!</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <p className="text-xl font-medium {roboto.className}">Posts</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#3c5e457e] rounded-lg min-h-54 min-w-50">   </div>
                    <div className="bg-[#3c5e457e] rounded-lg min-h-54 min-w-50">   </div>
                    <div className="bg-[#3c5e457e] rounded-lg min-h-54 min-w-50">   </div>
                    <div className="bg-[#3c5e457e] rounded-lg min-h-54 min-w-50">   </div>
                    <div className="bg-[#3c5e457e] rounded-lg min-h-54 min-w-50">   </div>
                    <div className="bg-[#3c5e457e] rounded-lg min-h-54 min-w-50">   </div>
                </div>

            </div>
        </div>
    )
}  