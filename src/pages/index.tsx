import { Card } from '@/shared/components/Card';

import { ICalled } from '@/shared/interfaces/CalledData';
import {
  getChamadoByStatus,
  getChamados,
} from '@/shared/services/Called/view.service';
import { WhatsappLogo } from '@phosphor-icons/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { CardInfo, filterValue } from '@/shared/utils/values';
import { BlackLoading } from '@/shared/components/Loading';

interface DashboardProps {
  calleds: ICalled[];
}

export default function Dashboard({ calleds }: DashboardProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [viewCalleds, setViewCalleds] = useState(calleds);
  const [cardsInfo, setCardsInfo] = useState<CardInfo[]>([]);

  const router = useRouter();

  useEffect(() => {
    setCardsInfo(filterValue(calleds));
  }, []);

  const requestCalled = () => {
    setLoading(true);

    getChamados()
      .then((res) => {
        setViewCalleds(res.data.retorno);
        setCardsInfo(filterValue(res.data.retorno));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const requestCalledByStatus = (status: string) => {
    setLoading(true);

    getChamadoByStatus(status)
      .then((res) => {
        setViewCalleds(res.data.retorno);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const infoCalled = (id: string) => {
    router.push(`called/${id}`);
  };

  return (
    <>
      <Head>
        <title>Dashboard | Atendimentos</title>
      </Head>

      <button
        className="bg-background-600 py-1 px-4 ml-2 mt-2 rounded-full text-white"
        onClick={requestCalled}
      >
        Atualizar Pedidos
      </button>
      <button
        className="bg-background-600 py-1 px-4 ml-2 mt-2 rounded-full text-white"
        onClick={() => {
          setViewCalleds(calleds);
        }}
      >
        Remover Filtro
      </button>

      <div className="flex gap-2 flex-wrap mx-4 my-2 justify-center">
        {cardsInfo.map((cardInfo) => (
          <Card
            key={cardInfo.id}
            title={cardInfo.title}
            icon={cardInfo.icon}
            value={cardInfo.value}
            description={cardInfo.description}
            onClick={() => {
              requestCalledByStatus(cardInfo.status);
            }}
          />
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-screen mt-20">
          <BlackLoading />
        </div>
      ) : (
        <div className="py-4 px-8 w-screen mb-20">
          <table className="min-w-full border text-center text-sm font-light">
            <thead className="border-b font-medium">
              <tr>
                <th className="border-r px-6 py-4">Nome</th>
                <th className="border-r px-6 py-4">CPF</th>
                <th className="border-r px-6 py-4">Descrição</th>
                <th className="border-r px-6 py-4">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {viewCalleds.map((called) => (
                <tr
                  onClick={() => {
                    infoCalled(called.id);
                  }}
                  className="border-b cursor-pointer hover:bg-slate-200 transition-all duration-300"
                  key={called.id}
                >
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                    {called.nome}
                  </td>
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                    {called.cpf}
                  </td>
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium">
                    {called.descricao}
                  </td>
                  <td className="flex whitespace-nowrap border-r px-6 py-4 font-medium items-center gap-2 justify-center">
                    {called.telefone}

                    <a
                      href={`https://wa.me/55${called.telefone.replace(
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['BearerToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/user/login',
        permanent: false,
      },
    };
  }

  let calleds;

  try {
    const requestSector = await getChamados(ctx);

    if (requestSector.status === 200) {
      calleds = requestSector.data.retorno;
    }
  } catch (err) {
    calleds = [];
  }

  let isLogin = false;

  token ? (isLogin = true) : isLogin;

  return {
    props: {
      isLogin,
      calleds,
    },
  };
};
