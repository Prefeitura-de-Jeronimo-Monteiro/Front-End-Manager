import { getChamadoById } from '@/shared/services/Called/view.service';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { ICalled } from '@/shared/interfaces/CalledData';
import moment from 'moment';
import { useState } from 'react';
import { patchAlterarStatus } from '@/shared/services/Called/update.service';
import { BlackLoading } from '@/shared/components/Loading';
import { WhatsappLogo } from '@phosphor-icons/react';

interface CalledProps {
  called: ICalled;
}

export default function Called({ called }: CalledProps) {
  const [alterando, setAlterando] = useState<boolean>(false);
  const [alterarSolicitacao, setAlterarSolicitacao] = useState<boolean>(false);
  const [calledView, setCalledView] = useState<ICalled>(called);

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4 mx-4 mt-2">
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

        {calledView.prazo && (
          <div>
            Prazo final:
            {moment(calledView.prazo).format('DD/MM/YYYY')}
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

      <div className="flex flex-col gap-4 mx-4">
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
