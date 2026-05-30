export default function DesktopLayout() {
    return (
        <div className="bg-[#E9FBC6] flex items-center h-screen w-screen gap-30">
            <div className="bg-[#BFD788] min-h-full min-w-[6rem] flex">
                
            </div>

            <div className="flex flex-col gap-15">

                <div className="flex flex-col gap-4 max-w-180">

                    <div className="flex gap-4">
                        <div className="bg-[#aa9f9f81] flex items-center justify-center rounded-[50%] min-w-50 min-h-50 cursor-pointer hover:opacity-75 ease-in-out duration-300">
                            foto
                        </div>

                        <div className="flex flex-col">
                            <div className="flex gap-2">
                                <h1 className="font-bold text-4xl">RAYANA</h1>

                                img

                                ...
                            </div>
                            <p>@rayanadossantos</p>

                            <div className="flex flex-col gap-5 pt-5">
                                <div className="flex gap-5">
                                    <span> <span className="font-bold"> 27 </span> posts </span>

                                    <span> <span className="font-bold"> 9 </span>  eventos participados </span>

                                    <span> <span className="font-bold"> 391 </span> aplausos </span>

                                    <span> <span className="font-bold"> 62 </span> seguidores </span>
                                </div>

                                <ul className="flex flex-col gap-2">
                                    <li> ❤️ To sempre tentando ajudar quem precisa. </li>

                                    <li> 🔥 A mais-mais da Nossa Floripa! </li>

                                    <li> 🎨 Venha ajudar com a genteee!!! </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button className="bg-[#3C5E45] p-4 rounded-lg text-[#FFEDD2] cursor-pointer hover:opacity-75 ease-in-out duration-300"> Seguir </button>

                </div>

                <div className="flex flex-col gap-10">
                    <p className="font-semibold text-lg pl-10">Posts</p>
                    <div className="flex gap-5">

                        <div className="bg-[#3c5e456b] min-h-[30rem] min-w-[30rem] rounded-xl cursor-pointer hover:opacity-75 ease-in-out duration-300"> </div>

                        <div className="bg-[#3c5e456b] min-h-[30rem] min-w-[30rem] rounded-xl cursor-pointer hover:opacity-75 ease-in-out duration-300"> </div>

                        <div className="bg-[#3c5e456b] min-h-[30rem] min-w-[30rem] rounded-xl cursor-pointer hover:opacity-75 ease-in-out duration-300"> </div>
                    </div>
                </div>
            </div>
        </div>
    )
}