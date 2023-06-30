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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const toggleModalRegister = () => {
    setIsOpen(!isOpen);
  };

  const CreateUserSchema = yup.object().shape({
    email: yup.string().email().required(),
    nome: yup.string().required(),
    sobrenome: yup.string().required(),
    senha: yup.string().min(8).required(),
    cargoId: yup.string(),
  });

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
    RegisterUser({
      nome,
      sobrenome,
      senha,
      email,
      cargoId,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>
          {isOpen ? "Cadastrar novo Funcionário" : "Visualizar Funcionários"}
        </title>
      </Head>

      <Modal isOpen={isOpen} onClose={toggleModalRegister}>
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
            <Form className="flex flex-col justify-center items-center max-w-4xl px-4">
              <div className="w-full my-3">
                <label className="cursor-pointer" htmlFor="email">
                  E-Mail
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
                    className="bg-transparent h-full w-full flex-1 placeholder:text-gray-400 outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Selecione um cargo
                    </option>
                    {cargos.map((cargo) => (
                      <option value={cargo.id} key={cargo.id}>
                        {cargo.nome}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>

              <button
                type="submit"
                className="py-2 px-4 bg-white rounded font-semibold text-black mt-4"
              >
                Criar
              </button>
            </Form>
          )}
        </Formik>
      </Modal>

      <>
        <button
          onClick={() => {
            toggleModalRegister();
          }}
        >
          Adicionar Funcionário
        </button>
      </>
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
  } catch (error) {
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
