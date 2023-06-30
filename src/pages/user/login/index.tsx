import {useContext, useState} from "react";
import {Form, Formik} from "formik";
import {GetServerSideProps} from "next";
import {parseCookies} from "nookies";
import Router from "next/router";
import {Envelope, Eye, EyeClosed, Lock} from "@phosphor-icons/react";
import * as yup from "yup";

import {AuthContext} from "@/shared/contexts/Auth";
import {FormInput} from "@/shared/components/Input";
import Head from "next/head";
import Result from "@/shared/components/Result";

export default function Login() {
    const {login} = useContext(AuthContext);
    const [viewPassword, setViewPassword] = useState<boolean>(false);
    const [result, setResult] = useState({text: "", status: false});
    const [isOpenResult, setIsOpenResult] = useState<boolean>(false);
    const [submiting, setSubmiting] = useState<boolean>(false);

    const toggleViewPassword = () => {
        setViewPassword(!viewPassword);
    };

    const toggleResult = () => {
        setIsOpenResult(!isOpenResult);
    };

    const LoginSchema = yup.object().shape({
        usuario: yup
            .string()
            .email("E-Mail não é válido")
            .required("Nome é um campo obrigatório"),
        senha: yup.string().required("Senha é um campo obrigatório"),
    });

    const handleLogin = ({usuario, senha}: IAuthData) => {
        setSubmiting(true);

        login({usuario, senha})
            .then(async () => {
                await Router.push("/");
            })
            .catch((err) => {
                setResult({
                    text:
                        err.response.data || "Algo deu errado, tente novamente mais tarde!",
                    status: false,
                });
            })
            .finally(() => {
                setSubmiting(false);
                toggleResult();
            });
    };

    return (
        <>
            <Head>
                <title>Entrar</title>
            </Head>

            <div className="flex flex-col w-screen h-screen items-center justify-center overflow-auto select-none">
                <div className="flex flex-col items-center mb-4 gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/logo.png" alt="" className="w-52"/>
                    <h1 className="text-lg text-center font-semibold max-w-xs">
                        Seja Bem-Vindo(a) ao Sistema da Prefeitura de Jeronimo Monteiro
                    </h1>
                </div>

                <Formik
                    initialValues={{usuario: "", senha: ""}}
                    validationSchema={LoginSchema}
                    onSubmit={({usuario, senha}) => handleLogin({usuario, senha})}
                >
                    {({errors, touched}) => (
                        <Form className="flex flex-col items-center w-96 justify-center">
                            <div className="flex flex-col w-full gap-8">
                                <div className="w-full">
                                    <label htmlFor="usuario" className="mb-2">
                                        E-Mail
                                    </label>

                                    <FormInput
                                        id="usuario"
                                        type="email"
                                        name="usuario"
                                        placeholder="Nome"
                                        error={
                                            errors.usuario && touched.usuario ? errors.usuario : null
                                        }
                                        iconLeft={<Envelope size={24}/>}
                                        className="text-lg"
                                    />
                                </div>

                                <div className="w-full">
                                    <label htmlFor="senha" className="mb-2">
                                        Senha
                                    </label>

                                    <FormInput
                                        id="senha"
                                        type={viewPassword ? "text" : "password"}
                                        name="senha"
                                        placeholder="********"
                                        error={errors.senha && touched.senha ? errors.senha : null}
                                        iconLeft={<Lock size={24}/>}
                                        iconRight={
                                            viewPassword ? (
                                                <Eye
                                                    size={24}
                                                    onClick={toggleViewPassword}
                                                    className="cursor-pointer"
                                                />
                                            ) : (
                                                <EyeClosed
                                                    size={24}
                                                    onClick={toggleViewPassword}
                                                    className="cursor-pointer"
                                                />
                                            )
                                        }
                                        className="text-lg"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`bg-background-600 py-2 px-4 rounded-full text-white w-72 mt-8 disabled:opacity-70`}
                                disabled={submiting}
                            >
                                Entrar
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>

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

    if (token) {
        return {
            redirect: {
                destination: "/",
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
