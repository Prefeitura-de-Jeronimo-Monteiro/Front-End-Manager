import { useContext } from "react";
import { Formik, Form, Field } from "formik";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import * as yup from "yup";

import { AuthContext } from "@/shared/contexts/Auth";
import { FormInput } from "@/shared/components/Input";

export default function Register() {
  const { register } = useContext(AuthContext);

  const RegisterSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Nome deve haver no mínimo 3 caracteres")
      .required("Nome é um campo Obrigatório"),
    email: yup
      .string()
      .email("Esse e-mail não é válido")
      .required("E-Mail é um campo Obrigatório"),
    password: yup.string().required("Senha é um campo Obrigatório"),
  });

  const handleRegister = ({ email, password, name }: IRegisterData) => {
    register({ email, password, name }).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <div className="flex w-screen h-screen items-center justify-center overflow-auto">
        <Formik
          initialValues={{ email: "", password: "", name: "" }}
          validationSchema={RegisterSchema}
          onSubmit={({ email, password, name }) =>
            handleRegister({ email, password, name })
          }
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col items-center w-96 h-96 justify-center border-2 rounded-lg p-4">
              <h1 className="text-2xl font-semibold ">Cadastrar-se</h1>

              <div className="flex flex-col w-full my-3">
                <FormInput type="text" name="name" placeholder="Nome" />
                {errors.name && touched.name ? (
                  <span className="text-red-500">{errors.name}</span>
                ) : null}
              </div>

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
                Cadastrar-se
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
