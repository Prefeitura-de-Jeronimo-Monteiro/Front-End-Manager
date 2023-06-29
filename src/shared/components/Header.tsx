import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../contexts/Auth";

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
  const { logout } = useContext(AuthContext);

  const routes = [{ title: "Dashboard", href: "dashboard" }];

  return (
    <>
      {isLogin ? (
        <header className="flex items-center justify-between w-screen px-4 py-2 bg-background-600">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.png" alt="logo" className="w-12" />
          </Link>

          <ul className="flex gap-3 items-center">
            {routes.map((route) => (
              <Routes title={route.title} href={route.href} key={route.title} />
            ))}
          </ul>
        </header>
      ) : null}
    </>
  );
};
