import { useContext } from "react";
import { Formik, Form, Field } from "formik";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import * as yup from "yup";

import { AuthContext } from "@/shared/contexts/Auth";
import { FormInput } from "@/shared/components/Input";
import Router from "next/router";

export default function Login() {
  const { login } = useContext(AuthContext);

  const LoginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Esse e-mail não é válido")
      .required("E-Mail é um campo Obrigatório"),
    password: yup.string().required("Senha é um campo Obrigatório"),
  });

  const handleLogin = ({ email, password }: IAuthData) => {
    login({ email, password }).then(async (res) => {
      await Router.push("/dashboard");
    });
  };

  return (
    <>
      <div className="flex w-screen h-screen items-center justify-center overflow-auto">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={({ email, password }) => handleLogin({ email, password })}
        >
          {({ errors, touched, values }) => (
            <Form className="flex flex-col items-center w-96 h-96 justify-center border-2 rounded-lg p-4">
              <h1 className="text-2xl font-semibold ">Entrar</h1>

              <div className="flex flex-col w-full my-3">
                <FormInput type="email" name="email" placeholder="E-Mail" />
                {errors.email && touched.email ? (
                  <span className="text-red-500">{errors.email}</span>
                ) : null}
              </div>

              <div className="flex flex-col w-full my-3">
                <FormInput
                  type="password"
                  name="password"
                  placeholder="Senha"
                />
                {errors.password && touched.password ? (
                  <span className="text-red-500">{errors.password}</span>
                ) : null}
              </div>

              <button
                type="submit"
                className="bg-background-600 py-2 px-4 rounded text-white"
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
        destination: "/dashboard",
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
