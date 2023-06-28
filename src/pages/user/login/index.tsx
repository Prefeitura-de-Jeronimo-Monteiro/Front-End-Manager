import { useContext, useState } from "react";
import { Formik, Form } from "formik";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import Router from "next/router";
import { Eye, EyeClosed, Lock, User } from "@phosphor-icons/react";
import * as yup from "yup";

import { AuthContext } from "@/shared/contexts/Auth";
import { FormInput } from "@/shared/components/Input";
import Head from "next/head";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const toggleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  const LoginSchema = yup.object().shape({
    name: yup.string().required("Nome é um campo obrigatório"),
    password: yup.string().required("Senha é um campo obrigatório"),
  });

  const handleLogin = ({ name, password }: IAuthData) => {
    login({ name, password }).then(async (res) => {
      await Router.push("/dashboard");
    });
  };

  return (
    <>
      <Head>
        <title>Entrar</title>
      </Head>

      <div className="flex flex-col w-screen h-screen items-center justify-center overflow-auto">
        <div className="flex flex-col items-center mb-4 gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt="" className="w-52" />
          <h1 className="text-lg text-center font-semibold max-w-xs">
            Seja Bem-Vindo(a) ao Sistema da Prefeitura de Jeronimo Monteiro
          </h1>
        </div>

        <Formik
          initialValues={{ name: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={({ name, password }) => handleLogin({ name, password })}
        >
          {({ errors, touched, values }) => (
            <Form className="flex flex-col items-center w-96 justify-center">
              <div className="flex flex-col w-full gap-8">
                <div className="w-full">
                  <label htmlFor="name" className="mb-2">
                    Nome
                  </label>

                  <FormInput
                    id="name"
                    type="name"
                    name="name"
                    placeholder="Nome"
                    error={errors.name && touched.name ? errors.name : null}
                    iconLeft={<User size={24} />}
                    className="text-lg"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="password" className="mb-2">
                    Senha
                  </label>

                  <FormInput
                    id="password"
                    type={viewPassword ? "text" : "password"}
                    name="password"
                    placeholder="********"
                    error={
                      errors.password && touched.password
                        ? errors.password
                        : null
                    }
                    iconLeft={<Lock size={24} />}
                    iconRight={
                      viewPassword ? (
                        <Eye size={24} onClick={toggleViewPassword} />
                      ) : (
                        <EyeClosed size={24} onClick={toggleViewPassword} />
                      )
                    }
                    className="text-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-background-600 py-2 px-4 rounded-full text-white w-72 mt-8"
              >
                Entrar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["BearerToken"]: token } = parseCookies(ctx);

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
