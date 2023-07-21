import { getChamadoById } from '@/shared/services/Called/view.service';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { ICalled } from '@/shared/interfaces/CalledData';
import moment from 'moment';
import { useState } from 'react';
import {
  patchAlterarPrazo,
  patchAlterarStatus,
} from '@/shared/services/Called/update.service';
import { BlackLoading, WhiteLoading } from '@/shared/components/Loading';
import { WhatsappLogo } from '@phosphor-icons/react';
import { Formik } from 'formik';

interface CalledProps {
  called: ICalled;
}

export default function Called({ called }: CalledProps) {
  const [alterando, setAlterando] = useState<boolean>(false);
  const [alterarSolicitacao, setAlterarSolicitacao] = useState<boolean>(false);
  const [calledView, setCalledView] = useState<ICalled>(called);
  const [alterandoPrazo, setAlterandoPrazo] = useState<boolean>(false);
  const [submmitAlterandoPrazo, setSubmmitAlterandoPrazo] =
    useState<boolean>(false);

  const status = () => {
    switch (calledView.status) {
      case 'VALIDADO':
        return 'Validado';
      case 'CONCLUIDO':
        return 'Concluído';
      case 'EMANDAMENTO':
        return 'Em Andamento';
      default:
        return 'Aguardando Validação';
    }
  };

  const isAlterarSolicitacao = () => {
    setAlterarSolicitacao(!alterarSolicitacao);
  };

  const toggleAlterarPrazo = () => {
    setAlterandoPrazo(!alterandoPrazo);
  };

  const resetCalled = () => {
    getChamadoById({ id: calledView.id }).then((res) =>
      setCalledView(res.data.retorno),
    );
  };

  const resquestAlterarStatus = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setAlterando(true);

    patchAlterarStatus({ id: calledView.id, status: event.target.value })
      .then(() => {
        setAlterarSolicitacao(false);
        resetCalled();
      })
      .finally(() => {
        setTimeout(() => {
          setAlterando(false);
        }, 1000);
      });
  };

  const requestAlterarPrazo = (prazo: string) => {
    setSubmmitAlterandoPrazo(true);

    patchAlterarPrazo({ chamadoId: calledView.id, deadLineDate: prazo })
      .then(() => {
        setSubmmitAlterandoPrazo(false);
        setAlterandoPrazo(false);
        resetCalled();
      })
      .finally(() => {
        setTimeout(() => {
          setSubmmitAlterandoPrazo(false);
        }, 1000);
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-4 mx-4 mt-2 items-center">
        {alterando ? (
          <BlackLoading />
        ) : alterarSolicitacao ? (
          <div className="flex items-center gap-3 py-3 px-3 rounded-md border-2 focus-within:ring-1 ring-secondary">
            <select
              onChange={resquestAlterarStatus}
              value={calledView.status}
              className="bg-transparent h-full flex-1 outline-none cursor-pointer"
            >
              <option value="AGUARDANDOVALIDACAO">Aguardando Validação</option>
              <option value="VALIDADO">Validado</option>
              <option value="EMANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
            </select>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <p className="font-semibold">{status()}</p>
            <button
              onClick={isAlterarSolicitacao}
              className="bg-background-600 py-1 px-4 rounded-full text-white"
            >
              Alterar Status
            </button>
          </div>
        )}

        {!alterandoPrazo && calledView.prazo ? (
          <div className="flex gap-2 items-center">
            <p>
              Prazo final:
              {moment(calledView.prazo).format('DD/MM/YYYY')}
            </p>
            <button
              onClick={toggleAlterarPrazo}
              className="bg-background-600 py-1 px-4 rounded-full text-white"
            >
              Alterar Status
            </button>
          </div>
        ) : (
          <div>
            <label htmlFor="prazo">Prazo final:</label>
            <Formik
              initialValues={{ prazo: '' }}
              onSubmit={(values) => requestAlterarPrazo(values.prazo)}
            >
              {({ values, handleSubmit }) => (
                <div className="flex items-center gap-2">
                  <div className="flex w-full items-center gap-3 py-3 px-3 rounded-md border-2 focus-within:ring-1 ring-secondary">
                    <input
                      id="prazo"
                      type="datetime-local"
                      name="prazo"
                      onBlur={(e) => {
                        values.prazo = e.target.value.toString();
                      }}
                      onChange={(e) => {
                        values.prazo = e.target.value.toString();
                      }}
                      className="bg-transparent h-full w-full flex-1 placeholder:text-gray-400 outline-none"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <button
                    type="submit"
                    onClick={() => {
                      handleSubmit();
                    }}
                    className="bg-background-600 py-1 px-4 rounded-full text-white disabled:opacity-70"
                    disabled={submmitAlterandoPrazo}
                  >
                    {submmitAlterandoPrazo ? (
                      <WhiteLoading text="Alterando..." />
                    ) : (
                      'Definir'
                    )}
                  </button>
                </div>
              )}
            </Formik>
          </div>
        )}

        <p>
          Data de Criação: {moment(calledView.create_At).format('DD/MM/YYYY')}
        </p>

        {calledView.atualizadoEm && (
          <div>
            Data de Atualização:
            {moment(calledView.atualizadoEm).format('DD/MM/YYYY')}
          </div>
        )}

        <div>
          <p className="font-semibold">{calledView.solicitacao.nome}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mx-32">
        <h1 className="text-center font-semibold text-xl">
          Informações Pessoais
          <p className="text-center font-medium text-sm text-gray-600">
            {calledView.descricao}
          </p>
        </h1>

        <table className="border text-center text-sm font-light">
          <thead className="border-b font-medium">
            <tr>
              <th className="border-r px-6 py-4">Nome</th>
              <th className="border-r px-6 py-4">CPF</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                {calledView.nome}
              </td>
              <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                {calledView.cpf}
              </td>
            </tr>
          </tbody>
        </table>

        <h1 className="text-center font-semibold text-xl">
          Informações para Contato
        </h1>
        <table className="border text-center text-sm font-light">
          <thead className="border-b font-medium">
            <tr>
              <th className="border-r px-6 py-4">Email</th>
              <th className="border-r px-6 py-4">Telefone</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                <a
                  href={`mailto:${calledView.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {calledView.email}
                </a>
              </td>
              <td className="flex whitespace-nowrap border-r px-6 py-4 font-medium items-center gap-2 justify-center">
                {calledView.telefone}
                <a
                  href={`https://wa.me/55${calledView.telefone.replace(
                    /\D/g,
                    '',
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-600 transition-all duration-300"
                >
                  <WhatsappLogo size={24} />
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <h1 className="text-center font-semibold text-xl">
          Informações De Endereço
        </h1>
        <table className="border text-center text-sm font-light">
          <thead className="border-b font-medium">
            <tr>
              <th className="border-r px-6 py-4">Ponto de Referência</th>
              <th className="border-r px-6 py-4">Bairro</th>
              <th className="border-r px-6 py-4">Imagem</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                {calledView.pontoDeReferencia}
              </td>
              <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                {calledView.bairro.nome}
              </td>
              <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                <a
                  href={calledView.imagem}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Visualizar Imagem
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['BearerToken']: token } = parseCookies(ctx);

  const { query } = ctx;
  const { id } = query;

  if (!token) {
    return {
      redirect: {
        destination: '/user/login',
        permanent: false,
      },
    };
  }

  let called: ICalled | {} = {};

  try {
    const requestCalled = await getChamadoById({ ctx, id });

    if (requestCalled.data.retorno === null) {
      throw new Error('Não achamos Chamado');
    }

    if (requestCalled.status === 200) {
      called = requestCalled.data.retorno;
    }
  } catch (err) {
    called = {};

    return {
      notFound: true,
    };
  }

  let isLogin = false;

  token ? (isLogin = true) : isLogin;

  return {
    props: {
      isLogin,
      called,
    },
  };
};
