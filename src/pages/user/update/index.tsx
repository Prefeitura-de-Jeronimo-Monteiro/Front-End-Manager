import { FormInput } from '@/shared/components/Input';
import { Form, Formik } from 'formik';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';

export default function Update() {
  return (
    <>
      <Head>
        <title>Alterar Usuário</title>
      </Head>

      <Formik
        initialValues={{ email: '' }}
        onSubmit={(values) => console.log(values)}
      >
        {({ errors }) => (
          <Form>
            <FormInput name="email" error={errors.email || null} />
          </Form>
        )}
      </Formik>
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

  let isLogin = false;

  token ? (isLogin = true) : isLogin;

  return {
    props: {
      isLogin,
    },
  };
};
