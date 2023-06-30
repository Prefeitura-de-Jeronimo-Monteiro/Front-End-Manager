import { Empty } from "@/shared/components/Empty";
import { FormInput } from "@/shared/components/Input";
import { Modal } from "@/shared/components/Modal";
import { ISector } from "@/shared/interfaces/SectorData";
import api from "@/shared/services";
import { RegisterSector } from "@/shared/services/Sector/create.service";
import { getSector } from "@/shared/services/Sector/view.service";
import { Plus } from "@phosphor-icons/react";
import { Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { parseCookies } from "nookies";
import { useState } from "react";

interface SectorProps {
  sectors: ISector[];
}

export default function Sector({ sectors }: SectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewSectors, setViewSectors] = useState<ISector[]>(sectors);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const getSectors = () => {
    getSector()
      .then((res) => {
        setViewSectors(res.data.retorno);
      })
      .catch((err) => console.log(err));
  };

  const handleCreateSector = ({ nome }: ISector) => {
    RegisterSector({ nome })
      .then(() => {
        getSectors();
        toggleIsOpen();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Setores</title>
      </Head>

      <Modal isOpen={isOpen} onClose={toggleIsOpen}>
        <Formik
          initialValues={{ nome: "" }}
          onSubmit={({ nome }) => handleCreateSector({ nome })}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col items-center gap-4 px-4">
              <h1 className="font-bold text-2xl">Criar Setores</h1>
              <div>
                <label htmlFor="nome">Nome do Setor</label>
                <FormInput
                  name="nome"
                  id="nome"
                  error={errors.nome && touched.nome ? errors.nome : null}
                />
              </div>

              <button
                type="submit"
                className="py-2 px-4 bg-white text-black rounded font-semibold"
              >
                Criar Setor
              </button>
            </Form>
          )}
        </Formik>
      </Modal>

      <div className="w-full flex items-center justify-end p-2">
        <button
          className="bg-green-400 rounded-md flex items-center gap-1 py-2 px-4 select-none"
          onClick={toggleIsOpen}
        >
          <Plus size={18} weight="bold" /> Criar
        </button>
      </div>

      {viewSectors.length > 0 ? (
        <>
          {viewSectors.map((sector) => (
            <div key={sector.id}>{sector.nome}</div>
          ))}
        </>
      ) : (
        <Empty />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["BearerToken"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "user/login",
        permanent: false,
      },
    };
  }

  let sectors;
  try {
    const requestSector = await getSector();

    if (requestSector.status === 200) {
      sectors = requestSector.data.retorno;
    }
  } catch (error) {
    sectors = [];
  }

  let isLogin = false;

  token ? (isLogin = true) : isLogin;

  return {
    props: {
      isLogin,
      sectors,
    },
  };
};
