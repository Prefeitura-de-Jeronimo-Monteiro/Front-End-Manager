import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/Auth";
import Image from "next/image";

interface RoutesProps {
  href: string;
  title: string;
}

const Routes = ({ href, title }: RoutesProps) => {
  return (
    <li>
      <Link href={href} className="py-2 px-4 bg-white rounded font-semibold">
        {title}
      </Link>
    </li>
  );
};

interface HeaderProps {
  isLogin: boolean;
}

export const Header = ({ isLogin }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const routes = [{ title: "Dashboard", href: "dashboard" }];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isLogin ? (
        <>
          <header className="flex items-center justify-between w-screen px-4 py-2 bg-background-600">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo.png" alt="logo" className="w-12" />
            </Link>

            <ul className="flex gap-3 items-center">
              {routes.map((route) => (
                <Routes
                  title={route.title}
                  href={route.href}
                  key={route.title}
                />
              ))}
            </ul>

            <div className="relative inline-block z-10">
              <div
                className="cursor-pointer rounded-full bg-white p-2"
                onClick={toggleDropdown}
              >
                <Image src="/img/user.png" alt="Teste" width={32} height={32} />
              </div>

              {isOpen && (
                <>
                  <div className="absolute top-full text-center right-0 mt-2 w-28 bg-white divide-y divide-gray-100 rounded-lg shadow">
                    <Link
                      href="user/update"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={toggleDropdown}
                    >
                      Perfil
                    </Link>

                    <button
                      onClick={() => {
                        toggleDropdown();
                        logout();
                      }}
                      className="block w-full px-4 py-2 hover:bg-gray-100"
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
