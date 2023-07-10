import {useState} from "react";
import Head from "next/head";
import {GetServerSideProps} from "next";

// Libs
import {Check, Pencil, Plus, Trash, X} from "@phosphor-icons/react";
import {Form, Formik} from "formik";
import {parseCookies} from "nookies";

// Services
import {RegisterSector} from "@/shared/services/Sector/create.service";
import {DeleteSectorRequest} from "@/shared/services/Sector/delete.service";
import {getSector} from "@/shared/services/Sector/view.service";
import {updateSectorRequest} from "@/shared/services/Sector/update.service";

// Interfaces
import {ISector} from "@/shared/interfaces/SectorData";

// Components
import {Empty} from "@/shared/components/Empty";
import {FormInput} from "@/shared/components/Input";
import {Modal} from "@/shared/components/Modal";
import {Result} from "@/shared/components/Result";

export default function Sector({sectors}: { sectors: ISector[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [viewSectors, setViewSectors] = useState<ISector[]>(sectors);
  const [deleteSectors, setDeleteSectors] = useState<ISector>({
    id: "",
    nome: "",
  });
  const [result, setResult] = useState({text: "", status: false});
  const [isOpenResult, setIsOpenResult] = useState<boolean>(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);

    setIsOpenResult(false);
  };

  const toggleIsOpenModal = () => {
    setIsOpenModal(!isOpenModal);

    setIsOpenResult(false);
  };

  const toggleResult = () => {
    setIsOpenResult(!isOpenResult);
  };

  const getSectors = () => {
    getSector()
      .then((res) => {
        setViewSectors(res.data.retorno);
      })
      .catch((err) => console.log(err));
  };

  const handleCreateSector = ({nome}: ISector) => {
    setIsOpenResult(false);

    RegisterSector({nome})
      .then((res) => {
        setResult({
          text: res.data.retorno,
          status: true,
        });

        getSectors();
        toggleIsOpen();
      })
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
        toggleResult();
      });
  };

  const deleteSector = (id?: string) => {
    setIsOpenResult(false);

    if (id) {
      DeleteSectorRequest(id)
        .then((res) => {
          setResult({text: res.data.retorno, status: true});

          getSectors();
          toggleIsOpenModal();
          clearDeleteSector();
        })
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
          toggleResult();
        });
    } else {
      DeleteSectorRequest("")
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
          getSectors();
          toggleResult();
        });
    }
  };

  const clearDeleteSector = () => {
    setDeleteSectors({
      id: "",
      nome: "",
    });
  };

  const handleEdit = (id?: string) => {
    const updatedSectors = viewSectors.map((sector) => {
      if (sector.id === id) {
        return {...sector, isEdit: !sector.isEdit};
      }

      return sector;
    });

    setViewSectors(updatedSectors);
  };

  const submitEdit = ({nome, id}: ISector) => {
    console.log(id);

    updateSectorRequest({nome, id})
      .then((res) => {
        getSectors();
        handleEdit(id);

        setResult({
          text: res.data.retorno,
          status: true,
        });
      })
      .catch((err) => {
        setResult({
          text: "Algo deu errado, tente novamente mais tarde!",
          status: false,
        });
      })
      .finally(() => {
        toggleResult();
      });
  };

  return (
    <>
      <Head>
        <title>Setores</title>
      </Head>

      <Modal isOpen={isOpen} onClose={toggleIsOpen}>
        <Formik
          initialValues={{nome: ""}}
          onSubmit={({nome}) => handleCreateSector({nome})}
        >
          {({errors, touched}) => (
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
          <Plus size={18} weight="bold"/> Criar
        </button>
      </div>

      {viewSectors.length > 0 ? (
        <div className="my-4 mx-8 w-screen">
          <table className="w-full">
            <thead className="text-left">
            <tr>
              <th className="text-xl mb-2 ">Nome</th>
            </tr>
            </thead>
            <tbody className="text-left flex gap-3 flex-col">
            {viewSectors.map((sector) => (
              <tr key={sector.id}>
                {sector.isEdit ? (
                  <th className="flex items-center gap-4">
                    <Formik
                      onSubmit={({nome}) =>
                        submitEdit({nome, id: sector.id})
                      }
                      initialValues={{nome: ""}}
                    >
                      {({errors, touched}) => (
                        <Form className="flex items-center gap-4">
                          <FormInput
                            name="nome"
                            id="nome"
                            error={
                              errors.nome && touched.nome ? errors.nome : null
                            }
                            className="w-60"
                          />
                          <div className="flex gap-2">
                            <button
                              className="text-green-500 shadow-md border p-2"
                              type="submit"
                            >
                              <Check size={32}/>
                            </button>

                            <button
                              className="text-red-500 shadow-md border p-2"
                              type="button"
                              onClick={() => {
                                handleEdit(sector.id);
                              }}
                            >
                              <X size={32}/>
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </th>
                ) : (
                  <th className="flex items-center gap-4">
                    <button className="py-2 px-4 bg-gray-500 text-white w-60 font-semibold text-2xl">
                      {sector.nome}
                    </button>

                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 shadow-md border p-2"
                        onClick={() => {
                          handleEdit(sector.id);
                        }}
                      >
                        <Pencil size={32}/>
                      </button>

                      <button
                        className="text-red-500 shadow-md border p-2"
                        onClick={() => {
                          setDeleteSectors({
                            id: sector.id,
                            nome: sector.nome,
                          });

                          toggleIsOpenModal();
                        }}
                      >
                        <Trash size={32}/>
                      </button>
                    </div>
                  </th>
                )}
              </tr>
            ))}
            </tbody>
          </table>

          <Modal onClose={toggleIsOpenModal} isOpen={isOpenModal}>
            <div className="w-80 text-center">
              <h1 className="mb-4 font-semibold text-xl">
                Tem certeza que dejesa deletar o {deleteSectors?.nome}
              </h1>

              <div className="flex justify-center gap-6 my-2">
                <button
                  className="bg-white py-1 px-2 rounded text-green-600"
                  onClick={() => deleteSector(deleteSectors.id)}
                >
                  <Check size={32}/>
                </button>
                <button
                  className="bg-white py-1 px-2 rounded text-red-600"
                  onClick={() => {
                    clearDeleteSector();
                    toggleIsOpenModal();
                  }}
                >
                  <X size={32}/>
                </button>
              </div>
            </div>
          </Modal>
        </div>
      ) : (
        <Empty/>
      )}

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

  let sectors;
  try {
    const requestSector = await getSector(ctx);

    if (requestSector.status === 200) {
      sectors = requestSector.data.retorno;
    }
  } catch (err) {
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
