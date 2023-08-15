import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/Auth';
import Image from 'next/image';
import { List } from '@phosphor-icons/react';
import { Drawer } from '../Drawer';
import { IRoutes } from '../../interfaces/RoutesData';
import { RoutesProps } from '../../routes';
import { NestedRoutes } from './Route';
import { Modal } from '../Modal';
import { Form, Formik } from 'formik';
import { FormInput } from '../Input';
import { updatePassword } from '@/shared/services/User/update.service';
import * as yup from 'yup';

interface HeaderProps {
  isLogin: boolean;
}

export const Header = ({ isLogin }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const [routes, setRoutes] = useState<IRoutes[]>(RoutesProps);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setModalIsOpen((state) => !state);
  };

  const toggleDropdown = () => {
    setIsOpen((state) => !state);
  };

  const toggleDrawer = () => {
    setIsOpenDrawer((state) => !state);
  };

  const handleToggleOpen = (title: string) => {
    const updatedRoutes = routes.map((route) => {
      if (route.title === title && route.children) {
        return { ...route, open: !route.open };
      }
      return route;
    });

    setRoutes(updatedRoutes);
  };

  const FormSchema = yup.object().shape({
    senhaNova: yup.string().required(),
  });

  const submit = (senhaNova: string) => {
    updatePassword({ senhaNova, idUsuario: user.id || '' }).then(() => {
      toggleModal();
    });
  };

  return (
    <>
      {isLogin ? (
        <>
          <header className="flex items-center justify-between w-screen px-4 py-2 bg-background-600">
            <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer}>
              <NestedRoutes
                routes={routes}
                onToggleOpen={handleToggleOpen}
                onClose={toggleDrawer}
              />
            </Drawer>

            <div onClick={toggleDrawer} className="text-white cursor-pointer">
              <List size={32} />
            </div>

            <div
              className="flex relative items-center gap-2 z-10 cursor-pointer"
              onClick={toggleDropdown}
            >
              <span className="text-white">{user.name}</span>
              <div className="rounded-full bg-white p-2 select-none">
                <Image src="/img/user.png" alt="Teste" width={32} height={32} />
              </div>

              {isOpen && (
                <>
                  <div className="absolute border top-full text-center right-0 mt-3 w-40 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                    <button
                      className="block w-full px-4 py-2 hover:bg-gray-100 rounded-ss-lg rounded-se-lg"
                      onClick={() => {
                        toggleDropdown();
                        toggleModal();
                      }}
                    >
                      Trocar Senha
                    </button>

                    <button
                      onClick={() => {
                        toggleDropdown();
                        logout();
                      }}
                      className="block w-full px-4 py-2 hover:bg-gray-100 rounded-ee-lg rounded-es-lg"
                    >
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </header>
          {isOpen && (
            <div
              className="absolute z-0 w-screen h-screen left-0 top-0"
              onClick={toggleDropdown}
            />
          )}
        </>
      ) : null}

      <Modal isOpen={modalIsOpen} onClose={toggleModal}>
        <Formik
          initialValues={{ senhaNova: '' }}
          onSubmit={(values) => submit(values.senhaNova)}
          validationSchema={FormSchema}
        >
          {({ errors }) => (
            <Form className="items-center flex justify-center flex-col px-8 py-4">
              <div className="text-center mb-2">
                <h1 className="font-bold text-3xl">Alterar senha</h1>
                <span className="font-semibold text-gray-300 text-sm">
                  Tenha certeza que irá se lembrar dessa senha
                </span>
              </div>

              <div className="w-full my-2">
                <label htmlFor="senhaNova">Nova Senha</label>
                <FormInput
                  id="senhaNova"
                  name="senhaNova"
                  error={errors.senhaNova || null}
                />
              </div>

              <button
                type="submit"
                className="bg-gray-100 font-bold py-1 px-4 ml-2 mt-2 rounded-full text-black"
              >
                Trocar Senha
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
