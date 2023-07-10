import { useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";

// Libs
import { Check, Pencil, Plus, Trash, X } from "@phosphor-icons/react";
import { Form, Formik } from "formik";
import { parseCookies } from "nookies";

// Services
import { RegisterRoad } from "@/shared/services/Road/create.service";
import { DeleteRoadRequest } from "@/shared/services/Road/delete.service";
import { getRoad } from "@/shared/services/Road/view.service";
import { updateRoadRequest } from "@/shared/services/Road/update.service";

// Components
import { Empty } from "@/shared/components/Empty";
import { FormInput } from "@/shared/components/Input";
import { Modal } from "@/shared/components/Modal";
import { Result } from "@/shared/components/Result";

// Interfaces
import { IRoad } from "@/shared/interfaces/RoadData";

export default function Road({ road }: { road: IRoad[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [viewRoads, setViewRoads] = useState<IRoad[]>(road);
  const [deleteRoads, setDeleteRoad] = useState<IRoad>({
    id: "",
    nome: "",
  });
  const [result, setResult] = useState({ text: "", status: false });
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

  const getRoads = () => {
    getRoad()
      .then((res) => {
        setViewRoads(res.data.retorno);
      })
      .catch((err) => console.log(err));
  };

  const handleCreateRoad = ({ nome }: IRoad) => {
    setIsOpenResult(false);

    RegisterRoad({ nome })
      .then((res) => {
        setResult({
          text: res.data.retorno,
          status: true,
        });

        getRoads();
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

  const deleteRoad = (id?: string) => {
    setIsOpenResult(false);

    if (id) {
      DeleteRoadRequest(id)
        .then((res) => {
          setResult({ text: res.data.retorno, status: true });

          getRoads();
          toggleIsOpenModal();
          clearDeleteRoad();
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
      DeleteRoadRequest("")
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
          getRoads();
          toggleResult();
        });
    }
  };

  const clearDeleteRoad = () => {
    setDeleteRoad({
      id: "",
      nome: "",
    });
  };

  const handleEdit = (id?: string) => {
    const updatedroad = viewRoads.map((road) => {
      if (road.id === id) {
        return { ...road, isEdit: !road.isEdit };
      }

      return road;
    });

    setViewRoads(updatedroad);
  };

  const submitEdit = ({ nome, id }: IRoad) => {
    console.log(id);

    updateRoadRequest({ nome, id })
      .then((res) => {
        getRoads();
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
        <title>Ruas</title>
      </Head>

      <Modal isOpen={isOpen} onClose={toggleIsOpen}>
        <Formik
          initialValues={{ nome: "" }}
          onSubmit={({ nome }) => handleCreateRoad({ nome })}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col items-center gap-4 px-4">
              <h1 className="font-bold text-2xl">Criar Rua</h1>
              <div>
                <label htmlFor="nome">Nome da Rua</label>
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
                Criar Rua
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

      {viewRoads.length > 0 ? (
        <div className="my-4 mx-8 w-screen">
          <table className="w-full">
            <thead className="text-left">
              <tr>
                <th className="text-xl mb-2 ">Nome</th>
              </tr>
            </thead>
            <tbody className="text-left flex gap-3 flex-col">
              {viewRoads.map((road) => (
                <tr key={road.id}>
                  {road.isEdit ? (
                    <th className="flex items-center gap-4">
                      <Formik
                        onSubmit={({ nome }) =>
                          submitEdit({ nome, id: road.id })
                        }
                        initialValues={{ nome: "" }}
                      >
                        {({ errors, touched }) => (
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
                                <Check size={32} />
                              </button>

                              <button
                                className="text-red-500 shadow-md border p-2"
                                type="button"
                                onClick={() => {
                                  handleEdit(road.id);
                                }}
                              >
                                <X size={32} />
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </th>
                  ) : (
                    <th className="flex items-center gap-4">
                      <button className="py-2 px-4 bg-gray-500 text-white w-60 font-semibold text-2xl">
                        {road.nome}
                      </button>

                      <div className="flex gap-2">
                        <button
                          className="text-blue-500 shadow-md border p-2"
                          onClick={() => {
                            handleEdit(road.id);
                          }}
                        >
                          <Pencil size={32} />
                        </button>

                        <button
                          className="text-red-500 shadow-md border p-2"
                          onClick={() => {
                            setDeleteRoad({
                              id: road.id,
                              nome: road.nome,
                            });

                            toggleIsOpenModal();
                          }}
                        >
                          <Trash size={32} />
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
                Tem certeza que dejesa deletar o {deleteRoads?.nome}
              </h1>

              <div className="flex justify-center gap-6 my-2">
                <button
                  className="bg-white py-1 px-2 rounded text-green-600"
                  onClick={() => deleteRoad(deleteRoads.id)}
                >
                  <Check size={32} />
                </button>
                <button
                  className="bg-white py-1 px-2 rounded text-red-600"
                  onClick={() => {
                    clearDeleteRoad();
                    toggleIsOpenModal();
                  }}
                >
                  <X size={32} />
                </button>
              </div>
            </div>
          </Modal>
        </div>
      ) : (
        <Empty />
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
  const { ["BearerToken"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  }

  let road;
  try {
    const requestRoad = await getRoad(ctx);

    if (requestRoad.status === 200) {
      road = requestRoad.data.retorno;
    }
  } catch (err) {
    road = [];
  }

  let isLogin = false;

  token ? (isLogin = true) : isLogin;

  return {
    props: {
      isLogin,
      road,
    },
  };
};
