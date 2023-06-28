import { useContext, useState } from "react";
import { Formik, Form } from "formik";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import Router from "next/router";
import {
  Eye,
  EyeClosed,
  Lock,
  LockKey,
  LockOpen,
  User,
} from "@phosphor-icons/react";
import * as yup from "yup";

import { AuthContext } from "@/shared/contexts/Auth";
import { FormInput } from "@/shared/components/Input";
import Head from "next/head";
import { IResetPassword } from "@/shared/interfaces/ResetPasswordData";

interface ResetPasswordProps {
  name: string;
}

export default function Login({ name }: ResetPasswordProps) {
  const { resetPassword } = useContext(AuthContext);
  const [viewOldPassword, setViewOldPassword] = useState<boolean>(false);
  const [viewNewPassword, setViewNewPassword] = useState<boolean>(false);
  const [viewConfirmPassword, setViewConfirmPassword] =
    useState<boolean>(false);

  const toggleViewOldPassword = () => {
    setViewOldPassword(!viewOldPassword);
  };

  const toggleViewNewPassword = () => {
    setViewNewPassword(!viewNewPassword);
  };

  const toggleViewConfirmPassword = () => {
    setViewConfirmPassword(!viewConfirmPassword);
  };

  const ResetPasswordSchema = yup.object().shape({
    password: yup.string().required("Senha Temporária é um campo obrigatório"),
    newPassword: yup.string().required("Nova senha é um campo obrigatório"),
    confirmPassword: yup
      .string()
      .when("newPassword", (newPassword, field) =>
        newPassword
          ? field
              .required("Confirme sua senha")
              .oneOf([yup.ref("newPassword")], "As senhas não coincidem")
          : field
      ),
  });

  const handleLogin = ({ password, newPassword }: IResetPassword) => {
    resetPassword({ password, newPassword, name })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Head>
        <title>Alterar Senha</title>
      </Head>

      <div className="flex flex-col w-screen h-screen items-center justify-center overflow-auto">
        <div className="flex flex-col items-center mb-4 gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt="" className="w-52" />
          <div className="text-center">
            <h1 className="text-lg font-semibold max-w-xs">
              Seja Bem-Vindo(a) ao Sistema da Prefeitura de Jeronimo Monteiro
            </h1>
            <span className="text-gray-600 font-medium">{name}</span>
          </div>
        </div>

        <Formik
          initialValues={{ password: "", newPassword: "", confirmPassword: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={({ password, newPassword }) =>
            handleLogin({ password, newPassword, name: "" })
          }
        >
          {({ errors, touched, values }) => (
            <Form className="flex flex-col items-center w-96 justify-center">
              <div className="flex flex-col w-full gap-8">
                <div className="w-full">
                  <label htmlFor="password" className="mb-2">
                    Senha Temporária
                  </label>

                  <FormInput
                    id="password"
                    type={viewOldPassword ? "text" : "password"}
                    name="password"
                    placeholder="********"
                    error={
                      errors.password && touched.password
                        ? errors.password
                        : null
                    }
                    iconLeft={<LockOpen size={24} />}
                    iconRight={
                      viewOldPassword ? (
                        <Eye size={24} onClick={toggleViewOldPassword} />
                      ) : (
                        <EyeClosed size={24} onClick={toggleViewOldPassword} />
                      )
                    }
                    className="text-lg"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="newPassword" className="mb-2">
                    Nova Senha
                  </label>

                  <FormInput
                    id="newPassword"
                    type={viewNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="********"
                    error={
                      errors.newPassword && touched.newPassword
                        ? errors.newPassword
                        : null
                    }
                    iconLeft={<Lock size={24} />}
                    iconRight={
                      viewNewPassword ? (
                        <Eye size={24} onClick={toggleViewNewPassword} />
                      ) : (
                        <EyeClosed size={24} onClick={toggleViewNewPassword} />
                      )
                    }
                    className="text-lg"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="confirmPassword" className="mb-2">
                    Confirmar Nova Senha
                  </label>

                  <FormInput
                    id="confirmPassword"
                    type={viewConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="********"
                    error={
                      errors.confirmPassword && touched.confirmPassword
                        ? errors.confirmPassword
                        : null
                    }
                    iconLeft={<LockKey size={24} />}
                    iconRight={
                      viewConfirmPassword ? (
                        <Eye size={24} onClick={toggleViewConfirmPassword} />
                      ) : (
                        <EyeClosed
                          size={24}
                          onClick={toggleViewConfirmPassword}
                        />
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
                Mudar Senha
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
  const { ["tempUser"]: name } = parseCookies(ctx);

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
      name,
    },
  };
};
