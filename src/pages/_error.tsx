import Head from "next/head";
import {useRouter} from "next/router";

export default function NotFound() {
    const navigate = useRouter();

    const goBack = () => {
        navigate.back();
    };

    return (
        <>
            <Head>
                <title>Você está perdido!</title>
            </Head>

            <div className="flex flex-col w-screen h-screen justify-center items-center select-none gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gif/404.gif" alt="404 Not Found"/>

                <div className="text-center">
                    <h1 className="font-bold text-3xl my-3">
                        Ops... Parece que você se perdeu!
                    </h1>
                    <span className="font-semibold text-gray-500 text-lg">
            Clique em Voltar para retornar à página anterior.
          </span>
                </div>
                <button
                    onClick={goBack}
                    className="rounded-md py-2 px-4 bg-red-500 text-white w-80 text-lg font-semibold"
                >
                    Voltar
                </button>
            </div>
        </>
    );
}
