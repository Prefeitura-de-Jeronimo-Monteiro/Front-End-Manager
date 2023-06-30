import Result from "@/shared/components/Result";
import api from "@/shared/services";
import {GetServerSideProps} from "next";
import {parseCookies} from "nookies";
import {useState} from "react";

export default function Dashboard() {
    const [result, setResult] = useState({text: "Teste", status: false});
    const [isOpenResult, setIsOpenResult] = useState<boolean>(false);

    const vala = () => {
        const url = "https://api.imgbb.com/1/upload";
        const apiKey = process.env.TOKEN_API_IMG;
        const imageUrl = "https://picsum.photos/200/300";

        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: {
                expiration: 600,
                key: apiKey,
            },
        };

        const formData = new URLSearchParams();
        formData.append("image", imageUrl);

        api()
            .post(url, formData.toString(), config)
            .then((response) => {
                console.log(response.data);
                setResult({text: "Deu bom!", status: true});
            })
            .catch((error) => {
                console.error(error);
                setResult({text: "Deu erro!", status: false});
            })
            .finally(toggleResult);
    };

    const toggleResult = () => {
        setIsOpenResult(!isOpenResult);
    };
    return (
        <>
            <h1 onClick={vala}> Home</h1>

            <Result
                text={result.text}
                status={result.status}
                open={isOpenResult}
                onClose={toggleResult}
            />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const {["BearerToken"]: token} = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: "/user/login",
                permanent: false,
            },
        };
    }

    let isLogin = false;

    token ? (isLogin = true) : isLogin;

    return {
        props: {
            isLogin,
        },
    };
};
