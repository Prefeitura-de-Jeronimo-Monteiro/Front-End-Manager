import { getChamadoById } from '@/shared/services/Called/view.service';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

interface CalledProps {
  called: ICalled | {};
}

export default function Called({ called }: CalledProps) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <div>{id}</div>
    </>
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
