import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/Auth';
import Image from 'next/image';
import { List } from '@phosphor-icons/react';
import { Drawer } from '../Drawer';
import { IRoutes } from '../../interfaces/RoutesData';
import { RoutesProps } from '../../routes';
import { NestedRoutes } from './Route';

interface HeaderProps {
  isLogin: boolean;
}

export const Header = ({ isLogin }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const [routes, setRoutes] = useState<IRoutes[]>(RoutesProps);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
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
                  <div className="absolute border top-full text-center right-0 mt-3 w-28 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                    <Link
                      href="/user/update"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-ss-lg rounded-se-lg"
                      onClick={toggleDropdown}
                    >
                      Perfil
                    </Link>

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
    </>
  );
};
