import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function Dashboard() {
  return (
    <>
      <>Home</>
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
