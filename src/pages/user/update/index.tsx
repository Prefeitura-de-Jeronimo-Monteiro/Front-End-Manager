import { FormInput } from "@/shared/components/Input";
import { Form, Formik } from "formik";
import Head from "next/head";

export default function Update() {
  return (
    <>
      <Head>
        <title>Alterar Usuário</title>
      </Head>
      <Formik
        initialValues={{ email: "" }}
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
