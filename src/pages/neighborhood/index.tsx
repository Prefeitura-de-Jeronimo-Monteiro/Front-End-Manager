import {useState} from "react";
import {parseCookies} from "nookies";
import {GetServerSideProps} from "next";
import Head from "next/head";

// Libs
import {Check, Pencil, Plus, Trash, X} from "@phosphor-icons/react";
import {Form, Formik} from "formik";

// Services
import {RegisterNeighborhood} from "@/shared/services/Neighborhood/create.service";
import {DeleteNeighborhoodRequest} from "@/shared/services/Neighborhood/delete.service";
import {getNeighborhood} from "@/shared/services/Neighborhood/view.service";
import {updateNeighborhoodRequest} from "@/shared/services/Neighborhood/update.service";

// Interfaces
import {INeighborhood} from "@/shared/interfaces/NeighborhoodData";

// Components
import {Empty} from "@/shared/components/Empty";
import {FormInput} from "@/shared/components/Input";
import {Modal} from "@/shared/components/Modal";
import {Result} from "@/shared/components/Result";

export default function Neighborhood({
                                       neighborhoods,
                                     }: {
  neighborhoods: INeighborhood[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [viewNeighborhoods, setViewNeighborhoods] =
    useState<INeighborhood[]>(neighborhoods);
  const [deleteNeighborhoods, setDeleteNeighborhoods] = useState<INeighborhood>(
    {
      id: "",
      nome: "",
    }
  );
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

  const getNeighborhoods = () => {
    getNeighborhood()
      .then((res) => {
        setViewNeighborhoods(res.data.retorno);
      })
      .catch((err) => console.log(err));
  };

  const handleCreateNeighborhood = ({nome}: INeighborhood) => {
    setIsOpenResult(false);

    RegisterNeighborhood({nome})
      .then((res) => {
        setResult({
          text: res.data.retorno,
          status: true,
        });

        getNeighborhoods();
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

  const deleteNeighborhood = (id?: string) => {
    setIsOpenResult(false);

    if (id) {
      DeleteNeighborhoodRequest(id)
        .then((res) => {
          setResult({text: res.data.retorno, status: true});

          getNeighborhoods();
          toggleIsOpenModal();
          clearDeleteNeighborhood();
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
      DeleteNeighborhoodRequest("")
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
          getNeighborhoods();
          toggleResult();
        });
    }
  };

  const clearDeleteNeighborhood = () => {
    setDeleteNeighborhoods({
      id: "",
      nome: "",
    });
  };

  const handleEdit = (id?: string) => {
    const updatedNeighborhoods = viewNeighborhoods.map((neighborhood) => {
      if (neighborhood.id === id) {
        return {...neighborhood, isEdit: !neighborhood.isEdit};
      }

      return neighborhood;
    });

    setViewNeighborhoods(updatedNeighborhoods);
  };

  const submitEdit = ({nome, id}: INeighborhood) => {
    console.log(id);

    updateNeighborhoodRequest({nome, id})
      .then((res) => {
        getNeighborhoods();
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
        <title>Bairros</title>
      </Head>

      <Modal isOpen={isOpen} onClose={toggleIsOpen}>
        <Formik
          initialValues={{nome: ""}}
          onSubmit={({nome}) => handleCreateNeighborhood({nome})}
        >
          {({errors, touched}) => (
            <Form className="flex flex-col items-center gap-4 px-4">
              <h1 className="font-bold text-2xl">Criar Bairros</h1>
              <div>
                <label htmlFor="nome">Nome do Bairro</label>
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
                Criar Bairro
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

      {viewNeighborhoods.length > 0 ? (
        <div className="my-4 mx-8 w-screen">
          <table className="w-full">
            <thead className="text-left">
            <tr>
              <th className="text-xl mb-2 ">Nome</th>
            </tr>
            </thead>
            <tbody className="text-left flex gap-3 flex-col">
            {viewNeighborhoods.map((neighborhood) => (
              <tr key={neighborhood.id}>
                {neighborhood.isEdit ? (
                  <th className="flex items-center gap-4">
                    <Formik
                      onSubmit={({nome}) =>
                        submitEdit({nome, id: neighborhood.id})
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
                                handleEdit(neighborhood.id);
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
                      {neighborhood.nome}
                    </button>

                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 shadow-md border p-2"
                        onClick={() => {
                          handleEdit(neighborhood.id);
                        }}
                      >
                        <Pencil size={32}/>
                      </button>

                      <button
                        className="text-red-500 shadow-md border p-2"
                        onClick={() => {
                          setDeleteNeighborhoods({
                            id: neighborhood.id,
                            nome: neighborhood.nome,
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
                Tem certeza que dejesa deletar o {deleteNeighborhoods?.nome}
              </h1>

              <div className="flex justify-center gap-6 my-2">
                <button
                  className="bg-white py-1 px-2 rounded text-green-600"
                  onClick={() => deleteNeighborhood(deleteNeighborhoods.id)}
                >
                  <Check size={32}/>
                </button>
                <button
                  className="bg-white py-1 px-2 rounded text-red-600"
                  onClick={() => {
                    clearDeleteNeighborhood();
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

  let neighborhoods;
  try {
    const requestNeighborhood = await getNeighborhood(ctx);

    if (requestNeighborhood.status === 200) {
      neighborhoods = requestNeighborhood.data.retorno;
    }
  } catch (err) {
    neighborhoods = [];
  }

  let isLogin = false;

  token ? (isLogin = true) : isLogin;

  return {
    props: {
      isLogin,
      neighborhoods,
    },
  };
};
