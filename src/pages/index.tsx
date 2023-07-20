import { Card } from '@/shared/components/Card';
import { IValues } from '@/shared/interfaces/ValuesData';
import { ICalled } from '@/shared/interfaces/CalledData';
import {
  getChamadoByStatus,
  getChamados,
} from '@/shared/services/Called/view.service';
import { User, WhatsappLogo } from '@phosphor-icons/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useState } from 'react';

interface DashboardProps {
  calleds: ICalled[];
}

export default function Dashboard({ calleds }: DashboardProps) {
  const [viewCalleds, setViewCalleds] = useState(calleds);
  const router = useRouter();

  const cardInfos = [
    {
      id: '2',
      title: 'Em Andamento',
      description: 'Chamados que estão com prazo não excedido',
      icon: <User size={24} />,
      value: '12',
      status: 'EMANDAMENTO',
    },
    {
      id: '3',
      title: 'Aguardando Validação',
      description: 'Chamados que estão com prazo exedido',
      icon: <User size={24} />,
      value: '12',
      status: 'AGUARDANDOVALIDACAO',
    },
    {
      id: '4',
      title: 'Concluidos',
      description: 'Chamados finalizados',
      icon: <User size={24} />,
      value: '12',
      status: 'CONCLUIDO',
    },
  ];

  const requestCalled = () => {
    getChamados().then((res) => setViewCalleds(res.data.retorno));
  };

  const requestCalledByStatus = (status: string) => {
    getChamadoByStatus(status).then((res) => {
      setViewCalleds(res.data.retorno);
      console.log(res.data);
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
      <div className="flex gap-2 flex-wrap mx-4 my-2 justify-center">
        {cardInfos.map((cardInfo) => (
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
                className="border-b cursor-pointer"
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
                  >
                    <WhatsappLogo size={24} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
