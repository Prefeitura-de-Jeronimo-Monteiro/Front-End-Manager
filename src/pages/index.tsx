import {Card} from "@/shared/components/Card";
import {getChamados} from "@/shared/services/Called/view.service";
import {User} from "@phosphor-icons/react";
import {GetServerSideProps} from "next";
import Head from "next/head";
import {parseCookies} from "nookies";
import {useEffect, useState} from "react";

interface DashboardProps {
  calleds: [];
}

export default function Dashboard({calleds}: DashboardProps) {
  const [viewCalleds, setViewCalleds] = useState(calleds);

  const cardInfos = [
    {
      id: "1",
      title: "Teste",
      description: "Teste",
      icon: <User size={24}/>,
      value: "12",
    },
    {
      id: "2",
      title: "Teste",
      description: "Teste",
      icon: <User size={24}/>,
      value: "12",
    },
    {
      id: "3",
      title: "Teste",
      description: "Teste",
      icon: <User size={24}/>,
      value: "12",
    },
    {
      id: "4",
      title: "Teste",
      description: "Teste",
      icon: <User size={24}/>,
      value: "12",
    },
    {
      id: "5",
      title: "Teste",
      description: "Teste",
      icon: <User size={24}/>,
      value: "12",
    },
    {
      id: "6",
      title: "Teste",
      description: "Teste",
      icon: <User size={24}/>,
      value: "12",
    },
  ];

  const requestCalled = () => {
    getChamados().then((res) => console.log(res));
  };

  useEffect(() => {
    requestCalled();
  }, []);

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
          />
        ))}
      </div>

      <div className="my-4 mx-8 w-screen">
        <table className="w-full">
          <thead className="text-left">
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Teste</td>
            <td>12</td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
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
