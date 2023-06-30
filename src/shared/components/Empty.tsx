export const Empty = () => {
    return (
        <div className="w-screen flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gif/empty.gif" alt="" className="w-96 select-none"/>
            <div className="text-center">
                <h2 className="font-bold text-xl">
                    Ops... Parece que não há dados disponíveis no momento ou ocorreu um
                    erro.
                </h2>
                <p className="font-semibold text-gray-400 text-lg">
                    Tente novamente mais tarde ou crie o primeiro item.
                </p>
            </div>
        </div>
    );
};
