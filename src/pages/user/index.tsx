import { Error } from "@/shared/components/Error";
import { FormInput } from "@/shared/components/Input";
import { Modal } from "@/shared/components/Modal";
import { IResgister } from "@/shared/interfaces/RegisterData";
import { IRoles } from "@/shared/interfaces/RolesData";
import api from "@/shared/services";
import { RegisterUser } from "@/shared/services/User/create.service";
import {
  Envelope,
  Eye,
  EyeClosed,
  User as IconUser,
} from "@phosphor-icons/react";
import { Field, Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useState } from "react";
import * as yup from "yup";

interface CreateUserProps {
  cargos: IRoles[];
}

export default function User({ cargos }: CreateUserProps) {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [result, setResult] = useState({ text: "", status: false });
  const [isOpenResult, setIsOpenResult] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);

  const CreateUserSchema = yup.object().shape({
    email: yup
      .string()
      .email("E-Mail não é válido.")
      .required("E-Mail é um campo obrigatório."),
    nome: yup.string().required("Nome é um campo obrigatório."),
    sobrenome: yup.string().required("Sobrenome é um campo obrigatório."),
    senha: yup
      .string()
      .min(8, "Deve conter no mínimo 8 caracteres.")
      .required("Senha é um campo obrigatório."),
    cargoId: yup.string().required("Cargo é um campo obrigatório."),
  });

  const toggleResult = () => {
    setIsOpenResult(!isOpenResult);
  };

  const toggleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  const handleCreate = ({
    nome,
    sobrenome,
    senha,
    email,
    cargoId,
  }: IResgister) => {
    setSubmiting(true);

    RegisterUser({
      nome,
      sobrenome,
      senha,
      email,
      cargoId,
    })
      .then((res) => {})
      .catch((err) => {
        try {
          setResult({
            text: err.response.data,
            status: false,
          });
        } catch (error) {
          setResult({
            text: "Algo deu errado, tente novamente mais tarde!",
            status: false,
          });
        }
      })
      .finally(() => {
        setSubmiting(false);
        toggleResult();
      });
  };

  return (
    <>
      <Head>
        <title>Cadastrar novo Funcionário</title>
      </Head>

      <Formik
        initialValues={{
          email: "",
          nome: "",
          sobrenome: "",
          senha: "",
          cargoId: "",
        }}
        onSubmit={({ sobrenome, senha, nome, email, cargoId }) =>
          handleCreate({ sobrenome, senha, nome, email, cargoId })
        }
        validationSchema={CreateUserSchema}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col mx-auto my-24 justify-center items-center max-w-4xl px-4">
            <div className="w-full my-3">
              <label className="cursor-pointer" htmlFor="email">
                E-Mail{" "}
                <span className="text-xs italic">
                  (Será enviado um e-mail com a senha temporária)
                </span>
              </label>
              <FormInput
                id="email"
                type="email"
                name="email"
                error={errors.email && touched.email ? errors.email : null}
                iconLeft={<Envelope size={24} />}
              />
            </div>

            <div className="w-full my-3">
              <label className="cursor-pointer" htmlFor="nome">
                Nome
              </label>
              <FormInput
                id="nome"
                name="nome"
                error={errors.nome && touched.nome ? errors.nome : null}
                iconLeft={<IconUser size={24} />}
              />
            </div>

            <div className="w-full my-3">
              <label className="cursor-pointer" htmlFor="sobrenome">
                Sobrenome
              </label>
              <FormInput
                id="sobrenome"
                name="sobrenome"
                error={
                  errors.sobrenome && touched.sobrenome
                    ? errors.sobrenome
                    : null
                }
                iconLeft={<IconUser size={24} />}
              />
            </div>

            <div className="w-full my-3">
              <label className="cursor-pointer" htmlFor="senha">
                Senha Temporária
              </label>
              <FormInput
                id="senha"
                type={viewPassword ? "text" : "password"}
                name="senha"
                error={errors.senha && touched.senha ? errors.senha : null}
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
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="cursor-pointer" htmlFor="cargo">
                Cargo
              </label>
              <div className="flex w-full items-center gap-3 py-3 px-3 rounded-md border-2 focus-within:ring-1 ring-secondary">
                <Field
                  as="select"
                  name="cargoId"
                  id="cargo"
                  className="bg-transparent h-full w-full flex-1 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Selecione um cargo
                  </option>
                  {cargos.map((cargo) => (
                    <option
                      value={cargo.id}
                      key={cargo.id}
                      className="text-black"
                    >
                      {cargo.nome}
                    </option>
                  ))}
                </Field>
              </div>

              {errors.cargoId && touched.cargoId ? (
                <Error text={errors.cargoId} />
              ) : null}
            </div>

            <button
              type="submit"
              className="bg-background-600 py-2 px-4 rounded-full text-white w-72 mt-8 disabled:opacity-70"
            >
              Criar
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["BearerToken"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  }

  let cargos;
  try {
    const response = await api(ctx).get("cargo");

    if (response.status === 200) {
      cargos = response.data.retorno;
    }
  } catch (err) {
    cargos = [];
  }

  let isLogin = false;

  token ? (isLogin = true) : isLogin;

  return {
    props: {
      isLogin,
      cargos,
    },
  };
};
