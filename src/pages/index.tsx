import { Card } from "@/shared/components/Card";
import { Result } from "@/shared/components/Result";
import api from "@/shared/services";
import { getChamados } from "@/shared/services/Called/view.service";
import { User } from "@phosphor-icons/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [result, setResult] = useState({ text: "Teste", status: false });
  const [isOpenResult, setIsOpenResult] = useState<boolean>(false);

  const cardInfos = [
    {
      id: "1",
      title: "Teste",
      description: "Teste",
      icon: <User size={24} />,
      value: "12",
    },
    {
      id: "2",
      title: "Teste",
      description: "Teste",
      icon: <User size={24} />,
      value: "12",
    },
    {
      id: "3",
      title: "Teste",
      description: "Teste",
      icon: <User size={24} />,
      value: "12",
    },
    {
      id: "4",
      title: "Teste",
      description: "Teste",
      icon: <User size={24} />,
      value: "12",
    },
    {
      id: "5",
      title: "Teste",
      description: "Teste",
      icon: <User size={24} />,
      value: "12",
    },
    {
      id: "6",
      title: "Teste",
      description: "Teste",
      icon: <User size={24} />,
      value: "12",
    },
  ];

  const teste = () => {
    const url = "https://api.imgbb.com/1/upload";
    const apiKey = process.env.TOKEN_API_IMG;
    const imageUrl = "https://picsum.photos/200/300";

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        expiration: 600,
        key: apiKey,
      },
    };

    const formData = new URLSearchParams();
    formData.append("image", imageUrl);

    api()
      .post(url, formData.toString(), config)
      .then((response) => {
        console.log(response.data);
        setResult({ text: "Deu bom!", status: true });
      })
      .catch((error) => {
        console.error(error);
        setResult({ text: "Deu erro!", status: false });
      })
      .finally(toggleResult);
  };

  const toggleResult = () => {
    setIsOpenResult(!isOpenResult);
  };

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

  let isLogin = false;

  token ? (isLogin = true) : isLogin;

  return {
    props: {
      isLogin,
    },
  };
};
