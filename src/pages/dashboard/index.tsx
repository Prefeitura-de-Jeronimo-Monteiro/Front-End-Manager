import { AuthContext } from "@/shared/contexts/Auth";
import { GetServerSideProps } from "next";
import { useContext } from "react";
import { parseCookies } from "nookies";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <h1>Meu nome é: {user.name}</h1>
      <h2>caso queira entrar em contato: {user.email}</h2>
      <h3>Meu identificador é: {user.id}</h3>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["BearerToken"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
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
